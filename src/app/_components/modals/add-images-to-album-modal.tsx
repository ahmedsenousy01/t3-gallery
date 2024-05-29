import { useEffect, useState } from "react";

import { Modal } from "~/components/ui/modals/normal-modal";
import {
  toggleSelectionMode,
  unselectAllImages,
} from "~/lib/redux/features/images/imageSlice";
import { closeModal } from "~/lib/redux/features/modals/modalSlice";
import { useAppDispatch, useAppSelector } from "~/lib/redux/hooks";
import { addImagesToAlbum, fetchUserAlbums } from "~/server/actions";
import { type Album } from "~/server/db/schema";

export function AddImagesToAlbumModal() {
  const [albums, setAlbums] = useState<Album[]>([]);

  const dispatch = useAppDispatch();

  const activeImageContainer = useAppSelector(
    (state) => state.images.activeImageContainer
  );
  const selectedImagesIds = useAppSelector(
    (state) =>
      state.images.currentImages[activeImageContainer]?.selectedImageIds
  );
  const addImagesToAlbumModalIsOpen = useAppSelector(
    (state) => state.modals.addImageToAlbum!.isOpen
  );

  useEffect(() => {
    fetchUserAlbums()
      .then((res) => setAlbums(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Modal
      isOpen={addImagesToAlbumModalIsOpen}
      closeModal={() => closeModal("addImageToAlbum")}
    >
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
                  dispatch(closeModal("addImageToAlbum"));
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
    </Modal>
  );
}
