import type { StoryObj, Meta } from "@storybook/react";
import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { useWorkspace } from "../../api/use-workspace";
import * as getHandlers from "../../api/use-workspace/mocks/handlers";
import * as patchHandlers from "../../api/use-update-invite-code/mocks/handlers";
import { MOCK_WORKSPACE_ID } from "../../api/use-workspace/mocks/data";
import { InviteCard } from "./invite-card";
import { Toaster } from "@/components/ui/sonner";

function InviteCardDemo() {
  const { data: workspace } = useWorkspace(MOCK_WORKSPACE_ID);

  return <>{workspace && <InviteCard workspace={workspace} />}</>;
}

const meta = {
  title: "Features/Workspace/Invite Card",
  component: InviteCardDemo,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="w-[70vw] max-w-lg">
        <Story />
      </div>
      <Toaster />
    </QueryWrapper>
  ),
} satisfies Meta<typeof InviteCardDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([getHandlers.successUser]);

export const NoInvite: Story = withMswHandlers([
  getHandlers.successUserNoInvite,
]);

export const Admin: Story = withMswHandlers([
  getHandlers.successAdmin,
  patchHandlers.successWithDelay,
]);

export const AdminLoading: Story = withMswHandlers([
  getHandlers.successAdmin,
  patchHandlers.loading,
]);

export const AdminError: Story = withMswHandlers([
  getHandlers.successAdmin,
  patchHandlers.error,
]);

export const AdminNoInvite: Story = withMswHandlers([
  getHandlers.successAdminNoInvite,
  patchHandlers.successWithDelay,
]);

export const AdminNoInviteLoading: Story = withMswHandlers([
  getHandlers.successAdminNoInvite,
  patchHandlers.loading,
]);

export const AdminNoInviteError: Story = withMswHandlers([
  getHandlers.successAdminNoInvite,
  patchHandlers.error,
]);
