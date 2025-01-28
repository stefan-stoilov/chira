import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateWorkspaceForm } from "./create-workspace-form";

const mutate = vi.fn();
const cancel = vi.fn();

function setUp(onCancel?: typeof cancel) {
  vi.mock("@/features/workspaces/api", () => ({
    useCreateWorkspace: () => ({ mutate, isPending: false }),
  }));

  render(<CreateWorkspaceForm onCancel={onCancel} />);
  const name = screen.getByLabelText(/name/i);
  const iconInput = screen.getByLabelText(/icon/i);
  const uploadIconBtn = screen.getByRole("button", { name: /upload image/i });
  const submit = screen.getByRole("button", { name: /create workspace/i });

  let cancelBtn: HTMLElement | undefined;
  if (typeof onCancel !== "undefined") {
    cancelBtn = screen.getByRole("button", { name: /cancel/i });
  }

  return { name, iconInput, uploadIconBtn, cancelBtn, submit };
}

describe("Create workspace form test", () => {
  it("Should render", () => {
    setUp(cancel);
    expect(screen.getByRole("form")).toBeDefined();
  });

  it("Should display an error when an empty form is submitted.", async () => {
    const { submit } = setUp();
    fireEvent.submit(submit);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("Should display no errors when an form is submitted with correct schema.", async () => {
    const { submit, name } = setUp();
    const user = userEvent.setup();
    await user.click(submit);

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(1);

    await user.type(name, "Test");
    await user.click(submit);

    errorMessages.forEach((message) => {
      expect(message).not.toBeNull();
    });
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
