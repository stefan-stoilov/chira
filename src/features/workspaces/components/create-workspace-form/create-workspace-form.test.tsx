import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { handlers } from "@/features/workspaces/api/use-create-workspace/mocks";

const cancel = vi.fn();
const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function setUp(onCancel?: typeof cancel) {
  render(<CreateWorkspaceForm onCancel={onCancel} />, {
    wrapper: QueryWrapper,
  });
  const name = screen.getByLabelText(/name/i);

  const submit = screen.getByRole("button", { name: /create workspace/i });

  let cancelBtn: HTMLElement | undefined;
  if (typeof onCancel !== "undefined") {
    cancelBtn = screen.getByRole("button", { name: /cancel/i });
  }

  return { name, cancelBtn, submit };
}

describe("Create workspace form test", () => {
  it("Should render properly with cancel button.", () => {
    const { cancelBtn } = setUp(cancel);
    expect(cancelBtn).toBeVisible();
    expect(screen.getByRole("form")).toBeDefined();
  });

  it("Should display a validation error when an empty form is submitted.", async () => {
    const { submit } = setUp();
    fireEvent.submit(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  it("Should display a toast error when an form is submitted with correct schema and server responds with an error.", async () => {
    server.use(handlers.error);

    const toastErrorSpy = vi.spyOn(toast, "error");

    const { submit, name } = setUp();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.click(submit);

    expect(toastErrorSpy).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("Should display a loader and every form field should be disabled when the form is submitted with correct schema and server is slow to respond.", async () => {
    server.use(handlers.loading);

    const { submit, name } = setUp();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.click(submit);

    expect(screen.getByTestId("loader")).toBeVisible();
    expect(submit).toBeDisabled();
    expect(name).toBeDisabled();
    expect(push).not.toHaveBeenCalled();
  });

  it("Should display no errors when an form is submitted with correct schema and server responds with success.", async () => {
    server.use(handlers.success);

    const toastSuccessSpy = vi.spyOn(toast, "success");

    const { submit, name } = setUp();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.click(submit);

    expect(push).toHaveBeenCalledOnce();
    expect(toastSuccessSpy).toHaveBeenCalledOnce();
  });
});
