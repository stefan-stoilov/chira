import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type MemberAvatarProps = {
  name: string;
};

export function MemberAvatar({ name }: MemberAvatarProps) {
  return (
    <Avatar className="size-8 border border-border">
      <AvatarFallback className="flex items-center justify-center bg-muted font-medium text-foreground-muted">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
