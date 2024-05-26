import { auth } from "~/server/auth";
import { getAllImages } from "~/server/queries";
import { ImageFeed } from "../_components/imageFeed";
import { SignInButton } from "~/components/auth/SignInButton";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

async function ImageFeedWrapper() {
  const initialImages = await getAllImages();
  return <ImageFeed initialImages={initialImages} />;
}

export default async function HomePage() {
  const session = await auth();

  if (!session)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-3">
        <h1 className="text-center text-4xl font-bold">
          Welcome to the Gallery!
        </h1>
        <p className="text-lg">Please sign in to view the gallery.</p>
        <SignInButton />
      </div>
    );

  return <ImageFeedWrapper />;
}
