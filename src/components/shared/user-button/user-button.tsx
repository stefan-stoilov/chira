"use client";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useSignOut } from "@/features/auth/api/use-sign-out";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Loader } from "../loader";

export function UserButton() {
  const { data: user, isLoading } = useCurrentUser();

  const { mutate: signOut } = useSignOut();

  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { email, name } = user;

  const avatarFallback = name ?? "U";

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
        className="w-60 bg-background"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 rounded px-2.5 py-4">
          <Avatar className="size-14 border border-neutral-300 transition hover:opacity-75">
            <AvatarFallback className="flex items-center justify-center bg-neutral-200 text-xl font-medium text-neutral-500">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-sm font-medium text-foreground">
              {name ?? "User"}
            </p>
            <p className="text-xs text-muted-foreground">{email}</p>
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
