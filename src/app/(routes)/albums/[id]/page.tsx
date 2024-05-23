import { getAlbumImages } from "~/server/queries";

export default async function page({
  params: { id: AlbumId },
}: {
  params: { id: string };
}) {
  const images = await getAlbumImages(AlbumId);

  return (
    <div className="relative flex h-[100%] items-center justify-center">
      {JSON.stringify(images) ?? "No images"}
    </div>
  );
}
