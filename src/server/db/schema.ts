// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type InferSelectModel, sql } from "drizzle-orm";
import {
  char,
  index,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `t3-gallery_${name}`);

export const images = createTable(
  "image",
  {
    id: char("id", { length: 20 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
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
    userId: varchar("userId", { length: 256 }).notNull(),
  },
  (table) => ({
    nameIndex: index("album_name_idx").on(table.name),
  })
);

export const imageAlbums = createTable(
  "image_albums",
  {
    id: char("id", { length: 20 }).primaryKey(),
    albumId: char("album_id", { length: 20 }).notNull().references(() => albums.id),
    imageId: char("image_id", { length: 20 }).notNull().references(() => images.id),
  }
);

export type Image = InferSelectModel<typeof images>;
export type album = InferSelectModel<typeof albums>;
export type ImageAlbum = InferSelectModel<typeof imageAlbums>;