"use server";

import { batchDelete, getUserImages } from "./queries";

export const deleteImagesAction = async (imageIds: string[]) => {
    return await batchDelete(imageIds);
}

export async function fetchImages(page = 1, limit = 5) {
    return await getUserImages(page, limit);
}