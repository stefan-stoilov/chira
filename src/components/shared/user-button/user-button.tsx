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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader } from "../loader";

export function UserButton() {
  const { data: user, isLoading } = useCurrentUser();

  const { mutate: signOut } = useSignOut();

  if (isLoading) {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { email, name } = user;

  const avatarFallback = name?.charAt(0) ?? "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative">
        <Avatar className="size-10 border border-border">
          <AvatarFallback className="flex items-center justify-center bg-muted font-medium text-foreground-muted hover:bg-muted-hovered">
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
          <Avatar className="size-14 border border-border">
            <AvatarFallback className="flex items-center justify-center bg-muted font-medium text-foreground-muted">
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

          <DropdownMenuItem asChild>
            <Button variant="secondary" size="lg" onClick={() => signOut()}>
              <LogOut />
              Sign Out
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
