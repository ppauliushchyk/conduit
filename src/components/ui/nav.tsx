"use client";

import type { HTMLMotionProps } from "motion/react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import type { IconType } from "react-icons/lib";
import { twJoin, twMerge } from "tailwind-merge";

import { UIThemeClasses } from "./types";

type NavProps = {
  id?: string;
};

function useNav(props: NavProps) {
  const { id: controlledId } = props;

  const uncontrolledId = useId();
  const id = controlledId ?? uncontrolledId;

  return useMemo(() => ({ id }), [id]);
}

type ContextType = ReturnType<typeof useNav> | null;

const NavContext = createContext<ContextType>(null);

function useNavContext() {
  const context = useContext(NavContext);

  if (!context) {
    throw new Error("Nav components must be wrapped in the Wrapper component");
  }

  return context;
}

const itemCommonClasses = twJoin(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-1 px-6 py-2.5 text-sm leading-5 font-medium",
  "focus:ring-2 focus:outline-none",
);

const itemClasses: UIThemeClasses = {
  dark: twJoin(
    "dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
    "dark:hover:bg-zinc-800/90",
    "dark:focus:ring-zinc-300/50",
    "dark:active:bg-zinc-800",
  ),
  light: twJoin(
    "border-zinc-300 bg-zinc-300 text-zinc-900",
    "hover:bg-zinc-300/80",
    "focus:ring-zinc-700/50",
    "active:bg-zinc-300",
  ),
};

const iconClasses = twJoin("shrink-0 text-lg leading-6");

const indicatorCommonClasses = twMerge(
  "absolute inset-0 z-1 inline-flex items-center justify-center gap-2 rounded-full",
);

const indicatorClasses: UIThemeClasses = {
  dark: twJoin("dark:border-lime-300 dark:bg-lime-300 dark:text-lime-950"),
  light: twJoin("border-lime-500 bg-lime-500 text-lime-950"),
};

type UINavItemProps = {
  children: ReactNode;
  href: string;
  IconLeft?: IconType;
  IconRight?: IconType;
};

const MotionLink = motion(Link);

function Item(props: Readonly<UINavItemProps>) {
  const { children, href, IconLeft, IconRight } = props;

  const pathname = usePathname();

  const { id } = useNavContext();

  return (
    <motion.li className="relative" key={href}>
      <MotionLink
        className={twMerge(
          itemCommonClasses,
          itemClasses.dark,
          itemClasses.light,
        )}
        href={href}
      >
        {IconLeft && <IconLeft className={iconClasses} />}
        <div className="grow text-center">{children}</div>
        {IconRight && <IconRight className={iconClasses} />}

        <AnimatePresence mode="wait">
          {href === pathname && (
            <motion.div
              className={twMerge(
                indicatorCommonClasses,
                indicatorClasses.dark,
                indicatorClasses.light,
              )}
              id={id}
              layoutId={id}
            >
              {IconLeft && <IconLeft className={iconClasses} />}
              {children}
              {IconRight && <IconRight className={iconClasses} />}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionLink>
    </motion.li>
  );
}

type UINavWrapperProps = NavProps &
  HTMLAttributes<HTMLUListElement> &
  HTMLMotionProps<"ul">;

function Wrapper(props: Readonly<UINavWrapperProps>) {
  const { children, className, id, ...rest } = props;

  const nav = useNav({ id });

  return (
    <NavContext.Provider value={nav}>
      <motion.ul {...rest} className={twMerge("flex gap-2", className)}>
        {children}
      </motion.ul>
    </NavContext.Provider>
  );
}

export const UINav = {
  Item,
  Wrapper,
};
