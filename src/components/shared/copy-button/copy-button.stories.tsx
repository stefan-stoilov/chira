import type { StoryObj, Meta } from "@storybook/react";
import { CopyButton } from "./copy-button";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Components/Shared/Copy Button",
  component: CopyButton,
  args: {
    variant: "primary",
    value: "Copied text",
  },
  decorators: (Story) => (
    <>
      <Story />
      <Toaster />
    </>
  ),
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Copy to clipboard",
  },
};

export const Icon: Story = {};

export const Disabled: Story = {
  args: {
    children: "Copy to clipboard",
    disabled: true,
  },
};
