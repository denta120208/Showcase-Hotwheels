"use client";

import { useState } from "react";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2.3 12c2.1-4 5.5-6 9.7-6s7.6 2 9.7 6c-2.1 4-5.5 6-9.7 6s-7.6-2-9.7-6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M9.7 9.7A3 3 0 0 0 14.3 14.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.4 7.2C4 8.3 3 10 2.3 12c2.1 4 5.5 6 9.7 6 1.9 0 3.7-.4 5.2-1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6 6.1A10 10 0 0 1 12 6c4.2 0 7.6 2 9.7 6-.4.8-.8 1.4-1.3 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  required?: boolean;
};

export function PasswordField({ id, label, required = false }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          required={required}
          className="w-full rounded-xl border border-blue-100/20 bg-slate-950/40 px-4 py-2.5 pr-14 text-sm text-white outline-none focus:border-sky-300/60"
        />
        <button
          type="button"
          onClick={() => setVisible((state) => !state)}
          aria-label={visible ? "Sembunyikan password" : "Lihat password"}
          aria-pressed={visible}
          className="absolute top-1 right-1 bottom-1 inline-flex w-11 items-center justify-center rounded-lg border border-cyan-200/30 bg-slate-800/80 text-cyan-100 shadow-[0_0_0_1px_rgba(15,23,42,0.2)] transition hover:bg-slate-700/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        >
          {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
