import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "../logo";
import { WorkspaceNavigation } from "@/features/workspaces/components/workspace-navigation";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { CreateWorkspaceButton } from "@/features/workspaces/components/create-workspace-modal";
import { ProjectsNavigation } from "@/features/workspaces/features/projects/components/projects-navigation";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarSeparator className="bg-primary/20" />

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="text-xs uppercase text-muted-foreground">
              Workspaces
            </SidebarGroupLabel>
            <SidebarGroupAction asChild>
              <CreateWorkspaceButton />
            </SidebarGroupAction>
          </div>

          <SidebarGroupContent>
            <WorkspaceSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>

        <WorkspaceNavigation />

        <ProjectsNavigation />
      </SidebarContent>
    </Sidebar>
  );
}
