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

import { Toggle } from "./_toggle";
import { Theme } from "./types";

const themes: { [key: string]: Theme } = {
  dark: "dark",
  light: "light",
};

function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || themes.system,
  );

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme;

    if (!stored) {
      if (window.matchMedia) {
        const system = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? themes.dark
          : themes.light;

        setTheme(system);
      }
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

  return (
    <Toggle
      onSelect={setTheme}
      options={[
        {
          label: MdOutlineLightMode,
          value: themes.light,
        },
        {
          label: MdOutlineDarkMode,
          value: themes.dark,
        },
      ]}
      selected={theme}
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
