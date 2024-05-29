import { Modal } from "~/components/ui/modals/normal-modal";
import { closeModal } from "~/lib/redux/features/modals/modalSlice";
import { useAppDispatch, useAppSelector } from "~/lib/redux/hooks";
import ImageCropper from "~/app/_components/upload-image-modal";
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { dataURLToFile, hardRefresh, nanoid } from "~/lib/utils";

export function UploadImageModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const uploadModalIsOpen = useAppSelector(
    (state) => state.modals.uploadImage!.isOpen
  );

  const $ut = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast(
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span className="text-lg">Uploading...</span>
        </div>,
        {
          duration: 10000,
          id: "upload-begin",
        }
      );
    },
    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success("Upload complete!");
      router.refresh();
    },
  });

  return (
    <Modal
      isOpen={uploadModalIsOpen}
      closeModal={() => closeModal("uploadImage")}
    >
      <div className="bg-white p-6">
        <ImageCropper
          closeModal={() => dispatch(closeModal("uploadImage"))}
          onCropComplete={async (dataUrl) => {
            const file = await dataURLToFile(dataUrl, `${nanoid()}.jpg`);
            const res = await $ut.startUpload([file]);
            res && res?.length > 0 && hardRefresh();
          }}
        />
      </div>
    </Modal>
  );
}
