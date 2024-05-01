import Image from "next/image";
import { getImageById } from "~/server/queries";

export default async function page({
  params: { id: ImageId },
}: {
  params: { id: string };
}) {
  const NumId = Number(ImageId);
  if (isNaN(NumId)) throw new Error("Invalid number passed");

  const image = await getImageById(NumId);

  return (
    <div className="flex h-screen items-center justify-center">
      <Image
        width={300}
        height={300}
        className="w-96 rounded-xl"
        src={image.url}
        alt={image.name}
      />
    </div>
  );
}
