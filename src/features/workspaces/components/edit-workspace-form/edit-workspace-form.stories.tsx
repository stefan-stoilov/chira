import type { StoryObj, Meta } from "@storybook/react";
import { EditWorkspaceForm } from "./edit-workspace-form";
import { QueryWrapper, withMswHandlers } from "@/tests/utils";
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

export const Loading: Story = withMswHandlers([handlers.loading]);
