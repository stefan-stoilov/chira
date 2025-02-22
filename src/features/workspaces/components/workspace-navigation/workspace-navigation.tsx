"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Settings } from "lucide-react";
import { GoHome, GoHomeFill } from "react-icons/go";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useWorkspaces } from "@/features/workspaces/api/use-workspaces";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  // {
  //   label: "Lorem",
  //   href: "/lorem",
  //   icon: GoCheckCircle,
  //   activeIcon: GoCheckCircleFill,
  // },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    activeIcon: Settings,
  },
  // {
  //   label: "Dolor",
  //   href: "/Dolor",
  //   icon: UsersIcon,
  //   activeIcon: UsersIcon,
  // },
];

export function WorkspaceNavigation() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data } = useWorkspaces();

  if (typeof workspaceId === "undefined") return null;

  const workspace = data?.workspaces?.find(
    (workspace) => workspace.id === workspaceId,
  );

  if (typeof workspace === "undefined") return null;

  return (
    <>
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="block w-full max-w-full truncate text-xs uppercase text-muted-foreground">
          <VisuallyHidden>Workspace</VisuallyHidden> {workspace.name}
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            {routes.map(({ href, label, activeIcon, icon }) => {
              const fullHref = `/dashboard/workspaces/${workspace.id}${href}`;
              const isActive = pathname === fullHref;
              const Icon = isActive ? activeIcon : icon;

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      href={fullHref}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md p-2.5 font-medium text-muted-foreground transition hover:text-primary",
                        isActive &&
                          "!bg-background text-primary shadow-sm hover:opacity-100 dark:!bg-background/50",
                      )}
                    >
                      <Icon className="size-5 text-muted-foreground" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
