"use server";

import {
  batchDelete,
  getAllPosts,
  getPostsRecommendedPostsWithOwners,
  getRecommendedPosts,
  getUserPosts,
} from "./queries";

export const deleteImagesAction = async (imageIds: string[]) => {
  return await batchDelete(imageIds);
};

export async function fetchAllPosts(page = 1, limit = 5) {
  return await getAllPosts(page, limit);
}

export async function fetchRecommendedPosts(page = 1, limit = 5) {
  return await getRecommendedPosts(page, limit);
}

export async function fetchUserPosts() {
  return await getUserPosts();
}

export async function fetchRecommendedPostsWithOwners(page = 1, limit = 10) {
  return await getPostsRecommendedPostsWithOwners(page, limit);
}
