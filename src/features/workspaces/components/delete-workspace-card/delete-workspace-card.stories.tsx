import type { StoryObj, Meta } from "@storybook/react";
import { DeleteWorkspaceCard } from "./delete-workspace-card";
import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { Toaster } from "@/components/ui/sonner";
import { handlers } from "../../api/use-delete-workspace/mocks";
import { MOCK_WORKSPACE_ID } from "../../api/use-workspace/mocks/data";

const meta = {
  title: "Features/Workspace/DeleteWorkspaceCard",
  component: DeleteWorkspaceCard,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="w-[70vw] max-w-lg">
        <Story />
      </div>
      <Toaster />
    </QueryWrapper>
  ),
  args: {
    workspaceId: MOCK_WORKSPACE_ID,
  },
} satisfies Meta<typeof DeleteWorkspaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);

export const Loading: Story = withMswHandlers([handlers.loading]);

export const Error: Story = withMswHandlers([handlers.errorUnauthorized]);
