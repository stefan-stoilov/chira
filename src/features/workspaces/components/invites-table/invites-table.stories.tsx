import type { StoryObj, Meta } from "@storybook/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers as GET } from "../../api/use-workspace-invites/mocks";
import { handlers as POST } from "../../api/use-accept-workspace-invites/mocks";
import { handlers as PATCH } from "../../api/use-soft-delete-workspace-invites/mocks";
import { InvitesTable } from "./invites-table";
import { MOCK_WORKSPACE_ID } from "../../api/use-workspace/mocks/data";
import { WorkspaceRoles } from "@/server/db/schemas";

const meta = {
  title: "Features/Workspace/Invites Table",
  component: InvitesTable,
  decorators: (Story) => (
    <NuqsTestingAdapter>
      <QueryWrapper>
        <div className="max-w-xxl min-h-screen w-[70vw] py-8">
          <Story />
        </div>
      </QueryWrapper>
    </NuqsTestingAdapter>
  ),
  args: {
    workspaceId: MOCK_WORKSPACE_ID,
  },
} satisfies Meta<typeof InvitesTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  ...withMswHandlers([GET.success, POST.success, PATCH.success]),
  args: {
    allowMemberInviteManagement: true,
    role: WorkspaceRoles.owner,
  },
};

export const Loading: Story = {
  ...withMswHandlers([GET.loading, POST.success, PATCH.success]),
  args: {
    allowMemberInviteManagement: true,
    role: WorkspaceRoles.owner,
  },
};

export const NoResults: Story = {
  ...withMswHandlers([GET.noResults, POST.success, PATCH.success]),
  args: {
    allowMemberInviteManagement: true,
    role: WorkspaceRoles.owner,
  },
};

export const RestrictedInviteManagementUser: Story = {
  ...withMswHandlers([GET.success, POST.success, PATCH.success]),
  args: {
    allowMemberInviteManagement: false,
    role: WorkspaceRoles.user,
  },
};

export const RestrictedInviteManagementAdmin: Story = {
  ...withMswHandlers([GET.success, POST.success, PATCH.success]),
  args: {
    allowMemberInviteManagement: false,
    role: WorkspaceRoles.admin,
  },
};
