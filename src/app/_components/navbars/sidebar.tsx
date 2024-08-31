"use client";

import { type ClassValue } from "clsx";
import { cn } from "~/lib/utils";

import {
  AnonymousUserImage,
  CreateIcon,
  HamburgerIcon,
  HomeIcon,
  Logo,
  LogoText,
  MessagesIcon,
  NotificationIcon,
  SearchIcon,
} from "~/components/ui/icons";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useCurrentUser } from "~/hooks/use-current-user";
import { useAppDispatch } from "~/lib/redux/hooks";
import { openModal } from "~/lib/redux/features/modals/modalSlice";

export function Sidebar() {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();

  return (
    <aside className="hidden h-full flex-col gap-10 border-r border-r-gray-500/50 p-4 sm:flex sm:w-20 lg:w-64 2xl:w-80">
      {/* logo */}
      <Link href="/">
        <div className="flex cursor-pointer items-center justify-center hover:bg-slate-900/50 lg:justify-start lg:p-2">
          <Logo className="lg:hidden" />
          <LogoText className="hidden lg:block" />
        </div>
      </Link>

      {/* main menu */}
      <div className="flex flex-col gap-1">
        <SidebarItem>
          <HomeIcon className="transition-all duration-100 ease-in-out group-hover:scale-105" />
          <span className="hidden text-lg lg:block">Home</span>
        </SidebarItem>
        <SidebarItem>
          <SearchIcon className="transition-all duration-100 ease-in-out group-hover:scale-105" />
          <span className="hidden text-lg lg:block">Search</span>
        </SidebarItem>
        <SidebarItem>
          <MessagesIcon className="transition-all duration-100 ease-in-out group-hover:scale-105" />
          <span className="hidden text-lg lg:block">Messages</span>
        </SidebarItem>
        <SidebarItem>
          <NotificationIcon className="transition-all duration-100 ease-in-out group-hover:scale-105" />
          <span className="hidden text-lg lg:block">Notifications</span>
        </SidebarItem>
        <div onClick={() => dispatch(openModal("uploadImage"))}>
          <SidebarItem onClick={() => dispatch(openModal("uploadImage"))}>
            <CreateIcon className="transition-all duration-100 ease-in-out group-hover:scale-105" />
            <span className="hidden text-lg lg:block">Create</span>
          </SidebarItem>
        </div>
        <SidebarItem>
          <Avatar className="h-6 w-6">
            {user && user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name}
                className="transition-all duration-100 ease-in-out group-hover:scale-105"
              />
            )}
            <AvatarFallback>
              <AnonymousUserImage className="transition-all duration-100 ease-in-out group-hover:scale-105" />
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-lg lg:block">Profile</span>
        </SidebarItem>
      </div>

      {/* hamburger menu */}
      <SidebarItem className="mt-auto">
        <HamburgerIcon className="size-8 transition-all duration-100 ease-in-out group-hover:scale-105" />
        <span className="hidden text-lg lg:block">More</span>
      </SidebarItem>
    </aside>
  );
}

function SidebarItem({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: ClassValue;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center justify-center gap-3 rounded-md text-gray-300 hover:bg-zinc-900/25 lg:justify-start lg:px-2 lg:py-3",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
