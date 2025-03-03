import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { QueryWrapper } from "@/tests/utils";
import { server } from "@/tests/mocks/server";
import { handlers } from "@/features/auth/api/use-sign-up/mocks";
import { SignUpForm } from "./sign-up-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function setUp() {
  render(
    <QueryWrapper>
      <SignUpForm />
    </QueryWrapper>,
  );
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
  });

  it("Should display error only for NAME when other fields filled out correctly.", async () => {
    const { submit, email, password } = setUp();
    const user = userEvent.setup();

    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(screen.getByText(/name is required/i)).toBeDefined();
  });

  it("Should display error only for EMAIL when other fields filled out correctly.", async () => {
    const { submit, name, password } = setUp();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.type(password, "Test1234!");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  it("Should display error only for PASSWORD when other fields filled out correctly.", async () => {
    const { submit, name, email } = setUp();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  it("Should display loader and every form field should be disabled after the form is submitted with correct schema and the component is waiting for a response from the server", async () => {
    server.use(handlers.loading);

    const { submit, email, password, name } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(3);

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);

    expect(await screen.findByTestId("loader")).toBeVisible();
    expect(submit).toBeDisabled();
    expect(name).toBeDisabled();
    expect(email).toBeDisabled();
    expect(password).toBeDisabled();
  });

  it("Should display a toast error when form is submitted with correct schema and server responds with success.", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");
    server.use(handlers.error);

    const { submit, name, email, password } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(3);

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });

  it("Should display NO errors when form is submitted with correct schema and server responds with success.", async () => {
    server.use(handlers.success);

    const { submit, name, email, password } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(3);

    await user.type(name, "Test");
    await user.type(email, "test@test.com");
    await user.type(password, "Test1234!");
    await user.click(submit);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });
});
