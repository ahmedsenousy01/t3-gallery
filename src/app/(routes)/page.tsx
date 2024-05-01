import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getUserImages } from "~/server/queries";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

async function Images() {
  const images = await getUserImages();

  return (
    <div className="flex flex-wrap justify-center gap-5 p-6">
      {images.map((img) => (
        <div key={img.id} className="flex w-52 flex-col justify-between gap-4">
          <Link
            href={`/images/${img.id}`}
            className="h-[12vh] max-h-64 min-h-32"
          >
            {/* TODO: look up how does image component work with (width, height, objectFit, and css height and width) */}
            <Image
              src={img.url}
              width={300}
              height={300}
              style={{ objectFit: "fill" }}
              className="size-full"
              alt={img.id.toString()}
            />
          </Link>
          <span>{img.name}</span>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <>
      <SignedOut>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Welcome to the Gallery!</h1>
          <p className="text-lg">Please sign in to view the gallery.</p>
        </div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </>
  );
}
