import "@/styles/globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { twJoin, twMerge } from "tailwind-merge";

import { UIThemeWrapper } from "@/components/ui/theme";
import { UIThemeClasses } from "@/components/ui/types";

export const metadata: Metadata = {
  description: "A place to share my knowledge.",
  title: "Conduit",
};

const bodyCommonClasses = twJoin("font-sans antialiased");
const bodyClasses: UIThemeClasses = {
  dark: twJoin("dark:bg-zinc-900 dark:text-zinc-100"),
  light: twJoin("bg-zinc-100 text-zinc-900"),
};

type RootLayoutProps = { children: ReactNode };

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props;

  return (
    <html lang="en">
      <UIThemeWrapper>
        <body
          className={twMerge(
            bodyCommonClasses,
            bodyClasses.dark,
            bodyClasses.light,
          )}
        >
          {children}
        </body>
      </UIThemeWrapper>
    </html>
  );
}
