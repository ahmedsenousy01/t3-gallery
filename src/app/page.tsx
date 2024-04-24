import { db } from "~/server/db";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

async function Images() {
  const images = await db.query.images.findMany();

  return (
    <div className="mx-auto mt-24 flex w-[95%] flex-wrap gap-x-4 gap-y-8">
      {[...images, ...images, ...images].map((img, index) => (
        <div
          key={img.id + "-" + index}
          className="flex w-52 flex-col justify-between gap-4"
        >
          <Link href={`/post/${img.id}`} className="h-[12vh] max-h-64 min-h-32">
            <Image
              width={300}
              height={300}
              src={img.url}
              alt={img.id.toString()}
              className="size-full"
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
    <main className="">
      <SignedOut>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Welcome to the Gallery!</h1>
          <p className="text-lg">Please sign in to view the gallery.</p>
        </div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
