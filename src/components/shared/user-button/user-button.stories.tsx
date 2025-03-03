import type { Meta, StoryObj } from "@storybook/react";
import { withMswHandlers, QueryWrapper } from "@/tests/utils";
import { Toaster } from "@/components/ui/sonner";
import { handlers as userHandlers } from "@/features/auth/api/use-current-user/mocks";
import { handlers as authHandlers } from "@/features/auth/api/use-sign-out/mocks";
import { UserButton } from "./user-button";

const meta = {
  title: "Components/Shared/UserButton",
  component: UserButton,
  decorators: (Story) => (
    <QueryWrapper>
      <Story />
      <Toaster />
    </QueryWrapper>
  ),
} satisfies Meta<typeof UserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([
  userHandlers.success,
  authHandlers.success,
]);

export const Loading: Story = withMswHandlers([userHandlers.loading]);

export const Error: Story = withMswHandlers([userHandlers.error]);
