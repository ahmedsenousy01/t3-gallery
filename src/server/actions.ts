"use server";

import { batchAddImagesToAlbum, batchDelete, getAllImages, getRecommendedImages, getUserAlbums, getUserImages } from "./queries";

export const deleteImagesAction = async (imageIds: string[]) => {
    return await batchDelete(imageIds);
}

export async function fetchAllImages(page = 1, limit = 5) {
    return await getAllImages(page, limit);
}

export async function fetchRecommendedImages(page = 1, limit = 5) {
    return await getRecommendedImages(page, limit);
}

export async function fetchUserImages() {
    return await getUserImages();
}

export async function fetchUserAlbums() {
    return await getUserAlbums();
}

export async function addImagesToAlbum(albumId: string, imageIds: string[]) {
    return await batchAddImagesToAlbum(albumId, imageIds);
}