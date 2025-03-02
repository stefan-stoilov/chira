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
import { workspacesKeys } from "../../api/query-key-factory";
import type { UseWorkspacesData } from "../../api/use-workspaces";

const meta = {
  title: "Features/Workspace/WorkspaceSwitcher",
  component: WorkspaceSwitcher,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="mx-auto w-[80vw] max-w-xs">
        <Story />
      </div>
    </QueryWrapper>
  ),
} satisfies Meta<typeof WorkspaceSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);

export const Loading: Story = {
  ...withMswHandlers([handlers.loading]),
  play: async () => {
    const user = userEvent.setup();
    const trigger = screen.getByRole("combobox");

    await user.click(trigger);
    expect(await screen.findAllByTestId("workspaces-skeleton")).toHaveLength(3);
  },
};

const queryClient = createTestQueryClient();
queryClient.setQueryData<UseWorkspacesData>(workspacesKeys.lists(), () => ({
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
  play: async () => {
    const user = userEvent.setup();
    const trigger = screen.getByRole("combobox");

    await user.click(trigger);
    expect(await screen.findByTestId("workspaces-loader")).toBeDefined();
  },
};

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
