import type { StoryObj, Meta } from "@storybook/react";
import { SignInCard } from "./sign-in-card";
import { QueryWrapper } from "@/tests/utils";

const meta = {
  title: "Features/Auth/SignInCard",
  component: SignInCard,
  decorators: (Story) => (
    <QueryWrapper>
      <Story />
    </QueryWrapper>
  ),
} satisfies Meta<typeof SignInCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
