import type { StoryObj, Meta } from "@storybook/react";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { QueryWrapper } from "@/tests/utils";

const meta = {
  title: "Features/Workspace/CreateWorkspaceForm",
  render() {
    return (
      <QueryWrapper>
        <CreateWorkspaceForm />
      </QueryWrapper>
    );
  },
} satisfies Meta<typeof CreateWorkspaceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
