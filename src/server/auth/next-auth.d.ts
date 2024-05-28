import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      name: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }
}
