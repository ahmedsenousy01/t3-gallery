import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function getUserImages(page = 1, limit = 5) {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized!");

    return await db.query.images.findMany({
        where: (model, { eq }) => eq(model.userId, user.userId),
        orderBy: (model, { desc }) => desc(model.id),
        offset: (page - 1) * limit,
        limit,
    });
}

export async function getImageById(id: string) {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized!");

    const image = await db.query.images.findFirst({
        where: (model, { eq }) => eq(model.id, id),
    });
    if (!image) throw new Error("Image not found!");

    if (image.userId !== user.userId) throw new Error("Unauthorized!");

    return image;
}

export async function deleteImageById(id: string) {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized!");

    await db
        .delete(images)
        .where(and(eq(images.id, id), eq(images.userId, user.userId)));

    return true;
}

export async function batchDelete(ids: string[]) {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized!");

    for (const id of ids) {
        await db
            .delete(images)
            .where(and(eq(images.id, id), eq(images.userId, user.userId)));
    }

    return true;
}

export async function getUserAlbums() {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized!");

    return await db.query.albums.findMany({
        where: (model, { eq }) => eq(model.userId, user.userId),
        orderBy: (model, { desc }) => desc(model.id),
    });
}

export async function getAlbumById(id: string) {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized!");

    const album = await db.query.albums.findFirst({
        where: (model, { eq }) => eq(model.id, id),
    });

    if (!album) throw new Error("Album not found!");
    if (album.userId !== user.userId) throw new Error("Unauthorized!");

    return album;
}

export async function getAlbumImages(albumId: string) {
    await getAlbumById(albumId);

    const imageIds = (await db.query.imageAlbums.findMany({
        where: (model, { eq }) => eq(model.albumId, albumId),
        orderBy: (model, { desc }) => desc(model.id),
    })).map((i) => i.imageId);

    return await db.query.images.findMany({
        where: (model, { inArray }) => inArray(model.id, (imageIds.length > 0 ? imageIds : ["empty"])) // inArray doesn't work with empty array
    });
}