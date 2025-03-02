import Image from "next/image";

import { CredentialsForm } from "@/components/sign-in/credentials-form";
import { GoogleForm } from "@/components/sign-in/google-form";
import { UIThemeSwitch } from "@/components/ui/theme";

export default function Page() {
  return (
    <div className="grid min-h-dvh grid-cols-1 p-4 lg:grid-cols-10 lg:gap-8 lg:p-8">
      <div className="col-span-4 grid grid-rows-[auto_1fr] gap-8">
        <div>
          <UIThemeSwitch />
        </div>

        <div className="mx-auto grid w-full max-w-[480px] gap-8 place-self-center md:p-8">
          <div className="text-center">
            <div className="text-5xl font-bold">{"Welcome"}</div>

            <div className="text-xs">
              {"Mange your transactions with Conduit"}
            </div>
          </div>

          <CredentialsForm />

          <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300">
            <hr className="grow border-zinc-200 dark:border-zinc-800" />
            {"OR"}
            <hr className="grow border-zinc-200 dark:border-zinc-800" />
          </div>

          <GoogleForm />
        </div>
      </div>

      <div className="relative hidden h-full w-full overflow-hidden rounded-2xl bg-indigo-200 p-24 after:absolute after:inset-0 after:h-full after:w-full after:opacity-50 after:filter-[url('/grain.svg#noiseFilter')] md:block lg:col-span-6 dark:bg-indigo-500">
        <div className="relative h-full w-full">
          <Image
            alt="Illustration"
            fill
            priority={true}
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src="/sign-in-illustration.png"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
