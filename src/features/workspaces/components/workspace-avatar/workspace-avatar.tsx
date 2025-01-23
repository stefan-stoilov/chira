import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type WorkspaceAvatarProps = {
  image?: string;
  name: string;
  className?: string;
};

export function WorkspaceAvatar({
  image,
  name,
  className,
}: WorkspaceAvatarProps) {
  if (image) {
    return (
      <div
        className={cn(
          "relative size-10 overflow-hidden rounded-md bg-black",
          className,
        )}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="80px"
          className="absolute inset-0 object-cover"
        />
      </div>
    );
  }

  return (
    <Avatar className={cn("relative size-10 rounded-md bg-primary", className)}>
      <AvatarFallback className="inset-0 bg-primary text-lg font-semibold uppercase text-background">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
