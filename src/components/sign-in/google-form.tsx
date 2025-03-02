"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { UIButton } from "../ui/button";

import { signInGoogleAsync } from "@/app/actions/auth";

export function GoogleForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [state, formAction, isPending] = useActionState(
    signInGoogleAsync,
    undefined,
  );

  return (
    <form action={formAction} className="grid gap-2" noValidate>
      <input name="redirectTo" type="hidden" value={callbackUrl} />

      <UIButton
        className="w-full"
        disabled={isPending}
        type="submit"
        variant="zinc-outline"
      >
        {"Sign in with Google"}
      </UIButton>

      {state?.error && (
        <span className="text-xs font-medium text-red-600">{state?.error}</span>
      )}
    </form>
  );
}
