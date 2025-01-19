import type { StoryObj, Meta } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "Components/UI/Button",
  component: Button,
  args: {
    children: "Button",
    disabled: false,
  },
  argTypes: {
    asChild: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};
