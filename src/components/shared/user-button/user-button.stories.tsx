import type { Meta, StoryObj } from "@storybook/react";
import { withMswHandlers, QueryWrapper } from "@/tests/utils";
import { handlers } from "@/features/auth/api/use-current-user/mocks";
import { UserButton } from "./user-button";

const meta = {
  title: "Components/Shared/UserButton",
  render: () => (
    <QueryWrapper>
      <UserButton />
    </QueryWrapper>
  ),
} satisfies Meta<typeof UserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.get]);

export const Loading: Story = withMswHandlers([handlers.loading]);
