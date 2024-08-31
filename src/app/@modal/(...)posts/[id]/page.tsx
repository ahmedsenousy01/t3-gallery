import Image from "next/image";
import { RouteInterceptingModal } from "../../../../components/ui/modals/route-intercepting-modal";
import { getImageById } from "~/server/queries";

// TODO: redirect("/") doesn't work with intercepted routes (search about why)

export default async function page({
  params: { id: ImageId },
}: {
  params: { id: string };
}) {
  const image = await getImageById(ImageId);

  return (
    <RouteInterceptingModal>
      <Image
        width={300}
        height={300}
        className="w-96 rounded-xl"
        src={image.url}
        alt={image.name}
      />
    </RouteInterceptingModal>
  );
}
