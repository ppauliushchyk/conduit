import "@/styles/globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  description: "A place to share my knowledge.",
  title: "Conduit",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
