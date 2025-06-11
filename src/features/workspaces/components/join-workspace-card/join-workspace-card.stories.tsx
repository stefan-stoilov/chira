import type { StoryObj, Meta } from "@storybook/react";
import { screen, userEvent } from "@storybook/test";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers } from "../../api/use-join-workspace/mocks";
import {
  INVALID_INVITE_LINK_SEARCH_PARAMS,
  VALID_INVITE_LINK_SEARCH_PARAMS,
} from "../../hooks/use-join-search-params/mocks";
import { JoinWorkspaceCard } from "./join-workspace-card";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Features/Workspace/Join Workspace Card",
  component: JoinWorkspaceCard,
  decorators: (Story) => (
    <QueryWrapper>
      <div className="w-[70vw] max-w-lg">
        <Story />
      </div>
      <Toaster />
    </QueryWrapper>
  ),
} satisfies Meta<typeof JoinWorkspaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  ...withMswHandlers([handlers.successWithDelay]),
  decorators: (Story) => (
    <NuqsTestingAdapter searchParams={VALID_INVITE_LINK_SEARCH_PARAMS}>
      <Story />
    </NuqsTestingAdapter>
  ),
};

export const Loading: Story = {
  ...withMswHandlers([handlers.loading]),
  decorators: (Story) => (
    <NuqsTestingAdapter searchParams={VALID_INVITE_LINK_SEARCH_PARAMS}>
      <Story />
    </NuqsTestingAdapter>
  ),
  play: async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
  },
};

export const InvalidSearchParams: Story = {
  ...withMswHandlers([handlers.loading]),
  decorators: (Story) => (
    <NuqsTestingAdapter searchParams={INVALID_INVITE_LINK_SEARCH_PARAMS}>
      <Story />
    </NuqsTestingAdapter>
  ),
};

export const ErrorAlreadyMember: Story = {
  ...withMswHandlers([handlers.errorAlreadyMember]),
  decorators: (Story) => (
    <NuqsTestingAdapter searchParams={VALID_INVITE_LINK_SEARCH_PARAMS}>
      <Story />
    </NuqsTestingAdapter>
  ),
  play: async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
  },
};

export const ErrorNotFound: Story = {
  ...withMswHandlers([handlers.errorNotFound]),
  decorators: (Story) => (
    <NuqsTestingAdapter searchParams={VALID_INVITE_LINK_SEARCH_PARAMS}>
      <Story />
    </NuqsTestingAdapter>
  ),
  play: async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));
  },
};
