"use server";

import { signIn, signOut } from "../auth";
import { DEFAULT_REDIRECT_ROUTE } from "./routes";

export async function serverSideSignIn() {
  await signIn();
}

export async function serverSideSignOut(destination?: string) {
  await signOut({
    redirectTo: `/refresh?destination=${destination ?? DEFAULT_REDIRECT_ROUTE}`,
  });
}
