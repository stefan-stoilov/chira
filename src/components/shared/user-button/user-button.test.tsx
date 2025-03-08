import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { UserButton } from "./user-button";
import {
  handlers as userHandlers,
  data,
} from "@/features/auth/api/use-current-user/mocks";
import { handlers as authHandlers } from "@/features/auth/api/use-sign-out/mocks";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("User Button test", () => {
  it("Should display user data when clicked and allow for the user to sign out when there are no server errors.", async () => {
    server.use(userHandlers.success, authHandlers.success);
    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    render(
      <QueryWrapper queryClient={queryClient}>
        <UserButton />
      </QueryWrapper>,
    );

    expect(await screen.findByRole("button")).toBeVisible();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));

    expect(await screen.findByText(data.MOCKED_USER.name)).toBeVisible();

    const menu = await screen.findByRole("menu");
    const signOutBtn = await screen.findByRole("menuitem", {
      name: /sign out/i,
    });

    await user.click(signOutBtn);

    await waitFor(() => {
      expect(menu).not.toBeVisible();
      expect(signOutBtn).not.toBeVisible();
      expect(push).toHaveBeenCalledWith("/sign-in");
      expect(invalidateQueriesSpy).toHaveBeenCalled();
    });
  });

  it("Should display loader when waiting for server response.", async () => {
    server.use(userHandlers.loading);

    render(
      <QueryWrapper>
        <UserButton />
      </QueryWrapper>,
    );

    expect(await screen.findByTestId("loader")).toBeVisible();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("Should display error icon and message when the server responds with an error.", async () => {
    server.use(userHandlers.error);
    const toastErrorSpy = vi.spyOn(toast, "error");

    render(
      <QueryWrapper>
        <UserButton />
      </QueryWrapper>,
    );

    expect(await screen.findByTestId("user-error-icon")).toBeVisible();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));

    expect(await screen.findByTestId("user-error-message")).toBeVisible();
    expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
    expect(toastErrorSpy).toHaveBeenCalled();
  });
});
