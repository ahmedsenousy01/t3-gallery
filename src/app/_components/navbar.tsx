import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import UploadButton from "~/app/_components/uploadBtn";

export default function Navbar() {
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
            <UploadButton />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
