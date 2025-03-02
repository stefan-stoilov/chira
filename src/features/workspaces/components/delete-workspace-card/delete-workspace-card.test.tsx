import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { QueryWrapper, mockMatchMedia } from "@/tests/utils";
import { server } from "@/tests/mocks/server";
import { handlers } from "@/features/workspaces/api/use-delete-workspace/mocks";
import { data } from "@/features/workspaces/api/use-workspace/mocks";
import { DeleteWorkspaceCard } from "./delete-workspace-card";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

async function setup() {
  render(<DeleteWorkspaceCard workspaceId={data.MOCK_WORKSPACE_ID} />, {
    wrapper: QueryWrapper,
  });

  const deleteBtn = screen.getByRole("button", { name: /delete workspace/i });

  fireEvent.click(deleteBtn);

  const dialog = await screen.findByRole("dialog");
  const confirmBtn = await screen.findByRole("button", { name: /confirm/i });
  const cancelBtn = await screen.findByRole("button", { name: /cancel/i });

  return { deleteBtn, confirmBtn, cancelBtn, dialog };
}

describe("Create workspace form test", () => {
  mockMatchMedia(false);

  it("Should have disabled buttons once confirm delete button is clicked and component is waiting for the server to respond.", async () => {
    server.use(handlers.loading);
    const { deleteBtn, confirmBtn, cancelBtn } = await setup();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(confirmBtn).toBeDisabled();
      expect(deleteBtn).toBeDisabled();
      expect(cancelBtn).toBeDisabled();
      expect(screen.getAllByTestId("loader")).toHaveLength(2);
    });
  });

  it("Should show toast error once confirm delete button is clicked and the server responds with error.", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");
    server.use(handlers.errorUnauthorized);
    const { confirmBtn } = await setup();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledOnce();
      expect(push).not.toHaveBeenCalled();
    });
  });

  it("Should show toast success once confirm delete button is clicked and the server responds with success.", async () => {
    const toastSuccessSpy = vi.spyOn(toast, "success");
    server.use(handlers.success);
    const { confirmBtn } = await setup();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledOnce();
      expect(push).toHaveBeenCalled();
    });
  });
});
