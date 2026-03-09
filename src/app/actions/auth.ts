"use server";

import { redirect } from "next/navigation";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasCompletedAddressProfile } from "@/lib/user-profile";

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

type AdminLoginConfig = {
  username: string;
  email: string;
  password: string;
  name: string;
};

function normalizeEmail(value: string) {
  return value.trim().replace(/^['"]+|['"]+$/g, "").toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getAdminLoginConfig(): AdminLoginConfig {
  return {
    username: (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase(),
    email: (process.env.ADMIN_EMAIL ?? "admin@gii-diecast.local").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "AdminGii2026!",
    name: (process.env.ADMIN_NAME ?? "Admin Gii.Diecast").trim(),
  };
}

function getLoginPath(intent: string) {
  return intent === "admin" ? "/admin" : "/auth/login";
}

function normalizeIdentifier(value: string) {
  return value.trim().replace(/^['"]+|['"]+$/g, "").toLowerCase();
}

async function findAuthUserByEmail(email: string) {
  const admin = createAdminSupabaseClient();
  let page = 1;
  const perPage = 200;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(error.message);
    }

    const found = data.users.find((item) => item.email?.toLowerCase() === email);

    if (found) {
      return found;
    }

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  return null;
}

async function ensureDefaultAdminAccount() {
  const admin = createAdminSupabaseClient();
  const config = getAdminLoginConfig();

  let userId: string | null = null;
  const existing = await findAuthUserByEmail(config.email);

  if (existing) {
    userId = existing.id;
    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password: config.password,
      email_confirm: true,
      user_metadata: {
        name: config.name,
      },
    });

    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: config.email,
      password: config.password,
      email_confirm: true,
      user_metadata: {
        name: config.name,
      },
    });

    if (createError || !created.user) {
      throw new Error(createError?.message ?? "Gagal membuat akun admin default.");
    }

    userId = created.user.id;
  }

  if (!userId) {
    throw new Error("Gagal mendapatkan user id admin.");
  }

  const { error: profileError } = await admin.from("users").upsert(
    {
      id: userId,
      name: config.name,
      email: config.email,
      role: "admin",
    },
    { onConflict: "id" },
  );

  if (profileError) {
    throw new Error(profileError.message);
  }

  return config;
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const tiktok = String(formData.get("tiktok") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!name || !phone || !email || !password) {
    redirectWithError("/auth/register", "Nama, no telp, email, dan password wajib diisi.");
  }

  if (password.length < 6) {
    redirectWithError("/auth/register", "Password minimal 6 karakter.");
  }

  if (!isValidEmail(email)) {
    redirectWithError("/auth/register", "Format email tidak valid. Contoh: nama@gmail.com");
  }

  const supabase = await createServerSupabaseClient();
  const admin = createAdminSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  let userId = data.user?.id ?? null;
  let hasSession = Boolean(data.session);
  let fallbackUsed = false;

  if (error || !data.user) {
    const message = error?.message.toLowerCase() ?? "";
    const shouldFallback =
      message.includes("rate limit exceeded") || message.includes("is invalid");

    if (!shouldFallback) {
      redirectWithError("/auth/register", error?.message ?? "Gagal membuat user di Supabase.");
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

    if (createError || !created.user) {
      redirectWithError(
        "/auth/register",
        createError?.message ?? "Gagal membuat user fallback di Supabase.",
      );
    }

    userId = created.user.id;
    fallbackUsed = true;

    const { data: signedIn } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    hasSession = Boolean(signedIn.user);
  }

  if (!userId) {
    redirectWithError("/auth/register", "Gagal membuat user di Supabase.");
  }

  const { error: profileError } = await admin.from("users").upsert(
    {
      id: userId,
      name,
      phone: phone || null,
      tiktok: tiktok || null,
      email,
      role: "user",
    },
    { onConflict: "id" },
  );

  if (profileError) {
    redirectWithError("/auth/register", profileError.message);
  }

  if (hasSession) {
    redirect(
      "/user/profile?message=Akun+berhasil+dibuat.+Sekarang+isi+alamat+wajib+terlebih+dahulu.",
    );
  }

  if (fallbackUsed) {
    redirectWithMessage(
      "/auth/login",
      "Akun berhasil dibuat. Login lalu isi alamat wajib sebelum akses produk.",
    );
  }

  redirectWithMessage(
    "/auth/login",
    "Akun berhasil dibuat. Silakan cek email verifikasi, lalu login untuk isi alamat wajib.",
  );
}

export async function loginAction(formData: FormData) {
  const intent = String(formData.get("intent") ?? "user");
  const identifierField = intent === "admin" ? "identifier" : "email";
  const identifier = normalizeIdentifier(String(formData.get(identifierField) ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    const path = getLoginPath(intent);
    const identityLabel = intent === "admin" ? "Username/email" : "Email";
    redirectWithError(path, `${identityLabel} dan password wajib diisi.`);
  }

  let email = identifier;
  let adminConfig: AdminLoginConfig | null = null;

  if (intent === "admin") {
    try {
      adminConfig = await ensureDefaultAdminAccount();
      const aliases = new Set(
        [
          adminConfig.username,
          adminConfig.email,
          "admin",
          "admingmail.com",
          "admin@gmail.com",
          "admin@gii-diecast.local",
        ].map(normalizeIdentifier),
      );

      email = aliases.has(identifier) ? adminConfig.email : identifier;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyiapkan akun admin.";
      redirectWithError("/admin", message);
    }
  }

  const supabase = await createServerSupabaseClient();

  if (intent === "admin") {
    await supabase.auth.signOut();
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    const path = getLoginPath(intent);
    if (intent === "admin" && error?.message) {
      redirectWithError(path, `Login admin gagal: ${error.message}`);
    }
    const adminHint = adminConfig ? ` Username: ${adminConfig.username}` : "";
    redirectWithError(path, `Email atau password tidak valid.${adminHint}`);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role,address_detail,village,regency,district,province,postal_code")
    .eq("id", data.user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  if (intent === "admin" && !isAdmin) {
    await supabase.auth.signOut();
    redirectWithError("/admin", "Akun ini bukan admin.");
  }

  if (isAdmin) {
    redirect("/admin");
  }

  if (!hasCompletedAddressProfile(profile)) {
    redirect(
      "/user/profile?message=Lengkapi+alamat+wajib+terlebih+dahulu+sebelum+mengakses+produk.",
    );
  }

  redirect("/home");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
