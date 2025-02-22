import type { StoryObj, Meta } from "@storybook/react";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { QueryWrapper } from "@/tests/utils";

const meta = {
  title: "Features/Workspace/CreateWorkspaceForm",
  component: CreateWorkspaceForm,
  decorators: (Story) => (
    <QueryWrapper>
      <Story />
    </QueryWrapper>
  ),
} satisfies Meta<typeof CreateWorkspaceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
