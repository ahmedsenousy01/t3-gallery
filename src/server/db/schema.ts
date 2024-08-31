import { type InferSelectModel, sql } from "drizzle-orm";
import {
  char,
  pgTableCreator,
  timestamp,
  varchar,
  primaryKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

import type { AdapterAccountType } from "next-auth/adapters";
import { nanoid } from "~/lib/utils";

export const createTable = pgTableCreator((name) => `t3-gallery_${name}`);

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const users = createTable("user", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  name: varchar("name"),
  email: varchar("email").notNull(),
  password: varchar("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  role: userRoleEnum("user_role").notNull().default("user"),
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

export const followers = createTable(
  "follower",
  {
    followerId: varchar("follower_id")
      .notNull()
      .references(() => users.id),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
  },
  (follower) => ({
    compoundKey: primaryKey({
      columns: [follower.followerId, follower.userId],
    }),
  })
);

export const posts = createTable("post", {
  id: char("id", { length: 20 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  imageUrl: varchar("image_url", { length: 1024 }).notNull(),
  caption: varchar("post_caption", { length: 1024 }).notNull(),
  userId: varchar("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export const likes = createTable(
  "like",
  {
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: char("post_id", { length: 20 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (like) => ({
    compoundKey: primaryKey({
      columns: [like.userId, like.postId],
    }),
  })
);

export const comments = createTable(
  "comment",
  {
    postId: char("post_id", { length: 20 })
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    comment: varchar("comment"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (comment) => ({
    compoundKey: primaryKey({
      columns: [comment.postId, comment.userId],
    }),
  })
);

export type User = InferSelectModel<typeof users>;
export type Account = InferSelectModel<typeof accounts>;
export type Post = InferSelectModel<typeof posts>;
export type Like = InferSelectModel<typeof likes>;
export type Comment = InferSelectModel<typeof comments>;

export type PostDetails = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  likesCount?: number;
  commentsCount?: number;
};
