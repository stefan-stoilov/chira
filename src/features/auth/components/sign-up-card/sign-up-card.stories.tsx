import type { StoryObj, Meta } from "@storybook/react";
import { SignUpCard } from "./sign-up-card";
import { QueryWrapper } from "@/tests/utils";

const meta = {
  title: "Features/Auth/SignUpCard",
  render() {
    return (
      <QueryWrapper>
        <SignUpCard />
      </QueryWrapper>
    );
  },
} satisfies Meta<typeof SignUpCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
