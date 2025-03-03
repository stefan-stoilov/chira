import type { StoryObj, Meta } from "@storybook/react";
import { screen, userEvent } from "@storybook/test";

import { QueryWrapper, withMswHandlers } from "@/tests/utils";
import { handlers } from "../../api/use-sign-in/mocks";
import { SignInCard } from "./sign-in-card";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Features/Auth/SignInCard",
  component: SignInCard,
  decorators: (Story) => (
    <QueryWrapper>
      <Story />
      <Toaster />
    </QueryWrapper>
  ),
} satisfies Meta<typeof SignInCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = withMswHandlers([handlers.success]);

export const Loading: Story = {
  ...withMswHandlers([handlers.loading]),
  play: async () => {
    const email = screen.getByRole("textbox", { name: /email/i });
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole("button", { name: "Sign In" });
    const user = userEvent.setup();

    await user.type(email, "test@test.com");
    await user.type(password, "test");
    await user.click(submit);
  },
};

export const Validation: Story = {
  ...withMswHandlers([handlers.success]),
  play: async () => {
    const submit = screen.getByRole("button", { name: "Sign In" });
    const user = userEvent.setup();
    await user.click(submit);
  },
};

export const Error: Story = {
  ...withMswHandlers([handlers.error]),
  play: async () => {
    const email = screen.getByRole("textbox", { name: /email/i });
    const password = screen.getByLabelText(/password/i);
    const submit = screen.getByRole("button", { name: "Sign In" });
    const user = userEvent.setup();

    await user.type(email, "test@test.com");
    await user.type(password, "test");
    await user.click(submit);
  },
};
