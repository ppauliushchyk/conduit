import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import { Header } from "@/components/header";

type LayoutProps = { children: ReactNode };

export default function Layout(props: Readonly<LayoutProps>) {
  const { children } = props;

  return (
    <SessionProvider>
      <div className="container mx-auto grid gap-12 p-4">
        <Header />
        {children}
      </div>
    </SessionProvider>
  );
}
