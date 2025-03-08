import type { StoryObj, Meta } from "@storybook/react";
import { screen, userEvent } from "@storybook/test";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { EditWorkspaceForm } from "./edit-workspace-form";
import { Toaster } from "@/components/ui/sonner";
import { createMockWorkspaceData } from "../../api/use-workspace/mocks/data";
import { handlers } from "../../api/use-update-workspace/mocks";

const meta = {
  title: "Features/Workspace/EditWorkspaceForm",
  component: EditWorkspaceForm,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="w-[70vw] max-w-lg">
        <Story />
      </div>
      <Toaster />
    </QueryWrapper>
  ),
  args: {
    workspace: createMockWorkspaceData({ name: "Example Workspace Name" }),
    onCancel: undefined,
  },
} satisfies Meta<typeof EditWorkspaceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.successWithDelay]);

export const Loading: Story = {
  ...withMswHandlers([handlers.loading]),
  play: async () => {
    const user = userEvent.setup();
    const name = screen.getByLabelText(/name/i);
    const submit = screen.getByRole("button", { name: /save changes/i });

    await user.clear(name);
    await user.type(name, "Changed name");
    await user.click(submit);
  },
};

export const Validation: Story = {
  ...withMswHandlers([handlers.success]),
  play: async () => {
    const user = userEvent.setup();
    const name = screen.getByLabelText(/name/i);
    const submit = screen.getByRole("button", { name: /save changes/i });

    await user.clear(name);
    await user.click(submit);
  },
};

export const Error: Story = {
  ...withMswHandlers([handlers.errorUnauthorized]),
  play: async () => {
    const user = userEvent.setup();
    const name = screen.getByLabelText(/name/i);
    const submit = screen.getByRole("button", { name: /save changes/i });

    await user.clear(name);
    await user.type(name, "Changed name");
    await user.click(submit);
  },
};
