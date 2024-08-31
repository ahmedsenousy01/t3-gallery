import Image from "next/image";

import { Button } from "~/components/ui/button";
import { deletePostById, getPostById } from "~/server/queries";

export default async function page({
  params: { id: ImageId },
}: {
  params: { id: string };
}) {
  const image = await getPostById(ImageId);

  return (
    <div className="relative flex h-[100%] items-center justify-center">
      <Image
        width={300}
        height={300}
        className="w-96 rounded-xl"
        src={image.imageUrl}
        alt={image.caption}
      />
      <form
        action={async () => {
          "use server";
          await deletePostById(ImageId);
        }}
        className="absolute right-10 top-10"
      >
        <Button variant="destructive" type="submit">
          Delete
        </Button>
      </form>
    </div>
  );
}
