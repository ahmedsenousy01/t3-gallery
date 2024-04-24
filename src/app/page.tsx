import { db } from "~/server/db";
import Image from "next/image";
import Link from "next/link";
// TODO: learn about the export const (configurationOptions) like this one
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany();

  return (
    <main className="">
      <div className="mt-12 flex flex-wrap gap-x-4 gap-y-8">
        {[...images, ...images, ...images].map((img, index) => (
          <div
            key={img.id + "-" + index}
            className="flex w-52 flex-col justify-between gap-4"
          >
            <Link
              href={`/post/${img.id}`}
              className="h-[12vh] max-h-64 min-h-32"
            >
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
    </main>
  );
}
