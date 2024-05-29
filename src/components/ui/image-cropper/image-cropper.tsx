"use client";

import React, { useRef, useState, type ChangeEvent } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "~/components/ui/image-cropper/setCanvasPreview";

interface ImageCropperProps {
  closeModal: () => void;
  onCropComplete: (dataUrl: string) => unknown;
  circularCrop?: boolean;
  aspectRatio?: number;
  minimumDimension?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  closeModal,
  onCropComplete,
  circularCrop,
  aspectRatio = 1,
  minimumDimension = 150,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop | undefined>();
  const [error, setError] = useState<string>("");

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() ?? "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (
          naturalWidth < minimumDimension ||
          naturalHeight < minimumDimension
        ) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (minimumDimension / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      aspectRatio,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <>
      <label className="mb-3 block w-fit">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-gray-700 file:px-2 file:py-1 file:text-xs file:text-sky-300 hover:file:bg-gray-600"
        />
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop={circularCrop}
            keepSelection
            aspect={aspectRatio}
            minWidth={minimumDimension}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "40vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button
            className="mt-4 rounded-2xl bg-sky-500 px-4 py-2 font-mono text-xs text-white hover:bg-sky-600"
            onClick={async () => {
              if (!imgRef.current || !previewCanvasRef.current || !crop) return;

              setCanvasPreview(
                imgRef.current, // HTMLImageElement
                previewCanvasRef.current, // HTMLCanvasElement
                convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height
                )
              );
              const dataUrl = previewCanvasRef.current.toDataURL();
              localStorage.setItem("uploadedImageDataUrl", dataUrl);
              onCropComplete(dataUrl);
              closeModal();
            }}
          >
            Upload
          </button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};

export default ImageCropper;
