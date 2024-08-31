"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { fetchRecommendedPostsWithOwners } from "~/server/actions";
import type { PostDetails } from "~/server/db/schema";
import { useAppSelector, useAppDispatch } from "~/lib/redux/hooks";
import {
  addPosts,
  initCurrentPosts,
  setActivePostContainer,
} from "~/lib/redux/features/posts/postSlice";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { SkeletonCard } from "./post";
import {
  LikeIcon,
  CommentIcon,
  AirplaneIcon,
  BookmarkIcon,
  AnonymousUserImage,
} from "~/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function Feed({ initialPosts }: { initialPosts: PostDetails[] }) {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(
    (state) => state.posts.currentPosts.mainFeed?.posts
  );

  useEffect(() => {
    dispatch(setActivePostContainer("mainFeed"));
    dispatch(initCurrentPosts(initialPosts));
  }, [initialPosts, dispatch]);

  const [page, setPage] = useState(1);
  const [morePostsExist, setMorePostsExist] = useState(true);
  const [ref, inView] = useInView({
    delay: 250,
  });

  const loadMorePosts = useCallback(async () => {
    const newPosts = await fetchRecommendedPostsWithOwners(page + 1);
    if (newPosts.length === 0) {
      setMorePostsExist(false);
      return;
    }
    dispatch(addPosts(newPosts));
    setPage((prevPage) => prevPage + 1);
  }, [page, dispatch]);

  useEffect(() => {
    const loadPostsAsync = async () => {
      if (inView) {
        await loadMorePosts();
      }
    };
    void loadPostsAsync();
  }, [inView, loadMorePosts, posts]);

  return (
    <>
      <div className="mx-auto w-[min(470px,100vw)]">
        <SkeletonCard />
        <br />
        {posts?.map((post) => (
          <React.Fragment key={post.id}>
            <div className="mb-2 flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={post.user?.image ?? ""}
                  alt={post.user?.name ?? ""}
                />
                <AvatarFallback>
                  <AnonymousUserImage />
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{post.user?.name} </span> •{" "}
                <span className="text-gray-500">
                  {post.createdAt.toDateString()}
                </span>
              </div>
            </div>
            <div className="mb-3 flex max-h-[580px] min-h-[470px] flex-col justify-between gap-4 overflow-hidden rounded-md border p-px">
              <Image
                width={470}
                height={580}
                src={post.imageUrl}
                alt={post.id.toString()}
                className="m-auto max-h-[578px] object-contain"
              />
            </div>
            <div className="mb-3 flex">
              <div className="flex gap-3">
                <LikeIcon />
                <CommentIcon />
                <AirplaneIcon />
              </div>
              <BookmarkIcon className="ml-auto" />
            </div>
            <p className="">
              Liked by <span className="font-bold">Person </span>
              and <span className="font-bold">others</span>
            </p>
            <p className="mb-3">
              <span className="font-bold">{post.user?.name} </span>{" "}
              {post.caption.slice(0, 30)} ...{" "}
              <span
                className="cursor-pointer"
                onClick={() => console.log("more")}
              >
                more
              </span>
            </p>
            <p>View all comments</p>
            <div className="mb-3 flex items-center gap-4">
              <input
                type="text"
                name=""
                placeholder="Add a comment"
                className="w-full grow border-none bg-transparent focus:outline-none"
              />
              <span className="font-bold text-blue-500">Comment</span>
            </div>
            <hr className="mb-6" />
          </React.Fragment>
        ))}
      </div>
      {morePostsExist && (
        <div className="flex items-center justify-center" ref={ref}>
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
