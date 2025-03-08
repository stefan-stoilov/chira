import type { StoryObj, Meta } from "@storybook/react";
import { screen, userEvent } from "@storybook/test";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers } from "../../api/use-sign-up/mocks";
import { SignUpCard } from "./sign-up-card";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Features/Auth/SignUpCard",
  component: SignUpCard,
  decorators: (Story) => (
    <QueryWrapper>
      <Story />
      <Toaster />
    </QueryWrapper>
  ),
} satisfies Meta<typeof SignUpCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);

export const Loading: Story = {
  ...withMswHandlers([handlers.loading]),
  play: async () => {
    const name = screen.getByLabelText(/name/i);
    const email = screen.getByRole("textbox", { name: /email/i });
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole("button", { name: "Sign Up" });
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);
  },
};

export const Validation: Story = {
  ...withMswHandlers([handlers.success]),
  play: async () => {
    const submit = screen.getByRole("button", { name: "Sign Up" });
    const user = userEvent.setup();

    await user.click(submit);
  },
};

export const Error: Story = {
  ...withMswHandlers([handlers.error]),
  play: async () => {
    const name = screen.getByLabelText(/name/i);
    const email = screen.getByRole("textbox", { name: /email/i });
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole("button", { name: "Sign Up" });
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);
  },
};
