"use client";

import { useState } from "react";

import { ValidatedImageInput } from "@/components/admin/validated-image-input";

type GalleryImageInputsProps = {
  idBase: string;
  inputClassName?: string;
  hintClassName?: string;
  buttonClassName?: string;
};

export function GalleryImageInputs({
  idBase,
  inputClassName,
  hintClassName,
  buttonClassName,
}: GalleryImageInputsProps) {
  const [inputs, setInputs] = useState([0]);

  return (
    <div className="space-y-2">
      {inputs.map((key, index) => (
        <ValidatedImageInput
          key={key}
          id={index === 0 ? idBase : `${idBase}-${key}`}
          name="gallery_images"
          multiple
          className={
            inputClassName ??
            "w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 text-sm text-slate-200 file:mb-2 file:mr-0 file:w-full file:rounded-lg file:border-0 file:bg-sky-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-slate-900 sm:file:mb-0 sm:file:mr-3 sm:file:w-auto sm:file:py-1"
          }
        />
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            setInputs((prev) => [...prev, prev.length === 0 ? 0 : prev[prev.length - 1] + 1])
          }
          className={
            buttonClassName ??
            "rounded-lg border border-sky-200/40 px-3 py-1.5 text-xs font-semibold text-sky-100 hover:bg-sky-200/10"
          }
        >
          + Tambah Foto
        </button>
        <span className={hintClassName ?? "text-[11px] text-slate-400"}>
          Maks 3 MB per foto. Bisa pilih banyak file sekaligus, atau klik Tambah Foto
          untuk tambah pilihan.
        </span>
      </div>
    </div>
  );
}
