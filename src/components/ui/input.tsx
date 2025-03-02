"use client";

import { InputHTMLAttributes, useCallback } from "react";
import { twJoin, twMerge } from "tailwind-merge";

import { UIThemeClasses } from "./types";

const commonInputClasses = twJoin(
  "w-full rounded-lg border-1 px-3 py-2 text-base leading-6",
  "focus:ring-2 focus:outline-none",
  "disabled:pointer-events-none disabled:opacity-50",
);
const inputClasses: UIThemeClasses = {
  dark: twJoin(
    "dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-indigo-50",
    "dark:focus:border-indigo-300/50 dark:focus:ring-indigo-300/50",
    "dark:data-[invalid=true]:focus:border-red-300/50 dark:data-[invalid=true]:focus:ring-red-300/50",
  ),
  light: twJoin(
    "border-zinc-200 bg-zinc-200/50 text-indigo-950",
    "focus:border-indigo-600/50 focus:ring-indigo-600/50",
    "data-[invalid=true]:focus:border-red-600/50 data-[invalid=true]:focus:ring-red-600/50",
  ),
};

const errorCommonClasses = twJoin("text-xs font-medium");
const errorClasses: UIThemeClasses = {
  dark: twJoin("dark:text-red-300"),
  light: twJoin("text-red-600"),
};

type UIInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | string[];
  label?: string;
};

export function UIInput(props: UIInputProps) {
  const { className, error, id, label, ...rest } = props;

  const renderError = useCallback(
    (item: string) => (
      <span
        className={twMerge(
          errorCommonClasses,
          errorClasses.dark,
          errorClasses.light,
        )}
      >
        {item}
      </span>
    ),
    [],
  );

  return (
    <div className="grid gap-1">
      <label htmlFor={id}>{label}</label>

      <input
        {...rest}
        className={twMerge(
          commonInputClasses,
          inputClasses.dark,
          inputClasses.light,
          className,
        )}
        data-invalid={!!error}
        id={id}
      />

      {error &&
        (Array.isArray(error) ? error.map(renderError) : renderError(error))}
    </div>
  );
}
