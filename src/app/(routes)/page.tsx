import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getUserImages } from "~/server/queries";
import { ImageFeed } from "../_components/imageFeed";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialImages = await getUserImages();
  return (
    <>
      <SignedOut>
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Welcome to the Gallery!</h1>
          <p className="text-lg">Please sign in to view the gallery.</p>
        </div>
      </SignedOut>
      <SignedIn>
        <ImageFeed initialImages={initialImages} />
      </SignedIn>
    </>
  );
}
