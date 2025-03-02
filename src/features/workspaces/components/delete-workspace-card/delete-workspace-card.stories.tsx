import type { StoryObj, Meta } from "@storybook/react";
import { screen, expect, userEvent, waitFor } from "@storybook/test";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { DeleteWorkspaceCard } from "./delete-workspace-card";
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

export const Demo: Story = {
  ...withMswHandlers([handlers.success]),
  play: async () => {
    const user = userEvent.setup();
    const deleteBtn = screen.getByRole("button");

    await user.click(deleteBtn);

    const cancelBtn = await screen.findByRole("button", { name: /cancel/i });
    const confirmBtn = await screen.findByRole("button", { name: /confirm/i });

    await user.click(cancelBtn);

    await waitFor(() => {
      expect(cancelBtn).not.toBeVisible();
      expect(confirmBtn).not.toBeVisible();
    });

    await user.click(deleteBtn);
    await user.click(await screen.findByRole("button", { name: /confirm/i }));
  },
};
