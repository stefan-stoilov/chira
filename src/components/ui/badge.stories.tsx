import type { StoryObj, Meta } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "Components/UI/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};
