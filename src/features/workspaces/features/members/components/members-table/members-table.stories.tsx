import type { StoryObj, Meta } from "@storybook/react";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { MembersTable } from "./members-table";
import { handlers as getMembers } from "@/features/workspaces/features/members/api/use-members/mocks";
import { handlers as deleteMember } from "@/features/workspaces/features/members/api/use-delete-member/mocks";
import { handlers as demoteMember } from "@/features/workspaces/features/members/api/use-demote-member/mocks";
import { handlers as promoteMember } from "@/features/workspaces/features/members/api/use-promote-member/mocks";
import { WorkspaceRoles } from "@/server/db/schemas";

const MOCK_USER_ID = crypto.randomUUID();
const MOCK_WORKSPACE_ID = crypto.randomUUID();

const meta = {
  title: "Features/Members/Members Table",
  component: MembersTable,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="max-w-xxl min-h-screen w-[70vw] py-8">
        <Story />
      </div>
    </QueryWrapper>
  ),
  args: {
    workspaceId: MOCK_WORKSPACE_ID,
  },
} satisfies Meta<typeof MembersTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    role: WorkspaceRoles.owner,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([
    getMembers.success({
      firstMember: { id: MOCK_USER_ID, role: WorkspaceRoles.owner },
    }),
    deleteMember.success,
    demoteMember.success,
    promoteMember.success,
  ]),
};

export const AdminView: Story = {
  args: {
    role: WorkspaceRoles.admin,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([
    getMembers.success({
      firstMember: { id: MOCK_USER_ID, role: WorkspaceRoles.admin },
    }),
    deleteMember.success,
    demoteMember.success,
    promoteMember.success,
  ]),
};

export const UserView: Story = {
  args: {
    role: WorkspaceRoles.user,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([
    getMembers.success({
      firstMember: { id: MOCK_USER_ID, role: WorkspaceRoles.user },
    }),
  ]),
};

export const Loading: Story = {
  args: {
    role: WorkspaceRoles.owner,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([getMembers.success({ loadTime: "infinite" })]),
};

export const Error: Story = {
  args: {
    role: WorkspaceRoles.owner,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([getMembers.error()]),
};
