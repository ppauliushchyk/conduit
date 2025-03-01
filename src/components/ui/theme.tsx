"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { twJoin, twMerge } from "tailwind-merge";

import { UIToggle } from "./toggle";
import { Theme, UIThemeClasses } from "./types";

const themes: { [key: string]: Theme } = {
  dark: "dark",
  light: "light",
};

function useTheme() {
  const [theme, setTheme] = useState<Theme>(themes.system);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme;

    if (!stored) {
      if (window.matchMedia) {
        const system = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? themes.dark
          : themes.light;

        setTheme(system);
      }
    } else {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleChange = useCallback((value: Theme) => {
    setTheme(value);

    const system: Theme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? themes.dark
        : themes.light;

    if (system === value) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", value);
    }
  }, []);

  return useMemo(
    () => ({
      setTheme: handleChange,
      theme,
    }),
    [handleChange, theme],
  );
}

type ContextType = ReturnType<typeof useTheme> | null;

const ThemeContext = createContext<ContextType>(null);

function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "Theme components must be wrapped in the Wrapper component",
    );
  }

  return context;
}

export function UIThemeSwitch() {
  const { theme, setTheme } = useThemeContext();

  if (!theme) {
    return <UIThemeSwitchSkeleton />;
  }

  return (
    <UIToggle.Wrapper onValueChange={setTheme} value={theme}>
      <UIToggle.Item Icon={MdOutlineLightMode} value={themes.light} />
      <UIToggle.Item Icon={MdOutlineDarkMode} value={themes.dark} />
    </UIToggle.Wrapper>
  );
}

const skeletonClasses: UIThemeClasses = {
  dark: twJoin("dark:border-zinc-500 dark:bg-zinc-800"),
  light: twJoin("border-zinc-500 bg-zinc-300"),
};

function UIThemeSwitchSkeleton() {
  return (
    <div
      className={twMerge(
        "h-[42px] w-[82px] animate-pulse rounded-full",
        skeletonClasses.dark,
        skeletonClasses.light,
      )}
    />
  );
}

type UIThemeWrapperProps = { children: ReactNode };

export function UIThemeWrapper(props: Readonly<UIThemeWrapperProps>) {
  const { children } = props;

  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
