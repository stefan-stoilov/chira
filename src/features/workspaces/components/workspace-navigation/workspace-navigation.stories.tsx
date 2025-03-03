import type { StoryObj, Meta } from "@storybook/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { QueryWrapper } from "@/tests/utils";
import { handlers, data } from "../../api/use-workspaces/mocks";
import { handlers as createWorkspaceHandlers } from "../../api/use-create-workspace/mocks";

import { WorkspaceNavigation } from "./workspace-navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/logo";
import {
  CreateWorkspaceButton,
  CreateWorkspaceModal,
} from "../create-workspace-modal";
import { WorkspaceSwitcher } from "../workspace-switcher";

const meta = {
  title: "Features/Workspace/Workspace Navigation",
  component: WorkspaceNavigation,
  decorators: (Story) => (
    <QueryWrapper>
      <NuqsTestingAdapter>
        <SidebarProvider>
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

              <Story />
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>

        <CreateWorkspaceModal />
      </NuqsTestingAdapter>
    </QueryWrapper>
  ),
  parameters: {
    layout: "",
  },
} satisfies Meta<typeof WorkspaceNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [["workspaceId", data.getWorkspaceWithOwnerRights().id]],
        pathname: `/dashboard/workspaces/${data.getWorkspaceWithOwnerRights().id}`,
      },
    },
    msw: [handlers.successWithDifferentRoles, createWorkspaceHandlers.success],
  },
};

export const Loading: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [["workspaceId", data.getWorkspaceWithOwnerRights().id]],
        pathname: `/dashboard/workspaces/${data.getWorkspaceWithOwnerRights().id}`,
      },
    },
    msw: [handlers.loading, createWorkspaceHandlers.success],
  },
};

export const Error: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [["workspaceId", data.getWorkspaceWithOwnerRights().id]],
        pathname: `/dashboard/workspaces/${data.getWorkspaceWithOwnerRights().id}`,
      },
    },
    msw: [handlers.error, createWorkspaceHandlers.success],
  },
};

export const Settings: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [["workspaceId", data.getWorkspaceWithOwnerRights().id]],
        pathname: `/dashboard/workspaces/${data.getWorkspaceWithOwnerRights().id}/settings`,
      },
    },
    msw: [handlers.successWithDifferentRoles, createWorkspaceHandlers.success],
  },
};

export const UserRightsOnly: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [["workspaceId", data.getWorkspaceWithUserRights().id]],
        pathname: `/dashboard/workspaces/${data.getWorkspaceWithUserRights().id}`,
      },
    },
    msw: [handlers.successWithDifferentRoles, createWorkspaceHandlers.success],
  },
};
