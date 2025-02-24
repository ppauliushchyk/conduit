import { ButtonHTMLAttributes, ReactNode, RefAttributes } from "react";
import type { IconType } from "react-icons/lib";
import { twJoin, twMerge } from "tailwind-merge";

const commonClasses = twMerge(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-1 leading-5 font-medium",
  "focus:ring-2 focus:outline-none",
  "disabled:pointer-events-none disabled:opacity-50",
);

const variantClasses = {
  indigo: twMerge(
    "border-indigo-600 bg-indigo-600 text-indigo-50",
    "hover:bg-indigo-600/90",
    "focus:ring-indigo-600/50",
    "active:bg-indigo-600",
    "dark:border-indigo-300 dark:bg-indigo-300 dark:text-indigo-950",
    "dark:hover:bg-indigo-300/90",
    "dark:focus:ring-indigo-300/50",
    "dark:active:bg-indigo-300",
  ),
  lime: twMerge(
    "border-lime-500 bg-lime-500 text-lime-950",
    "hover:bg-lime-500/90",
    "focus:ring-lime-500/50",
    "active:bg-lime-500",
    "dark:border-lime-300 dark:bg-lime-300 dark:text-lime-950",
    "dark:hover:bg-lime-300/90",
    "dark:focus:ring-lime-300/50",
    "dark:active:bg-lime-300",
  ),
  zinc: twMerge(
    "border-zinc-300 bg-zinc-300 text-zinc-900",
    "hover:bg-zinc-300/80",
    "focus:ring-zinc-700/50",
    "active:bg-zinc-300",
    "dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
    "dark:hover:bg-zinc-800/90",
    "dark:focus:ring-zinc-300/50",
    "dark:active:bg-zinc-800",
  ),
  "zinc-inverted": twMerge(
    "border-zinc-700 bg-zinc-700 text-zinc-100",
    "hover:bg-zinc-700/90",
    "focus:ring-zinc-700/50",
    "active:bg-zinc-700",
    "dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900",
    "dark:hover:bg-zinc-200/90",
    "dark:focus:ring-zinc-300/50",
    "dark:active:bg-zinc-200",
  ),
  "zinc-outline": twMerge(
    "border-zinc-500 bg-zinc-200 text-zinc-900",
    "hover:bg-zinc-300/80",
    "focus:border-zinc-200 focus:ring-zinc-700/50",
    "active:bg-zinc-300",
    "dark:border-zinc-500 dark:bg-zinc-900 dark:text-zinc-100",
    "dark:hover:bg-zinc-800/90",
    "dark:focus:border-zinc-900 dark:focus:ring-zinc-300/50",
    "dark:active:bg-zinc-800",
  ),
};

const iconClasses = twMerge("p-2.5 text-xl");
const textClasses = twMerge("px-6 py-2.5 text-sm");

const iconLeftClasses = twJoin("ps-4");
const iconRightClasses = twJoin("pe-4");

const iconSideClasses = twMerge("shrink-0 text-lg leading-6");

type CommonProps = {
  variant?: keyof typeof variantClasses;
};

type IconProps = {
  "aria-label": string;
  children?: never;
  Icon?: IconType;
  IconLeft?: never;
  IconRight?: never;
};

type TextProps = {
  "aria-label"?: string;
  children?: ReactNode;
  Icon?: never;
  IconLeft?: IconType;
  IconRight?: IconType;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement> &
  CommonProps &
  (IconProps | TextProps);

export function Button(props: Readonly<ButtonProps>) {
  const {
    "aria-label": label,
    children,
    className,
    Icon,
    IconLeft,
    IconRight,
    variant = "zinc-outline",
    ...rest
  } = props;

  if (Icon) {
    return (
      <button
        aria-label={label}
        className={twMerge(
          commonClasses,
          iconClasses,
          variantClasses[variant],
          className,
        )}
        {...rest}
      >
        <Icon className="shrink-0" />
      </button>
    );
  }

  return (
    <button
      aria-label={label}
      className={twMerge(
        commonClasses,
        textClasses,
        variantClasses[variant],
        IconLeft && iconLeftClasses,
        IconRight && iconRightClasses,
        className,
      )}
      {...rest}
    >
      {IconLeft && <IconLeft className={iconSideClasses} />}
      <div className="grow text-center">{children}</div>
      {IconRight && <IconRight className={iconSideClasses} />}
    </button>
  );
}
