import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => (
  <nav className="">
    <div className="fixed left-0 right-0 top-0 flex flex-wrap items-center justify-between bg-gray-800 p-4">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <Link href="/">
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
        </Link>
      </div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  </nav>
);

export default Navbar;
