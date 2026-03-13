"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

async function requireCartUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?error=Silakan+login+terlebih+dahulu");
  }

  return { supabase, user };
}

async function getPurchasableProductSnapshot(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>, productId: number) {
  const { data: product, error } = await supabase
    .from("products")
    .select("id,stock,is_soldout")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    return { product: null, error: error.message };
  }

  return { product: product ?? null, error: "" };
}

export async function addToCartAction(formData: FormData) {
  const { supabase, user } = await requireCartUser();

  const productId = Number(formData.get("product_id"));
  if (!Number.isFinite(productId) || productId <= 0) {
    redirectWithError("/cart", "Product id tidak valid.");
  }
  const { product, error } = await getPurchasableProductSnapshot(supabase, productId);

  if (error) {
    redirectWithError("/cart", error);
  }

  if (!product) {
    redirectWithError("/cart", "Produk tidak ditemukan.");
  }

  if (product.is_soldout || product.stock <= 0) {
    redirectWithError("/cart", "Produk sedang sold out.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingError) {
    redirectWithError("/cart", existingError.message);
  }

  if (existing) {
    const nextQty = Math.min(product.stock, Math.max(1, existing.quantity + 1));
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: nextQty, is_selected: true })
      .eq("id", existing.id);

    if (updateError) {
      redirectWithError("/cart", updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity: 1,
      is_selected: true,
    });

    if (insertError) {
      redirectWithError("/cart", insertError.message);
    }
  }

  revalidatePath("/cart");
  redirectWithMessage("/cart", "Produk ditambahkan ke cart.");
}

export async function removeCartItemAction(formData: FormData) {
  const cartItemId = Number(formData.get("cart_item_id"));
  if (!Number.isFinite(cartItemId) || cartItemId <= 0) {
    redirectWithError("/cart", "Cart item id tidak valid.");
  }

  const { supabase, user } = await requireCartUser();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    redirectWithError("/cart", error.message);
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function toggleCartItemSelectedAction(formData: FormData) {
  const cartItemId = Number(formData.get("cart_item_id"));
  const nextSelected = String(formData.get("is_selected") ?? "") === "true";

  if (!Number.isFinite(cartItemId) || cartItemId <= 0) {
    redirectWithError("/cart", "Cart item id tidak valid.");
  }

  const { supabase, user } = await requireCartUser();
  const { error } = await supabase
    .from("cart_items")
    .update({ is_selected: nextSelected })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    redirectWithError("/cart", error.message);
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function incrementCartItemQtyAction(formData: FormData) {
  const cartItemId = Number(formData.get("cart_item_id"));
  if (!Number.isFinite(cartItemId) || cartItemId <= 0) {
    redirectWithError("/cart", "Cart item id tidak valid.");
  }

  const { supabase, user } = await requireCartUser();
  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("id,product_id,quantity")
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (itemError) {
    redirectWithError("/cart", itemError.message);
  }

  if (!item) {
    redirectWithError("/cart", "Cart item tidak ditemukan.");
  }

  const { product, error } = await getPurchasableProductSnapshot(supabase, item.product_id);
  if (error) {
    redirectWithError("/cart", error);
  }

  if (!product) {
    redirectWithError("/cart", "Produk tidak ditemukan.");
  }

  if (product.is_soldout || product.stock <= 0) {
    redirectWithError("/cart", "Produk sedang sold out.");
  }

  if (item.quantity >= product.stock) {
    redirectWithError("/cart", "Qty sudah sesuai stok maksimum.");
  }

  const nextQty = Math.min(product.stock, item.quantity + 1);
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity: nextQty })
    .eq("id", item.id)
    .eq("user_id", user.id);

  if (updateError) {
    redirectWithError("/cart", updateError.message);
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function decrementCartItemQtyAction(formData: FormData) {
  const cartItemId = Number(formData.get("cart_item_id"));
  if (!Number.isFinite(cartItemId) || cartItemId <= 0) {
    redirectWithError("/cart", "Cart item id tidak valid.");
  }

  const { supabase, user } = await requireCartUser();
  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("id,quantity")
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (itemError) {
    redirectWithError("/cart", itemError.message);
  }

  if (!item) {
    redirectWithError("/cart", "Cart item tidak ditemukan.");
  }

  const nextQty = Math.max(1, item.quantity - 1);
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity: nextQty })
    .eq("id", item.id)
    .eq("user_id", user.id);

  if (updateError) {
    redirectWithError("/cart", updateError.message);
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function selectAllCartItemsAction() {
  const { supabase, user } = await requireCartUser();
  const { error } = await supabase
    .from("cart_items")
    .update({ is_selected: true })
    .eq("user_id", user.id);

  if (error) {
    redirectWithError("/cart", error.message);
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function deselectAllCartItemsAction() {
  const { supabase, user } = await requireCartUser();
  const { error } = await supabase
    .from("cart_items")
    .update({ is_selected: false })
    .eq("user_id", user.id);

  if (error) {
    redirectWithError("/cart", error.message);
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function clearSelectedCartItemsAction() {
  const { supabase, user } = await requireCartUser();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("is_selected", true);

  if (error) {
    redirectWithError("/cart", error.message);
  }

  revalidatePath("/cart");
  redirectWithMessage("/cart", "Item yang dipilih berhasil dihapus.");
}
