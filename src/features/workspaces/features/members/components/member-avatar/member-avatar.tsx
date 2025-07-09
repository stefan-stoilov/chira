import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

export type MemberAvatarProps = {
  name: string;
};

export function MemberAvatar({ name }: MemberAvatarProps) {
  return (
    <Avatar className="size-10 border border-border">
      <AvatarFallback className="flex items-center justify-center bg-muted font-medium text-foreground-muted hover:bg-muted-hovered">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
