"use client";

import { useCallback } from "react";
import type { ChangeEvent } from "react";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

type ValidatedImageInputProps = {
  id: string;
  name: string;
  required?: boolean;
  multiple?: boolean;
  className?: string;
  hint?: string;
  hintClassName?: string;
};

export function ValidatedImageInput({
  id,
  name,
  required,
  multiple,
  className,
  hint,
  hintClassName,
}: ValidatedImageInputProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (files.length === 0) {
        return;
      }

      const tooLarge = files.some((file) => file.size > MAX_IMAGE_BYTES);
      if (tooLarge) {
        window.alert("Ukuran foto maksimal 3 MB. Silakan kompres foto.");
        event.target.value = "";
      }
    },
    [],
  );

  return (
    <div className="space-y-1">
      <input
        id={id}
        name={name}
        type="file"
        accept="image/*"
        multiple={multiple}
        required={required}
        onChange={handleChange}
        className={
          className ??
          "w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-200 file:mb-2 file:mr-0 file:w-full file:rounded-lg file:border-0 file:bg-sky-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-slate-900 sm:file:mb-0 sm:file:mr-3 sm:file:w-auto sm:file:py-1"
        }
      />
      {hint ? (
        <p className={hintClassName ?? "text-[11px] text-slate-400"}>{hint}</p>
      ) : null}
    </div>
  );
}
