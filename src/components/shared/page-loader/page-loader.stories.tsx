import type { Meta, StoryObj } from "@storybook/react";
import { PageLoader } from "./page-loader";

const meta = {
  title: "Components/Shared/PageLoader",
  component: PageLoader,
} satisfies Meta<typeof PageLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
