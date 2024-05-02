import Image from "next/image";
import { Modal } from "../../../../_components/modal";
import { deleteImageById, getImageById } from "~/server/queries";
import { Button } from "~/components/ui/button";

export default async function page({
  params: { id: ImageId },
}: {
  params: { id: string };
}) {
  const NumId = Number(ImageId);
  if (isNaN(NumId)) throw new Error("Invalid number passed");

  const image = await getImageById(NumId);

  return (
    <Modal>
      <Image
        width={300}
        height={300}
        className="w-96 rounded-xl"
        src={image.url}
        alt={image.name}
      />
      <form
        action={async () => {
          "use server";
          await deleteImageById(NumId);
        }}
        className="absolute right-10 top-10"
      >
        <Button variant="destructive" type="submit">
          Delete
        </Button>
      </form>
    </Modal>
  );
}
