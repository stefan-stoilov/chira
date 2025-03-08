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
import { WorkspaceRoles } from "@/server/db/schemas";
import { Skeleton } from "@/components/ui/skeleton";

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
    permissions: new Set([WorkspaceRoles.admin, WorkspaceRoles.owner]),
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
  const { data, isLoading, isError, isFetching } = useWorkspaces();

  if (typeof workspaceId === "undefined") return null;

  if (isLoading) return <WorkspaceNavigationSkeleton />;

  const workspace = data?.workspaces?.find(
    (workspace) => workspace.id === workspaceId,
  );

  if (typeof workspace === "undefined" && isFetching)
    return <WorkspaceNavigationSkeleton />;

  if (typeof workspace === "undefined" || isError) return null;

  return (
    <>
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="block w-full max-w-full truncate text-xs uppercase text-muted-foreground">
          <VisuallyHidden>Workspace</VisuallyHidden> {workspace.name}
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu>
            {routes.map(({ href, label, activeIcon, icon, permissions }) => {
              if (
                typeof permissions !== "undefined" &&
                !permissions.has(workspace.role)
              )
                return null;

              const fullHref = `/dashboard/workspaces/${workspace.id}${href}`;
              const isActive = pathname === fullHref;
              const Icon = isActive ? activeIcon : icon;

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "!text-foreground",
                      isActive && "!bg-accent-hovered dark:!bg-accent",
                    )}
                  >
                    <Link
                      href={fullHref}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md p-2.5 font-medium transition",
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

function WorkspaceNavigationSkeleton() {
  return (
    <>
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i} className="px-1.5">
                <Skeleton
                  data-testid="workspace-navigation-skeleton"
                  className="h-6 w-full"
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

export { routes as WORKSPACE_NAV_ROUTES };
