import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@/components/ui/checkbox";

function CheckboxWithText({ disabled }: { disabled?: boolean }) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id="terms1" disabled={disabled} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
        <p className="text-sm text-muted-foreground">
          You agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

const meta = {
  title: "Components/UI/Checkbox",
  component: CheckboxWithText,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CheckboxWithText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
