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
import { NavList } from "../nav-list";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { CreateWorkspaceButton } from "@/features/workspaces/components/create-workspace-modal";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
        <SidebarSeparator className="my-4 bg-primary/20" />
      </SidebarHeader>

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

        <SidebarSeparator className="my-4 bg-primary/20" />

        <SidebarGroup>
          <SidebarGroupContent>
            <NavList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
