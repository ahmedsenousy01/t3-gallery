"use server";

import { loginSchema, signUpSchema } from "~/schemas";
import { signIn, signOut } from "./core";
import { DEFAULT_REDIRECT_ROUTE } from "./routes";
import { AuthError } from "next-auth";
import { type z } from "zod";
import { createUser } from "../queries";

export async function signUp(credentials: z.infer<typeof signUpSchema>) {
  const validatedFields = signUpSchema.safeParse(credentials);
  if (!validatedFields.success) return null;

  try {
    await createUser(validatedFields.data);
  } catch (error) {
    if ((error as Error).message === "Email already exists") {
      return { error: "Email already exists" };
    }
    return { error: "Something went wrong" };
  }
}

export async function initiateSignIn() {
  await signIn();
}

export async function credentialsSignIn({
  credentials,
  redirectTo,
}: {
  credentials: z.infer<typeof loginSchema>;
  redirectTo?: string;
}) {
  const validatedFields = loginSchema.safeParse(credentials);
  if (!validatedFields.success) return null;

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid email or password" };
        }
        default: {
          return { error: "Something went wrong" };
        }
      }
    }
    // If the error is not an AuthError, rethrow it
    throw error;
  }
}

export async function providerSignIn(
  provider: "google" | "github" | "apple" | "facebook"
) {
  try {
    await signIn(provider);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        default: {
          return { error: "Something went wrong" };
        }
      }
    }
    // If the error is not an AuthError, rethrow it
    throw error;
  }
}

export async function serverSideSignOut(
  destination?: string,
  hardRefresh: "refresh" | "redirect" = "redirect"
) {
  await signOut({
    redirectTo:
      hardRefresh === "refresh"
        ? `/refresh?callbackUrl=${destination ?? DEFAULT_REDIRECT_ROUTE}`
        : undefined,
  });
}
