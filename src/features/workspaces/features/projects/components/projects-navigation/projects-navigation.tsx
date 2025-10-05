"use client";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjects } from "../../api/use-projects";
import { CreateProjectButton } from "../create-project-modal";
import { ProjectItem } from "./project-item/project-item";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

type ProjectsNavigationProps = { workspaceId: string };

function Navigation({ workspaceId }: ProjectsNavigationProps) {
  const { data, isLoading } = useProjects(workspaceId);

  if (isLoading) return <ProjectsNavigationSkeleton />;

  return (
    <>
      <SidebarSeparator />

      <SidebarGroup>
        <div className="flex items-center justify-between">
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground">
            Projects
          </SidebarGroupLabel>
          <SidebarGroupAction asChild>
            <CreateProjectButton />
          </SidebarGroupAction>
        </div>

        {data?.projects?.length ? (
          <SidebarGroupContent>
            <SidebarMenu>
              {data.projects.map(({ id, name }) => (
                <ProjectItem
                  key={id}
                  id={id}
                  name={name}
                  workspaceId={workspaceId}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        ) : null}
      </SidebarGroup>
    </>
  );
}

function ProjectsNavigationSkeleton() {
  return (
    <>
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i} className="px-1.5">
                <Skeleton
                  data-testid="projects-navigation-skeleton"
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

export function ProjectsNavigation() {
  const workspaceId = useWorkspaceId();

  if (!workspaceId) return null;

  return <Navigation workspaceId={workspaceId} />;
}
