"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { fetchAllImages } from "~/server/actions";
import { type Image as ImageType } from "~/server/db/schema";
import { useAppSelector, useAppDispatch } from "~/lib/redux/hooks";
import {
  addImages,
  checkIsAllImagesSelected,
  initCurrentImages,
  selectImage,
  setActiveImageContainer,
  unselectImage,
} from "~/lib/redux/features/images/imageSlice";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

export function ImageFeed({ initialImages }: { initialImages: ImageType[] }) {
  const dispatch = useAppDispatch();
  const images = useAppSelector(
    (state) => state.images.currentImages.mainFeed?.images
  );
  const selectionModeOn = useAppSelector(
    (state) => state.images.selectionModeOn
  );
  const selectedImageIds = useAppSelector(
    (state) => state.images.currentImages.mainFeed?.selectedImageIds
  );

  useEffect(() => {
    dispatch(setActiveImageContainer("mainFeed"));
    dispatch(initCurrentImages(initialImages));
  }, [initialImages, dispatch]);

  const [page, setPage] = useState(1);
  const [moreImagesExist, setMoreImagesExist] = useState(true);
  const [ref, inView] = useInView({
    delay: 250,
  });

  const loadMoreImages = useCallback(async () => {
    const newImages = await fetchAllImages(page + 1);
    if (newImages.length === 0) {
      setMoreImagesExist(false);
      return;
    }
    dispatch(addImages(newImages));
    setPage((prevPage) => prevPage + 1);
  }, [page, dispatch]);

  useEffect(() => {
    const loadImagesAsync = async () => {
      if (inView) {
        await loadMoreImages();
      }
    };
    void loadImagesAsync();
  }, [inView, loadMoreImages, images]);

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
      {moreImagesExist && (
        <div className="flex items-center justify-center" ref={ref}>
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
