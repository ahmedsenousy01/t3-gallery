"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function RouteInterceptingModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
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
  );
}
