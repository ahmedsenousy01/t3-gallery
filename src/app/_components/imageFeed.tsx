"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { fetchImages } from "~/server/actions";
import { type Image as ImageType } from "~/server/db/schema";
import { useAppSelector, useAppDispatch } from "~/lib/redux/hooks";
import {
  addImages,
  checkIsAllImagesSelected,
  initCurrentImages,
  selectImage,
  unselectImage,
} from "~/lib/redux/features/images/imageSlice";

export function ImageFeed({ initialImages }: { initialImages: ImageType[] }) {
  const dispatch = useAppDispatch();
  const images = useAppSelector((state) => state.images.currentImages);
  const selectionModeOn = useAppSelector(
    (state) => state.images.selectionModeOn,
  );
  const selectedImageIds = useAppSelector(
    (state) => state.images.selectedImageIds,
  );

  useEffect(() => {
    dispatch(initCurrentImages(initialImages));
  }, [initialImages, dispatch]);

  const [page, setPage] = useState(1);
  const [moreImagesExist, setMoreImagesExist] = useState(true);
  const [ref, inView] = useInView({
    delay: 250,
  });

  const loadMoreImages = useCallback(async () => {
    const newImages = await fetchImages(page + 1);
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
        {images.map((img) => (
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
              selectedImageIds.find((id) => id === img.id) && (
                <div
                  className="absolute inset-0 z-[2] flex size-full items-center justify-center bg-blue-600/50 opacity-50"
                  onClick={() => {
                    dispatch(unselectImage(img.id));
                    dispatch(checkIsAllImagesSelected());
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </div>
              )}
            <span>{img.name.slice(0, 20)}</span>
          </div>
        ))}
      </div>
      {moreImagesExist && (
        <div className="flex items-center justify-center" ref={ref}>
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white/50 border-b-white/50 border-t-white/50" />
        </div>
      )}
    </>
  );
}
