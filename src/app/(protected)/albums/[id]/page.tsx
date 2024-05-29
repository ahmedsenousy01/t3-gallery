import Image from "next/image";
import Link from "next/link";
import { getAlbumImages } from "~/server/queries";

export default async function page({
  params: { id: AlbumId },
}: {
  params: { id: string };
}) {
  const images = await getAlbumImages(AlbumId);

  return (
    <div className="relative flex h-[100%] items-center justify-center">
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
            {/* {selectionModeOn && (
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
              )} */}
            <span>{img.name.slice(0, 20)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
