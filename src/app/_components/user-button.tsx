"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AnonymousUserImage } from "~/components/ui/icons";

import { serverSideSignOut } from "~/server/auth/actions";
import { useCurrentUser } from "~/hooks/use-current-user";

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
            onClick={async () => await serverSideSignOut(pathname, "refresh")}
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
