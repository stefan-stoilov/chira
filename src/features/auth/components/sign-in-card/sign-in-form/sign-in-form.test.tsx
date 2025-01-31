import { fireEvent, render, screen } from "@testing-library/react";
import { SignInForm } from "./sign-in-form";
import userEvent from "@testing-library/user-event";

const mutate = vi.fn();

vi.mock("@/features/auth/api/use-sign-in", () => ({
  useSignIn: () => ({ mutate, isPending: false }),
}));

function setUp() {
  render(<SignInForm />);
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
    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display error only for password when email is filled out correctly.", async () => {
    const { submit, email } = setUp();
    const user = userEvent.setup();

    await user.type(email, "test@test.com");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(await screen.findAllByText(/password is required/i)).toHaveLength(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display error only for email when password is filled out correctly.", async () => {
    const { submit, password } = setUp();
    const user = userEvent.setup();

    await user.type(password, "test");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display no errors when an form is submitted with correct schema.", async () => {
    const { submit, email, password } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(2);

    await user.type(email, "test@test.com");
    await user.type(password, "test");
    await user.click(submit);

    errorMessages.forEach((message) => {
      expect(message).not.toBeNull();
    });
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
