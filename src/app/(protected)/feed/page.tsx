import { getAllImages } from "~/server/queries";
import { ImageFeed } from "~/app/_components/imageFeed";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialImages = await getAllImages();

  return <ImageFeed initialImages={initialImages} />;
}
