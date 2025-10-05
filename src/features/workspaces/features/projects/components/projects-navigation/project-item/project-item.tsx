import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type ProjectItemProps = {
  id: string;
  name: string;
  workspaceId: string;
};

export function ProjectItem({ id, name, workspaceId }: ProjectItemProps) {
  const pathname = usePathname();

  const href = `/dashboard/workspaces/${workspaceId}/projects/${id}`;
  const isActive = pathname === href;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "bg-transparent !text-foreground",
          isActive && "!bg-accent-hovered dark:!bg-accent",
        )}
      >
        <Link
          href={href}
          className={cn(
            "flex items-center gap-2.5 rounded-md font-medium transition",
          )}
        >
          <Avatar
            className={"relative block size-6 shrink-0 rounded-md bg-primary"}
          >
            <AvatarFallback className="inset-0 bg-primary text-sm font-semibold uppercase text-background">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {name}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
