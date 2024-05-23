"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  checkIsAllImagesSelected,
  initCurrentImages,
  selectImage,
  setActiveImageContainer,
  unselectImage,
} from "~/lib/redux/features/images/imageSlice";
import { useAppDispatch, useAppSelector } from "~/lib/redux/hooks";
import { fetchUserImages } from "~/server/actions";

export const dynamic = "force-dynamic";

export default function UserImagesPage() {
  const dispatch = useAppDispatch();
  const selectionModeOn = useAppSelector(
    (state) => state.images.selectionModeOn,
  );
  const selectedImageIds = useAppSelector(
    (state) => state.images.currentImages.userImagesFeed?.selectedImageIds,
  );
  const images = useAppSelector(
    (state) => state.images.currentImages.userImagesFeed?.images,
  );

  useEffect(() => {
    const initImages = async () => {
      const imgs = await fetchUserImages();
      dispatch(initCurrentImages(imgs));
    };

    dispatch(setActiveImageContainer("userImagesFeed"));
    void initImages();
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-5 py-6">
        {images?.map((img) => (
          <div
            key={img.id}
            className="relative flex w-52 flex-col justify-between gap-4"
          >
            <Link
              href={`/images/${img.id}`}
              className="h-[12vh] max-h-64 min-h-32 rounded-md border border-white/50 shadow-sm shadow-white/50"
            >
              {/* TODO: look up how does image component work with (width, height, objectFit, and css height and width) */}
              <Image
                src={img.url}
                width={300}
                height={300}
                className="size-full object-contain"
                alt={img.id.toString()}
              />
            </Link>
            {selectionModeOn && (
              <div
                className="absolute inset-0 z-[1] size-full"
                onClick={() => {
                  dispatch(selectImage(img.id));
                  dispatch(checkIsAllImagesSelected());
                }}
              />
            )}
            {selectionModeOn &&
              selectedImageIds?.find((id) => id === img.id) && (
                <div
                  className="absolute inset-0 z-[2] flex size-full items-center justify-center bg-blue-600/50 opacity-50"
                  onClick={() => {
                    dispatch(unselectImage(img.id));
                    dispatch(checkIsAllImagesSelected());
                  }}
                />
              )}
            <span>{img.name.slice(0, 20)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
