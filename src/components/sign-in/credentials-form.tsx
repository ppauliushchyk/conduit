"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { UIButton } from "../ui/button";
import { UIInput } from "../ui/input";

import { signInCredentialsAsync } from "@/app/actions/auth";

export function CredentialsForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [state, formAction, isPending] = useActionState(
    signInCredentialsAsync,
    undefined,
  );

  return (
    <form action={formAction} className="grid gap-8" noValidate>
      <div className="grid gap-4">
        <UIInput
          defaultValue={state?.payload?.email ?? ""}
          error={state?.errors?.email}
          id="email__input"
          label="Email"
          name="email"
          placeholder="Type email"
          type="email"
        />

        <UIInput
          error={state?.errors?.password}
          id="password__input"
          label="Password"
          name="password"
          placeholder="Type password"
          type="password"
        />

        <input name="redirectTo" type="hidden" value={callbackUrl} />
      </div>

      <div className="grid gap-2">
        <UIButton
          className="w-full"
          disabled={isPending}
          type="submit"
          variant="indigo"
        >
          {"Sign in"}
        </UIButton>

        {state?.error && (
          <span className="text-xs font-medium text-red-600">
            {state?.error}
          </span>
        )}
      </div>
    </form>
  );
}
