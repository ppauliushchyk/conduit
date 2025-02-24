"use client";

import type { HTMLMotionProps } from "motion/react";
import { motion, AnimatePresence } from "motion/react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import {
  AnchorHTMLAttributes,
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  useId,
} from "react";
import type { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge";

type ContentProps = HTMLAttributes<HTMLUListElement> &
  HTMLMotionProps<"ul"> & { id?: string };

export function Content(props: Readonly<ContentProps>) {
  const { children, className, id: controlledId, ...rest } = props;

  const uncontrolledId = useId();
  const id = controlledId ?? uncontrolledId;

  const mapped = Children.map(children, (item) => {
    if (isValidElement(item)) {
      return cloneElement(item, { navId: id } as Record<string, unknown>);
    }

    return item;
  });

  return (
    <motion.ul {...rest} className={twMerge("flex gap-2", className)}>
      {mapped}
    </motion.ul>
  );
}

const itemCommonClasses = twMerge(
  "inline-flex items-center justify-center gap-2 rounded-full border-1 px-6 py-2.5 text-sm leading-5 font-medium",
);

const itemClasses = twMerge(
  "cursor-pointer",
  "focus:ring-2 focus:outline-none",
  "border-zinc-300 bg-zinc-300 text-zinc-900",
  "hover:bg-zinc-300/80",
  "focus:ring-zinc-700/50",
  "active:bg-zinc-300",
  "dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
  "dark:hover:bg-zinc-800/90",
  "dark:focus:ring-zinc-300/50",
  "dark:active:bg-zinc-800",
);

const itemIconLeftClasses = twMerge("ps-4");
const itemIconRightClasses = twMerge("pe-4");

const itemIconSideClasses = twMerge("shrink-0 text-lg leading-6");

const itemIndicatorClasses = twMerge(
  "absolute inset-0 z-1",
  "border-lime-300 bg-lime-300 text-lime-950",
);

type ItemProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    IconLeft?: IconType;
    IconRight?: IconType;
    navId?: string;
  };

export function Item(props: Readonly<ItemProps>) {
  const { children, href, IconLeft, IconRight, navId, ...rest } = props;

  const pathname = usePathname();

  return (
    <motion.li className="relative">
      <Link
        {...rest}
        className={twMerge(
          itemCommonClasses,
          itemClasses,
          IconLeft && itemIconLeftClasses,
          IconRight && itemIconRightClasses,
        )}
        href={href}
      >
        {IconLeft && <IconLeft className={itemIconSideClasses} />}
        <div className="grow text-center">{children}</div>
        {IconRight && <IconRight className={itemIconSideClasses} />}

        <AnimatePresence mode="wait">
          {href === pathname && (
            <motion.div
              className={twMerge(
                itemCommonClasses,
                itemIndicatorClasses,
                IconLeft && itemIconLeftClasses,
                IconRight && itemIconRightClasses,
              )}
              id={navId}
              layoutId={`${navId}-nav-indicator`}
            >
              {IconLeft && <IconLeft className={itemIconSideClasses} />}
              <motion.div className="grow text-center">{children}</motion.div>
              {IconRight && <IconRight className={itemIconSideClasses} />}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.li>
  );
}
