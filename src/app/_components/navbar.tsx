"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import UploadButton, { UploadBtnSvg } from "~/app/_components/uploadBtn";
import { DeleteButton } from "./deleteImagesBtn";
import { useAppDispatch, useAppSelector } from "~/lib/redux/hooks";
import { SelectImagesIcon } from "~/app/_components/select-images-icon";
import { SelectAllIcon } from "~/app/_components/select-all-icon";
import { CloseButtonIcon } from "~/app/_components/close-button-icon";
import { UnSelectAllIcon } from "./un-select-all-icon";
import { Modal } from "../../components/ui/normal-modal";
import {
  closeUploadImageModal,
  openUploadImageModal,
} from "~/lib/redux/features/modals/modalSlice";
import { useEffect, useState } from "react";
import ImageCropper from "./upload-image-modal";
import { FolderIcon } from "./folder-icon";

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();

  const selectionModeOn = useAppSelector(
    (state) => state.images.selectionModeOn,
  );
  const isAllImagesSelected = useAppSelector(
    (state) => state.images.isAllImagesSelected,
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <nav className="">
        <div className="bg-gray-800 p-4">
          <div className="centered-content flex flex-wrap items-center justify-between">
            <div className="mr-6 flex flex-shrink-0 items-center text-white">
              {selectionModeOn ? (
                <h1 className="text-3xl font-bold tracking-tight">
                  Select Images
                </h1>
              ) : (
                <Link href="/">
                  <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                {selectionModeOn ? (
                  <>
                    <DeleteButton />
                    {isAllImagesSelected ? (
                      <UnSelectAllIcon />
                    ) : (
                      <SelectAllIcon />
                    )}
                    <CloseButtonIcon />
                  </>
                ) : (
                  <>
                    <SelectImagesIcon />
                    <UploadBtnSvg
                      onClick={() => dispatch(openUploadImageModal())}
                    />
                    <Link href={"/albums"}>
                      <FolderIcon />
                    </Link>
                    <UserButton />
                  </>
                )}
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
      {isClient && (
        <Modal>
          <div className="bg-white p-6">
            <ImageCropper
              closeModal={() => dispatch(closeUploadImageModal())}
              onCropComplete={(dataUrl) => console.log(dataUrl)}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
