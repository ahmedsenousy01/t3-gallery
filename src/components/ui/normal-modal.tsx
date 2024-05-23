"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch } from "~/lib/redux/hooks";

export function Modal(props: {
  isOpen: boolean;
  closeModal: () => { type: string; payload: undefined };
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (props.isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }

    return () => {
      if (dialogRef.current?.open) {
        dialogRef.current.close();
        dispatch(props.closeModal());
      }
    };
  }, [props, dispatch]);

  function onDismiss() {
    dialogRef.current?.close();
    dispatch(props.closeModal());
  }

  if (typeof document === "undefined") {
    return null; // Return null during SSR
  }

  return props.isOpen
    ? createPortal(
        <dialog
          ref={dialogRef}
          className="relative flex h-screen w-[100%] items-center justify-center bg-zinc-900/50"
          onClose={onDismiss}
        >
          {props.children}
          <button
            onClick={onDismiss}
            className="absolute inset-0 z-[-1] cursor-default"
          />
        </dialog>,
        document.getElementById("modal-root")!,
      )
    : null;
}
