import type { StoryObj, Meta } from "@storybook/react";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { MembersTable } from "./members-table";
import { handlers } from "@/features/workspaces/features/members/api/use-members/mocks";
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
    handlers.success({
      firstMember: { id: MOCK_USER_ID, role: WorkspaceRoles.owner },
    }),
  ]),
};

export const AdminView: Story = {
  args: {
    role: WorkspaceRoles.admin,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([
    handlers.success({
      firstMember: { id: MOCK_USER_ID, role: WorkspaceRoles.admin },
    }),
  ]),
};

export const UserView: Story = {
  args: {
    role: WorkspaceRoles.user,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([
    handlers.success({
      firstMember: { id: MOCK_USER_ID, role: WorkspaceRoles.user },
    }),
  ]),
};

export const Loading: Story = {
  args: {
    role: WorkspaceRoles.owner,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([handlers.success({ loadTime: "infinite" })]),
};

export const Error: Story = {
  args: {
    role: WorkspaceRoles.owner,
    currentUserId: MOCK_USER_ID,
  },
  ...withMswHandlers([handlers.error()]),
};
