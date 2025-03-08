import type { StoryObj, Meta } from "@storybook/react";
import { screen, userEvent } from "@storybook/test";
import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers } from "../../api/use-create-workspace/mocks";
import { Toaster } from "@/components/ui/sonner";
import { CreateWorkspaceForm } from "./create-workspace-form";

const meta = {
  title: "Features/Workspace/CreateWorkspaceForm",
  component: CreateWorkspaceForm,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="w-[70vw] max-w-lg">
        <Story />
      </div>
      <Toaster />
    </QueryWrapper>
  ),
} satisfies Meta<typeof CreateWorkspaceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);

export const Loading: Story = {
  ...withMswHandlers([handlers.loading]),
  play: async () => {
    const user = userEvent.setup();
    const name = screen.getByLabelText(/name/i);
    const submit = screen.getByRole("button", { name: /create workspace/i });

    await user.type(name, "My Workspace");
    await user.click(submit);
  },
};

export const Validation: Story = {
  ...withMswHandlers([handlers.success]),
  play: async () => {
    const user = userEvent.setup();
    const submit = screen.getByRole("button", { name: /create workspace/i });

    await user.click(submit);
  },
};

export const Error: Story = {
  ...withMswHandlers([handlers.error]),
  play: async () => {
    const user = userEvent.setup();
    const name = screen.getByLabelText(/name/i);
    const submit = screen.getByRole("button", { name: /create workspace/i });

    await user.type(name, "My Workspace");
    await user.click(submit);
  },
};
