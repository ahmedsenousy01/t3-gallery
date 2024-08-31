import "server-only";

import { getCurrentUser } from "~/server/auth/core";
import { db } from "~/server/db";
import { comments, likes, posts, users } from "~/server/db/schema";
import { and, count, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { type signUpSchema } from "~/schemas";
import { type z } from "zod";

export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });
}

export async function getUserById(id: string) {
  return await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
}

export async function createUser(user: z.infer<typeof signUpSchema>) {
  const { email } = user;
  const res = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });

  if (res) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(user.password, 10);
  await db.insert(users).values({
    id: crypto.randomUUID(),
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    password: hashedPassword,
  });
}

export async function getAllPosts(page = 1, limit = 5) {
  return await db.query.posts.findMany({
    orderBy: (model, { desc }) => desc(model.id),
    offset: (page - 1) * limit,
    limit,
  });
}

export async function getRecommendedPosts(page = 1, limit = 5) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  return await db.query.posts.findMany({
    where: (model, { eq }) => eq(model.userId, user?.id ?? ""),
    orderBy: (model, { desc }) => desc(model.id),
    offset: (page - 1) * limit,
    limit,
  });
}

export async function getUserPosts() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  return await db.query.posts.findMany({
    where: (model, { eq }) => eq(model.userId, user?.id ?? ""),
    orderBy: (model, { desc }) => desc(model.id),
  });
}

export async function getPostById(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  const post = await db.query.posts.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!post) throw new Error("Post not found!");

  // if (image.userId !== user?.id ?? "") throw new Error("Unauthorized!");

  return post;
}

export async function getPostsRecommendedPostsWithOwners(page = 1, limit = 10) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  return await db
    .select({
      id: posts.id,
      caption: posts.caption,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .limit(limit)
    .offset((page - 1) * limit);
}

export async function deletePostById(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, user?.id ?? "")));

  return true;
}

export async function batchDelete(ids: string[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  for (const id of ids) {
    const post = (await db.query.posts.findFirst({
      where: (model) => eq(model.id, id),
    }))!;
    if (post.userId !== user?.id) throw new Error("Unauthorized!");

    await db.delete(posts).where(eq(posts.id, id));
  }

  return true;
}
