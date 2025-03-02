"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn, signOut } from "@/lib/auth";

const SignInCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  redirectTo: z.union([z.string().url(), z.literal("/")]),
});

type SignInCredentialsErrors = {
  email?: string[];
  password?: string[];
  redirectTo?: string[];
};

type SignInCredentialsFormState = {
  error?: string;
  errors?: SignInCredentialsErrors;
  payload?: { email?: string | null };
};

export async function signInCredentialsAsync(
  _state: SignInCredentialsFormState | undefined,
  formData: FormData,
) {
  const parsed = SignInCredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      payload: { email: formData.get("email")?.toString() },
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            error: error.message,
            payload: { email: formData.get("email")?.toString() },
          };
        }

        default: {
          return {
            error: error.message,
            payload: { email: formData.get("email")?.toString() },
          };
        }
      }
    }

    throw error;
  }
}

const SignInGoogleSchema = z.object({
  redirectTo: z.union([z.string().url(), z.literal("/")]),
});

type SignInGoogleErrors = {
  redirectTo?: string[];
};

type SignInGoogleFormState = {
  error?: string;
  errors?: SignInGoogleErrors;
};

export async function signInGoogleAsync(
  _state: SignInGoogleFormState | undefined,
  formData: FormData,
) {
  const parsed = SignInGoogleSchema.safeParse({
    redirectTo: formData.get("redirectTo"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("google", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: error.message };
        }

        default: {
          return { error: error.message };
        }
      }
    }

    throw error;
  }
}

export async function signOutAsync() {
  await signOut({ redirectTo: "/sign-in" });
}
