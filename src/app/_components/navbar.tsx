"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import UploadButton from "~/app/_components/uploadBtn";
import { DeleteButton } from "./deleteImagesBtn";
import { useAppSelector } from "~/lib/redux/hooks";
import { SelectImagesIcon } from "~/app/_components/select-images-icon";
import { SelectAllIcon } from "~/app/_components/select-all-icon";
import { CloseButtonIcon } from "~/app/_components/close-button-icon";

export default function Navbar() {
  const selectionModeOn = useAppSelector(
    (state) => state.images.selectionModeOn,
  );

  return (
    <nav className="">
      <div className="flex flex-wrap items-center justify-between bg-gray-800 p-4">
        <div className="mr-6 flex flex-shrink-0 items-center text-white">
          <Link href="/">
            <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            {selectionModeOn ? (
              <>
                <DeleteButton />
                <SelectAllIcon />
                <CloseButtonIcon />
              </>
            ) : (
              <>
                <SelectImagesIcon />
                <UploadButton />
                <UserButton />
              </>
            )}
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
