import type { StoryObj, Meta } from "@storybook/react";
import { screen, expect, userEvent, waitFor } from "@storybook/test";
import { getRouter } from "@storybook/nextjs/navigation.mock";

import {
  QueryWrapper,
  withMswHandlers,
  createTestQueryClient,
} from "@/tests/utils";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { handlers, data } from "../../api/use-workspaces/mocks";
import { workspacesQuery } from "../../api/use-workspaces";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Features/Workspace/WorkspaceSwitcher",
  component: WorkspaceSwitcher,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="mx-auto w-[80vw] max-w-xs">
        <Story />
      </div>
      <Toaster />
    </QueryWrapper>
  ),
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof WorkspaceSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.successExtended]);

export const Loading: Story = withMswHandlers([handlers.loading]);

const queryClient = createTestQueryClient();
queryClient.setQueryData(workspacesQuery.queryKey, () => ({
  workspaces: data.MOCK_WORKSPACES,
}));

export const Refetching: Story = {
  ...withMswHandlers([handlers.loading]),
  decorators: (Story) => (
    <QueryWrapper queryClient={queryClient}>
      <div className="mx-auto w-[80vw] max-w-xs">
        <Story />
      </div>
    </QueryWrapper>
  ),
};

export const Error: Story = withMswHandlers([handlers.error]);

export const OnWorkspacePage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [["workspaceId", data.MOCK_WORKSPACES[0]?.id]],
      },
    },
    msw: { handlers: [handlers.success] },
  },
  play: async () => {
    expect(
      await screen.findByText(data.MOCK_WORKSPACES[0]!.name),
    ).toBeVisible();
  },
};

export const WithZeroWorkspaces: Story = {
  ...withMswHandlers([handlers.successZeroWorkspaces]),
  play: async () => {
    const router = getRouter();
    const user = userEvent.setup();
    const trigger = screen.getByRole("combobox");

    await user.click(trigger);
    const option = await screen.findByRole("option");
    expect(option).toBeDefined();
    await user.click(option);

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith("/dashboard/workspaces/create"),
    );
  },
};
