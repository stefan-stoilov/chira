import type { StoryObj, Meta } from "@storybook/react";
import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers } from "../../api/use-sign-in/mocks";
import { SignInCard } from "./sign-in-card";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Features/Auth/SignInCard",
  component: SignInCard,
  decorators: (Story) => (
    <QueryWrapper>
      <Story />
      <Toaster />
    </QueryWrapper>
  ),
} satisfies Meta<typeof SignInCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);

export const Loading: Story = withMswHandlers([handlers.loading]);

export const Error: Story = withMswHandlers([handlers.error]);
