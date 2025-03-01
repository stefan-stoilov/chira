import type { StoryObj, Meta } from "@storybook/react";
import { SignUpCard } from "./sign-up-card";
import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers } from "../../api/use-sign-up/mocks";

const meta = {
  title: "Features/Auth/SignUpCard",
  component: SignUpCard,
  decorators: (Story) => (
    <QueryWrapper>
      <Story />
    </QueryWrapper>
  ),
} satisfies Meta<typeof SignUpCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);

export const Loading: Story = withMswHandlers([handlers.loading]);

export const Error: Story = withMswHandlers([handlers.error]);
