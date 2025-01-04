"use client";
import { Loader, LogOut } from "lucide-react";
import { useCurrentUser, useSignOut } from "@/features/auth/api";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";

export function UserButton() {
  const { data, isLoading } = useCurrentUser();
  const user = data?.user;

  const { mutate: signOut } = useSignOut();

  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user === null) {
    return <p>No user found</p>;
  }

  if (typeof user === "undefined") {
    return <p>No user - undef</p>;
  }

  const { email, name } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : (email.charAt(0).toUpperCase() ?? "U");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative">
        <Avatar className="size-10 border border-neutral-300 transition hover:opacity-75">
          <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 rounded border border-muted px-2.5 py-4">
          <Avatar className="size-14 border border-neutral-300 transition hover:opacity-75">
            <AvatarFallback className="flex items-center justify-center bg-neutral-200 text-xl font-medium text-neutral-500">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {name ?? "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>

          <Separator className="mb-1" />

          <DropdownMenuItem
            onClick={() => signOut()}
            className="flex h-10 cursor-pointer items-center justify-center font-medium text-amber-700"
          >
            <LogOut className="mr-2 size-4" />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
