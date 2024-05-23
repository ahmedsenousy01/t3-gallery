import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { nanoid } from "~/lib/utils";
import { db } from "~/server/db";
import { albums } from "~/server/db/schema";
import { getUserAlbums } from "~/server/queries";

export const dynamic = "force-dynamic";

const AddAlbumButton = () => {
  return (
    <button
      className="flex h-40 w-40 cursor-pointer items-center justify-center rounded-lg bg-gray-800 shadow-md transition duration-300 hover:bg-gray-700"
      type="submit"
    >
      <span className="text-4xl text-white">+</span>
    </button>
  );
};

const AllImagesAlbum: React.FC = () => {
  return (
    <Link
      href={"/albums/all"}
      className="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-700 shadow-md"
    >
      <span className="text-lg font-bold text-white">All Images</span>
    </Link>
  );
};

export default async function page() {
  const userAlbums = await getUserAlbums();

  return (
    <div className="relative flex h-full flex-col items-center justify-center bg-[#121212] p-8 text-white">
      <div className="mb-8 flex flex-wrap gap-4">
        <AllImagesAlbum />
        {userAlbums.map((album) => (
          <Link
            href={`/albums/${album.id}`}
            key={album.id}
            className="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-700 shadow-md"
          >
            <span className="text-lg">{album.name}</span>
          </Link>
        ))}
        <form
          action={async () => {
            "use server";
            const user = auth();
            if (!user.userId) throw new Error("Unauthorized!");
            await db.insert(albums).values({
              id: nanoid(),
              name: "New Album",
              userId: user.userId,
            });
            revalidatePath("/albums");
          }}
        >
          <AddAlbumButton />
        </form>
      </div>
    </div>
  );
}
