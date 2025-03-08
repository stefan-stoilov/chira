import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { QueryWrapper } from "@/tests/utils";
import { SignInForm } from "./sign-in-form";
import { server } from "@/tests/mocks/server";
import { handlers } from "@/features/auth/api/use-sign-in/mocks";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function setUp() {
  render(
    <QueryWrapper>
      <SignInForm />
    </QueryWrapper>,
  );
  const email = screen.getByRole("textbox", { name: /email/i });
  const password = screen.getByLabelText(/password/i);
  const togglePassword = screen.getByTestId("toggle-password-visibility");
  const submit = screen.getByRole("button", { name: /sign in/i });

  return { email, password, submit, togglePassword };
}

describe("Sign in form test", () => {
  it("Should render", () => {
    setUp();
    expect(screen.getByRole("form")).toBeDefined();
  });

  it("Should display errors when an empty form is submitted.", async () => {
    const { submit } = setUp();
    fireEvent.submit(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("Should display error only for password when email is filled out correctly.", async () => {
    const { submit, email } = setUp();
    const user = userEvent.setup();

    await user.type(email, "test@test.com");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findAllByText(/password is required/i)).toHaveLength(1);
  });

  it("Should display error only for email when password is filled out correctly.", async () => {
    server.use(handlers.success);
    const { submit, password } = setUp();
    const user = userEvent.setup();

    await user.type(password, "test");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  it("Should display loader and every form field should be disabled after the form is submitted with correct schema and the component is waiting for a response from the server.", async () => {
    server.use(handlers.loading);

    const { submit, email, password } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(2);

    await user.type(email, "test@test.com");
    await user.type(password, "test");
    await user.click(submit);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);

    expect(await screen.findByTestId("loader")).toBeVisible();
    expect(submit).toBeDisabled();
    expect(email).toBeDisabled();
    expect(password).toBeDisabled();
  });

  it("Should display a toast error when an form is submitted with correct schema and server responds with error.", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");
    server.use(handlers.error);

    const { submit, email, password } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(2);

    await user.type(email, "test@test.com");
    await user.type(password, "test");
    await user.click(submit);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });

  it("Should display no errors when an form is submitted with correct schema and server responds with success.", async () => {
    server.use(handlers.success);

    const { submit, email, password } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(2);

    await user.type(email, "test@test.com");
    await user.type(password, "test");
    await user.click(submit);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });
});
