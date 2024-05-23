import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getAllImages } from "~/server/queries";
import { ImageFeed } from "../_components/imageFeed";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

async function ImageFeedWrapper() {
  const initialImages = await getAllImages();
  return <ImageFeed initialImages={initialImages} />;
}

export default async function HomePage() {
  return (
    <>
      <SignedOut>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-center text-4xl font-bold">
            Welcome to the Gallery!
          </h1>
          <p className="text-lg">Please sign in to view the gallery.</p>
        </div>
      </SignedOut>
      <SignedIn>
        <ImageFeedWrapper />
      </SignedIn>
    </>
  );
}
