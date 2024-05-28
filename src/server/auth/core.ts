import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "~/server/db";
import { accounts, users } from "~/server/db/schema";
import authConfig from "./config";
import { env } from "~/env";
import { getUserById } from "../queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token }) {
      const { sub } = token;
      if (!sub) return token;

      const currentUser = await getUserById(sub);
      if (!currentUser) return token;

      token.role = currentUser.role;
      return token;
    },
    async session({ session, token }) {
      const { sub, role } = token;

      if (role && session.user) session.user.role = role as "admin" | "user";
      if (sub && session.user) session.user.id = sub;

      return session;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  session: { strategy: "jwt" },
  secret: env.AUTH_SECRET,
  // pages: {
  //   signIn: '/auth/login',
  //   signOut: '/auth/logout',
  //   error: '/auth/error',
  //   verifyRequest: '/auth/verify-request',
  //   newUser: '/auth/new-user'
  // },
  ...authConfig,
});

export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user;
};
