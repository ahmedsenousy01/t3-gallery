import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { env } from "~/env";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
