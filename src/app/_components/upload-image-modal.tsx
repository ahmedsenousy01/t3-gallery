"use client";

import React, { useRef, useState, type ChangeEvent } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "./setCanvasPreview";
import { useUploadThing } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { toast } from "sonner";
import { nanoid } from "nanoid";

function LoadingSpinnerSvg() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <style>{`.spinner_ajPY{transform-origin:center;animation:spinner_AtaB .75s infinite linear}@keyframes spinner_AtaB{100%{transform:rotate(360deg)}}`}</style>
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        className="spinner_ajPY"
      />
    </svg>
  );
}

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface ImageCropperProps {
  closeModal: () => void;
  onCropComplete: (dataUrl: string) => void;
  circularCrop?: boolean;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  closeModal,
  onCropComplete,
  circularCrop,
}) => {
  const router = useRouter();
  const posthog = usePostHog();

  const $ut = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      posthog.capture("upload_begin");
      toast(
        <div className="flex items-center gap-2">
          <LoadingSpinnerSvg />
          <span className="text-lg">Uploading...</span>
        </div>,
        {
          duration: 10000,
          id: "upload-begin",
        },
      );
    },
    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success("Upload complete!");
      router.refresh();
    },
  });

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
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
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
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height,
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const dataURLToFile = async (
    dataUrl: string,
    fileName: string,
  ): Promise<File> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], fileName, {
      type: "image/jpeg",
      lastModified: new Date().getTime(),
    });
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
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
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
                  imgRef.current.height,
                ),
              );
              const dataUrl = previewCanvasRef.current.toDataURL();
              onCropComplete(dataUrl);
              closeModal();
              const file = await dataURLToFile(dataUrl, `${nanoid()}.jpg`);
              await $ut.startUpload([file]);
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
