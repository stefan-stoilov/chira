import { render, screen, fireEvent } from "@testing-library/react";
import { SignUpForm } from "./sign-up-form";
import userEvent from "@testing-library/user-event";

const mutate = vi.fn();

vi.mock("@/features/auth/api/use-sign-up", () => ({
  useSignUp: () => ({ mutate, isPending: false }),
}));

function setUp() {
  render(<SignUpForm />);
  const name = screen.getByLabelText(/name/i);
  const email = screen.getByRole("textbox", { name: /email/i });
  const password = screen.getByLabelText(/password/i);
  const togglePassword = screen.getByTestId("toggle-password-visibility");
  const submit = screen.getByRole("button", { name: /sign up/i });

  return { name, email, password, submit, togglePassword };
}

describe("Sign in form test", () => {
  it("Should render", () => {
    setUp();
    expect(screen.getByRole("form")).toBeDefined();
  });

  it("Should display errors when an empty form is submitted.", async () => {
    const { submit } = setUp();
    fireEvent.submit(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(3);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display error only for NAME when other fields filled out correctly.", async () => {
    const { submit, email, password } = setUp();
    const user = userEvent.setup();

    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(screen.getByText(/name is required/i)).toBeDefined();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display error only for EMAIL when other fields filled out correctly.", async () => {
    const { submit, name, password } = setUp();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.type(password, "Test1234!");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display error only for PASSWORD when other fields filled out correctly.", async () => {
    const { submit, name, email } = setUp();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);

    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display NO errors when an form is submitted with correct schema.", async () => {
    const { submit, name, email, password } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(3);

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);

    errorMessages.forEach((message) => {
      expect(message).not.toBeNull();
    });
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
