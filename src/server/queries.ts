import "server-only";

import { getCurrentUser } from "~/server/auth/core";
import { db } from "~/server/db";
import { imageAlbums, images, users } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { nanoid } from "~/lib/utils";
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

export async function getAllImages(page = 1, limit = 5) {
  return await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
    offset: (page - 1) * limit,
    limit,
  });
}

export async function getRecommendedImages(page = 1, limit = 5) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  return await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user?.id ?? ""),
    orderBy: (model, { desc }) => desc(model.id),
    offset: (page - 1) * limit,
    limit,
  });
}

export async function getUserImages() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  return await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user?.id ?? ""),
    orderBy: (model, { desc }) => desc(model.id),
  });
}

export async function getImageById(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!image) throw new Error("Image not found!");

  // if (image.userId !== user?.id ?? "") throw new Error("Unauthorized!");

  return image;
}

export async function deleteImageById(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, user?.id ?? "")));

  return true;
}

export async function batchDelete(ids: string[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  for (const id of ids) {
    const image = (await db.query.images.findFirst({
      where: (model) => eq(model.id, id),
    }))!;
    if (image.userId !== user?.id) throw new Error("Unauthorized!");

    await db.delete(imageAlbums).where(eq(imageAlbums.imageId, id));
    await db
      .delete(images)
      .where(and(eq(images.id, id), eq(images.userId, user?.id)));
  }

  return true;
}

export async function getUserAlbums() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  return await db.query.albums.findMany({
    where: (model, { eq }) => eq(model.userId, user?.id ?? ""),
    orderBy: (model, { desc }) => desc(model.id),
  });
}

export async function getAlbumById(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  const album = await db.query.albums.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!album) throw new Error("Album not found!");
  if (album.userId !== user?.id ?? "") throw new Error("Unauthorized!");

  return album;
}

export async function getAlbumImages(albumId: string) {
  await getAlbumById(albumId);

  const imageIds = (
    await db.query.imageAlbums.findMany({
      where: (model, { eq }) => eq(model.albumId, albumId),
      orderBy: (model, { desc }) => desc(model.id),
    })
  ).map((i) => i.imageId);

  return await db.query.images.findMany({
    where: (model, { inArray }) =>
      inArray(model.id, imageIds.length > 0 ? imageIds : ["empty"]), // inArray doesn't work with empty array
  });
}

export async function batchAddImagesToAlbum(
  albumId: string,
  imageIds: string[]
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  for (const id of imageIds) {
    await db.insert(imageAlbums).values({
      id: nanoid(),
      albumId,
      imageId: id,
    });
  }

  return true;
}
