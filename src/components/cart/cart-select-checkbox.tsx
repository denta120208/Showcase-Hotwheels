"use client";

import { useRef } from "react";

import { toggleCartItemSelectedAction } from "@/app/actions/cart";

export function CartSelectCheckbox({
  cartItemId,
  defaultChecked,
  disabled = false,
}: {
  cartItemId: number;
  defaultChecked: boolean;
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <form ref={formRef} action={toggleCartItemSelectedAction}>
      <input type="hidden" name="cart_item_id" value={cartItemId} />
      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200">
        <input
          type="checkbox"
          name="is_selected"
          value="true"
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={() => formRef.current?.requestSubmit()}
          className="h-4 w-4 accent-emerald-400"
        />
        Pilih
      </label>
    </form>
  );
}

