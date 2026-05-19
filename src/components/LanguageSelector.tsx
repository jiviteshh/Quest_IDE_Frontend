"use client";

import type { LanguageOption } from "@/src/types/judge";

type LanguageSelectorProps = {
  value: number;
  options: LanguageOption[];
  onChange: (languageId: number) => void;
  disabled?: boolean;
};

export default function LanguageSelector({
  value,
  options,
  onChange,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-zinc-300">
      Language
      <select
        className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100 outline-none ring-zinc-500 transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

