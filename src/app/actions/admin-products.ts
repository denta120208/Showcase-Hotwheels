"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { toSlug } from "@/lib/utils";

const STORAGE_BUCKET = "product-images";

function toBool(value: FormDataEntryValue | null) {
  if (!value) {
    return false;
  }
  return String(value) === "on" || String(value) === "true";
}

function toPrice(value: FormDataEntryValue | null) {
  const parsed = Number(String(value ?? "0").replace(/[^\d]/g, ""));
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

function toStock(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function uploadImage(file: File, folder: "cover" | "gallery") {
  const admin = createAdminSupabaseClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const safeBase = safeName.replace(/\.[^.]+$/, "");
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeBase}.${extension}`;

  const { error } = await admin.storage.from(STORAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = admin.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

async function deleteStorageObjects(paths: (string | null)[]) {
  const toDelete = paths.filter((path): path is string => Boolean(path));
  if (toDelete.length === 0) {
    return;
  }

  const admin = createAdminSupabaseClient();
  await admin.storage.from(STORAGE_BUCKET).remove(toDelete);
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const admin = createAdminSupabaseClient();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = toPrice(formData.get("price"));
  const stock = toStock(formData.get("stock"));
  const isLimited = toBool(formData.get("is_limited"));
  const isSoldOut = toBool(formData.get("is_soldout"));
  const coverImage = formData.get("cover_image");
  const galleryFiles = formData
    .getAll("gallery_images")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (!name || !price) {
    redirectWithError(
      "/admin/products/new",
      "Nama dan harga produk wajib diisi.",
    );
  }

  if (!(coverImage instanceof File) || coverImage.size === 0) {
    redirectWithError(
      "/admin/products/new",
      "Cover image wajib diupload untuk produk baru.",
    );
  }

  const slug = toSlug(name) || `produk-${Date.now()}`;

  const uploadedCover = await uploadImage(coverImage, "cover");

  const { data: product, error: productError } = await admin
    .from("products")
    .insert({
      name,
      slug,
      description: description || null,
      price,
      stock,
      is_limited: isLimited,
      is_soldout: isSoldOut,
      image_url: uploadedCover.publicUrl,
      image_path: uploadedCover.path,
    })
    .select("id")
    .single();

  if (productError || !product) {
    await deleteStorageObjects([uploadedCover.path]);
    redirectWithError(
      "/admin/products/new",
      productError?.message ?? "Gagal menyimpan produk baru.",
    );
  }

  if (galleryFiles.length > 0) {
    const insertedRows: {
      product_id: number;
      image_url: string;
      image_path: string;
      sort_order: number;
    }[] = [];

    for (const [index, file] of galleryFiles.entries()) {
      const uploaded = await uploadImage(file, "gallery");
      insertedRows.push({
        product_id: product.id,
        image_url: uploaded.publicUrl,
        image_path: uploaded.path,
        sort_order: index + 1,
      });
    }

    if (insertedRows.length > 0) {
      await admin.from("product_images").insert(insertedRows);
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  revalidatePath(`/products/${product.id}`);
  redirect("/admin?message=Produk+berhasil+ditambahkan");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();

  const admin = createAdminSupabaseClient();

  const productId = Number(formData.get("product_id"));
  if (!productId) {
    redirectWithError("/admin", "Product id tidak valid.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = toPrice(formData.get("price"));
  const stock = toStock(formData.get("stock"));
  const isLimited = toBool(formData.get("is_limited"));
  const isSoldOut = toBool(formData.get("is_soldout"));
  const newCoverImage = formData.get("cover_image");
  const galleryFiles = formData
    .getAll("gallery_images")
    .filter((item): item is File => item instanceof File && item.size > 0);
  const removeImageIds = formData
    .getAll("remove_image_ids")
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value));

  if (!name || !price) {
    redirectWithError(
      `/admin/products/${productId}/edit`,
      "Nama dan harga produk wajib diisi.",
    );
  }

  const { data: existingProduct } = await admin
    .from("products")
    .select("id, image_path")
    .eq("id", productId)
    .maybeSingle();

  if (!existingProduct) {
    redirectWithError("/admin", "Produk tidak ditemukan.");
  }

  const updates: {
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    is_limited: boolean;
    is_soldout: boolean;
    image_url?: string;
    image_path?: string;
  } = {
    name,
    slug: toSlug(name) || `produk-${productId}`,
    description: description || null,
    price,
    stock,
    is_limited: isLimited,
    is_soldout: isSoldOut,
  };

  if (newCoverImage instanceof File && newCoverImage.size > 0) {
    const uploadedCover = await uploadImage(newCoverImage, "cover");
    updates.image_url = uploadedCover.publicUrl;
    updates.image_path = uploadedCover.path;
    await deleteStorageObjects([existingProduct.image_path]);
  }

  const { error: updateError } = await admin
    .from("products")
    .update(updates)
    .eq("id", productId);

  if (updateError) {
    redirectWithError(
      `/admin/products/${productId}/edit`,
      `Gagal update produk: ${updateError.message}`,
    );
  }

  if (removeImageIds.length > 0) {
    const { data: rowsToRemove } = await admin
      .from("product_images")
      .select("id, image_path")
      .in("id", removeImageIds)
      .eq("product_id", productId);

    if (rowsToRemove && rowsToRemove.length > 0) {
      await admin
        .from("product_images")
        .delete()
        .in(
          "id",
          rowsToRemove.map((row) => row.id),
        );

      await deleteStorageObjects(rowsToRemove.map((row) => row.image_path));
    }
  }

  if (galleryFiles.length > 0) {
    const { data: latestImages } = await admin
      .from("product_images")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const startOrder =
      latestImages && latestImages.length > 0 ? latestImages[0].sort_order + 1 : 1;

    const newRows: {
      product_id: number;
      image_url: string;
      image_path: string;
      sort_order: number;
    }[] = [];

    for (const [index, file] of galleryFiles.entries()) {
      const uploaded = await uploadImage(file, "gallery");
      newRows.push({
        product_id: productId,
        image_url: uploaded.publicUrl,
        image_path: uploaded.path,
        sort_order: startOrder + index,
      });
    }

    if (newRows.length > 0) {
      await admin.from("product_images").insert(newRows);
    }
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect(`/admin/products/${productId}/edit?message=Produk+berhasil+diupdate`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const admin = createAdminSupabaseClient();
  const productId = Number(formData.get("product_id"));

  if (!productId) {
    redirectWithError("/admin", "Product id tidak valid.");
  }

  const [{ data: product }, { data: gallery }] = await Promise.all([
    admin
      .from("products")
      .select("id, image_path")
      .eq("id", productId)
      .maybeSingle(),
    admin
      .from("product_images")
      .select("id, image_path")
      .eq("product_id", productId),
  ]);

  await admin.from("product_images").delete().eq("product_id", productId);
  await admin.from("products").delete().eq("id", productId);

  const galleryPaths = (gallery ?? []).map((row) => row.image_path);
  await deleteStorageObjects([product?.image_path ?? null, ...galleryPaths]);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/admin?message=Produk+berhasil+dihapus");
}
