"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UploadBtnSvg } from "~/app/_components/uploadBtn";
import { DeleteButton } from "./deleteImagesBtn";
import { useAppDispatch, useAppSelector } from "~/lib/redux/hooks";
import { SelectImagesIcon } from "~/app/_components/select-images-icon";
import { SelectAllIcon } from "~/app/_components/select-all-icon";
import { CloseButtonIcon } from "~/app/_components/close-button-icon";
import { UnSelectAllIcon } from "./un-select-all-icon";
import { Modal } from "~/components/ui/normal-modal";
import {
  closeUploadImageModal,
  openUploadImageModal,
  closeAddImageToAlbumModal,
} from "~/lib/redux/features/modals/modalSlice";
import { useEffect, useState } from "react";
import ImageCropper from "./upload-image-modal";
import { FolderIcon } from "./folder-icon";
import { FolderPlusIcon } from "./folder-plus-icon";
import { type Album } from "~/server/db/schema";
import { addImagesToAlbum, fetchUserAlbums } from "~/server/actions";
import {
  toggleSelectionMode,
  unselectAllImages,
} from "~/lib/redux/features/images/imageSlice";
import { useCurrentUser } from "~/hooks/use-current-user";
import {
  serverSideSignIn,
  serverSideSignOut,
} from "~/server/auth-config/actions";

function AddImagesToAlbum() {
  const [albums, setAlbums] = useState<Album[]>([]);

  const dispatch = useAppDispatch();
  const activeImageContainer = useAppSelector(
    (state) => state.images.activeImageContainer
  );
  const selectedImagesIds = useAppSelector(
    (state) =>
      state.images.currentImages[activeImageContainer]?.selectedImageIds
  );

  useEffect(() => {
    fetchUserAlbums()
      .then((res) => setAlbums(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-white p-6">
      <div className="mb-8 flex flex-wrap gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="flex h-40 w-40 cursor-pointer items-center justify-center rounded-lg bg-gray-700 shadow-md"
            onClick={async () => {
              const res = await addImagesToAlbum(
                album.id,
                selectedImagesIds ?? []
              );
              if (res) {
                dispatch(closeAddImageToAlbumModal());
                dispatch(unselectAllImages());
                dispatch(toggleSelectionMode());
              }
            }}
          >
            <span className="text-lg">{album.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const user = useCurrentUser();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
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
  const uploadModalIsOpen = useAppSelector(
    (state) => state.modals.uploadImageModal.isOpen
  );
  const addImageToAlbumModalIsOpen = useAppSelector(
    (state) => state.modals.addImageToAlbumModal.isOpen
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
              {selectionModeOn && user ? (
                <>
                  <FolderPlusIcon />
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
                  {!!user ? (
                    <>
                      <SelectImagesIcon />
                      <UploadBtnSvg
                        onClick={() => dispatch(openUploadImageModal())}
                      />
                      <Link href={"/albums"}>
                        <FolderIcon />
                      </Link>
                      <button
                        onClick={async () => await serverSideSignOut(pathname)}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={async () => await serverSideSignIn()}>
                        Sign in
                      </button>
                    </>
                  )}
                  {/* TODO: add user button and a profile page */}
                  {/* <UserButton /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isClient && (
        <>
          <Modal isOpen={uploadModalIsOpen} closeModal={closeUploadImageModal}>
            <div className="bg-white p-6">
              <ImageCropper
                closeModal={() => dispatch(closeUploadImageModal())}
                onCropComplete={(dataUrl) => console.log(dataUrl)}
              />
            </div>
          </Modal>
          <Modal
            isOpen={addImageToAlbumModalIsOpen}
            closeModal={closeAddImageToAlbumModal}
          >
            <AddImagesToAlbum />
          </Modal>
        </>
      )}
    </>
  );
}
