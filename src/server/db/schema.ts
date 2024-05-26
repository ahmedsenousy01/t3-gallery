// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type InferSelectModel, sql } from "drizzle-orm";
import {
  char,
  index,
  pgTableCreator,
  timestamp,
  varchar,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";

import type { AdapterAccountType } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3-gallery_${name}`);

export const users = createTable("user", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name"),
  email: varchar("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image"),
});

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").$type<AdapterAccountType>().notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("providerAccountId").notNull(),
    refresh_token: varchar("refresh_token"),
    access_token: varchar("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: varchar("id_token"),
    session_state: varchar("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const images = createTable(
  "image",
  {
    id: char("id", { length: 20 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    userId: varchar("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    nameIndex: index("image_name_idx").on(table.name),
  })
);

export const albums = createTable(
  "albums",
  {
    id: char("id", { length: 20 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    userId: varchar("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    nameIndex: index("album_name_idx").on(table.name),
  })
);

export const imageAlbums = createTable("image_albums", {
  id: char("id", { length: 20 }).primaryKey(),
  albumId: char("album_id", { length: 20 })
    .notNull()
    .references(() => albums.id),
  imageId: char("image_id", { length: 20 })
    .notNull()
    .references(() => images.id),
});

export type Image = InferSelectModel<typeof images>;
export type Album = InferSelectModel<typeof albums>;
export type ImageAlbum = InferSelectModel<typeof imageAlbums>;
export type User = InferSelectModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
