"use client";

import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { serverSideSignOut } from "~/server/auth/actions";
import { useCurrentUser } from "~/hooks/use-current-user";
import Link from "next/link";

export function UserButton() {
  const user = useCurrentUser();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-7 w-7">
          {user && user.image && (
            <AvatarImage src={user.image} alt={user.name} />
          )}
          <AvatarFallback>
            <AnonymousUserImage />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="hover:bg-slate-800">
          <Link href={"/profile"} className="h-full w-full">
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:bg-slate-800">
          <button
            className="h-full w-full text-start"
            onClick={async () => await serverSideSignOut(pathname)}
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AnonymousUserImage() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}
