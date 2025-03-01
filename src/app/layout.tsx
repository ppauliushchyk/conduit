import "@/styles/globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";

import { Header } from "@/components/header";
import { UIThemeWrapper } from "@/components/ui/theme";

export const metadata: Metadata = {
  description: "A place to share my knowledge.",
  title: "Conduit",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <UIThemeWrapper>
        <body className="bg-zinc-200 font-sans text-zinc-900 antialiased dark:bg-zinc-900 dark:font-sans dark:text-zinc-100">
          <div className="container mx-auto grid gap-12 p-4">
            <Header />
            {children}
          </div>
        </body>
      </UIThemeWrapper>
    </html>
  );
}
