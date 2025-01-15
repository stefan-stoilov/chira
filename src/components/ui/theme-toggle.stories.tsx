import type { Meta, StoryObj } from "@storybook/react";

import { ThemeToggle } from "./theme-toggle";

const meta = {
  title: "Components/UI/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
