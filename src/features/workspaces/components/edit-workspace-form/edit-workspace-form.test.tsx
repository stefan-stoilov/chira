import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { EditWorkspaceForm } from "./edit-workspace-form";
import { handlers } from "@/features/workspaces/api/use-update-workspace/mocks";
import { createMockWorkspaceData } from "../../api/use-workspace/mocks/data";

const cancel = vi.fn();
const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function setup(onCancel?: typeof cancel) {
  const mockWorkspace = createMockWorkspaceData({ name: "Example Name" });

  render(<EditWorkspaceForm onCancel={onCancel} workspace={mockWorkspace} />, {
    wrapper: QueryWrapper,
  });
  const name = screen.getByLabelText(/name/i);
  const submit = screen.getByRole("button", { name: /save changes/i });

  // Submit button should be disabled before user has made any changes to the form values
  expect(submit).toBeDisabled();

  let cancelBtn: HTMLElement | undefined;
  if (typeof onCancel !== "undefined") {
    cancelBtn = screen.getByRole("button", { name: /cancel/i });
  }

  return { name, cancelBtn, submit };
}

describe("Create workspace form test", () => {
  it("Should render properly with cancel button.", () => {
    const { cancelBtn } = setup(cancel);
    expect(cancelBtn).toBeVisible();
    expect(screen.getByRole("form")).toBeDefined();
  });

  it("Should display a tooltip whenever form values have not been touched and user hovers over submit button", async () => {
    const { submit } = setup();
    const user = userEvent.setup();

    await user.hover(submit);

    expect(await screen.findByRole("tooltip")).toBeVisible();
  });

  it("Should NOT display a tooltip whenever form values have been touched and user hovers over submit button", async () => {
    const { submit, name } = setup();
    const user = userEvent.setup();

    await user.hover(submit);
    const tooltip = await screen.findByRole("tooltip");

    await user.type(name, "Test");
    await user.hover(submit);

    expect(tooltip).not.toBeVisible();
  });

  it("Should display a validation error when an empty form is submitted.", async () => {
    const toastSuccessSpy = vi.spyOn(toast, "success");

    const { name, submit } = setup();
    const user = userEvent.setup();

    await user.clear(name);
    await user.click(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);

    expect(toastSuccessSpy).not.toHaveBeenCalled();
  });

  it("Should display a loader and every form field should be disabled after the form is submitted with correct schema and server is slow to respond.", async () => {
    server.use(handlers.loading);

    const { submit, name } = setup();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.click(submit);

    expect(screen.getByTestId("loader")).toBeVisible();
    expect(name).toBeDisabled();
    expect(submit).toBeDisabled();
  });

  it("Should display no an error toast when a form is submitted with correct schema and server responds with error.", async () => {
    server.use(handlers.errorNotFound);

    const toastErrorSpy = vi.spyOn(toast, "error");

    const { submit, name } = setup();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.click(submit);

    expect(toastErrorSpy).toHaveBeenCalledOnce();
  });

  it("Should display no errors when a form is submitted with correct schema and server responds with success.", async () => {
    server.use(handlers.success);

    const toastSuccessSpy = vi.spyOn(toast, "success");

    const { submit, name } = setup();
    const user = userEvent.setup();

    await user.type(name, "Test");
    await user.click(submit);

    expect(toastSuccessSpy).toHaveBeenCalledOnce();
  });
});
