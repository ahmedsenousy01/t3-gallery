"use client";

import { useEffect, useState } from "react";
import { UploadImageModal } from "./upload-image-modal";
import { AddImagesToAlbumModal } from "./add-images-to-album-modal";

export function Modals() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <>
          <UploadImageModal />
          <AddImagesToAlbumModal />
        </>
      )}
    </>
  );
}
