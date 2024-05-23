"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { closeUploadImageModal } from "~/lib/redux/features/modals/modalSlice";
import { useAppDispatch, useAppSelector } from "~/lib/redux/hooks";

export function Modal({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  const uploadImageModalOpen = useAppSelector(
    (state) => state.modals.uploadImageModal.isOpen,
  );

  useEffect(() => {
    if (uploadImageModalOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }

    return () => {
      if (dialogRef.current?.open) {
        dialogRef.current.close();
        dispatch(closeUploadImageModal());
      }
    };
  }, [uploadImageModalOpen, dispatch]);

  function onDismiss() {
    dialogRef.current?.close();
    dispatch(closeUploadImageModal());
  }

  if (typeof document === "undefined") {
    return null; // Return null during SSR
  }

  return uploadImageModalOpen
    ? createPortal(
        <dialog
          ref={dialogRef}
          className="relative flex h-screen w-[100%] items-center justify-center bg-zinc-900/50"
          onClose={onDismiss}
        >
          {children}
          <button
            onClick={onDismiss}
            className="absolute inset-0 z-[-1] cursor-default"
          />
        </dialog>,
        document.getElementById("modal-root")!,
      )
    : null;
}
