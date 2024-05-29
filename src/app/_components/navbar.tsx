"use client";

import Link from "next/link";

import { UploadBtnSvg } from "~/app/_components/uploadBtn";
import { DeleteButton } from "./deleteImagesBtn";
import { useAppDispatch, useAppSelector } from "~/lib/redux/hooks";
import { SelectImagesIcon } from "~/app/_components/select-images-icon";
import { SelectAllIcon } from "~/app/_components/select-all-icon";
import { CloseButtonIcon } from "~/app/_components/close-button-icon";
import { UnSelectAllIcon } from "./un-select-all-icon";
import { openModal } from "~/lib/redux/features/modals/modalSlice";
import { FolderIcon } from "./folder-icon";
import { FolderPlusIcon } from "./folder-plus-icon";
import { UserButton } from "./user-button";

export default function Navbar() {
  const dispatch = useAppDispatch();

  const activeImageContainer = useAppSelector(
    (state) => state.images.activeImageContainer
  );
  const selectionModeOn = useAppSelector(
    (state) => state.images.selectionModeOn
  );
  const isAllImagesSelected = useAppSelector(
    (state) =>
      state.images.currentImages[activeImageContainer]?.isAllImagesSelected
  );

  return (
    <nav className="bg-gray-800 p-4">
      <div className="centered-content flex flex-wrap items-center justify-between">
        <div className="mr-6 flex flex-shrink-0 items-center text-white">
          {selectionModeOn ? (
            <h1 className="text-3xl font-bold tracking-tight">Select Images</h1>
          ) : (
            <Link href="/">
              <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {selectionModeOn ? (
            <>
              <FolderPlusIcon />
              <DeleteButton />
              {isAllImagesSelected ? <UnSelectAllIcon /> : <SelectAllIcon />}
              <CloseButtonIcon />
            </>
          ) : (
            <>
              <SelectImagesIcon />
              <UploadBtnSvg
                onClick={() => dispatch(openModal("uploadImage"))}
              />
              <Link href={"/albums"}>
                <FolderIcon />
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
