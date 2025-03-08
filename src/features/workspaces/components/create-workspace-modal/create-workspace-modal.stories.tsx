import type { Meta, StoryObj } from "@storybook/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers } from "../../api/use-create-workspace/mocks";
import {
  CreateWorkspaceModal,
  CreateWorkspaceButton,
} from "./create-workspace-modal";
import { CREATE_WORKSPACE_SEARCH_PARAM } from "../../hooks/use-create-workspace-modal";

const meta = {
  title: "Features/Workspace/Create Workspace Modal",
  component: CreateWorkspaceModal,
  decorators: (Story) => (
    <NuqsTestingAdapter
      searchParams={{ [CREATE_WORKSPACE_SEARCH_PARAM]: "true" }}
    >
      <QueryWrapper>
        <Story />
        <CreateWorkspaceButton />
      </QueryWrapper>
    </NuqsTestingAdapter>
  ),
} satisfies Meta<typeof CreateWorkspaceModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);
