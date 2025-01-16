import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Calendar } from "./calendar";

function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}

const meta = {
  title: "Components/UI/Calendar",
  component: CalendarDemo,
} satisfies Meta<typeof CalendarDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
