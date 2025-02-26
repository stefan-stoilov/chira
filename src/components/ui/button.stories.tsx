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

export const Default: Story = {
  args: {
    variant: "default",
  },
};

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

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
  },
};
