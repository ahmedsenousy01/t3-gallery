import { auth } from "~/server/auth/core";
import { getAllImages } from "~/server/queries";
import { ImageFeed } from "../_components/imageFeed";
import { Button } from "~/components/ui/button";
import { initiateSignIn } from "~/server/auth/actions";
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
        <form
          action={async () => {
            "use server";
            await initiateSignIn();
          }}
        >
          <Button variant="default" type="submit">
            Sign in
          </Button>
        </form>
      </div>
    );

  return <ImageFeedWrapper />;
}
