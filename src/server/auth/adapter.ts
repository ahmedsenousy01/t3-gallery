import { type Adapter } from "next-auth/adapters";

/**
 * This is a custom adapter for the Drizzle ORM.
 * It is used to connect to the database and perform CRUD operations.
 * Mainly it is used if you want to change the default behavior of the adapter or the database models (users, accounts, etc...).
 * @returns {Adapter}
 * */
export function DrizzleAdapter(): Adapter {
  // TODO: learn more about how to build a custom Drizzle ORM and how to use it
  return {};
}
