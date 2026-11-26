"use client";

import { useId } from "react";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  label = "Search",
  placeholder = "Search",
  id,
  name = "search",
  disabled = false,
  className = "",
}: SearchBarProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-sm font-medium text-slate-700"
        htmlFor={inputId}
      >
        {label}
      </label>
      <input
        autoComplete="off"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        disabled={disabled}
        id={inputId}
        name={name}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
