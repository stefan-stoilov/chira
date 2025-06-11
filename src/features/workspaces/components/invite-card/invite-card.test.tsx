import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { env } from "@/env";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, mockMatchMedia } from "@/tests/utils";
import { WorkspaceRoles } from "@/server/db/schemas";

import * as getHandlers from "../../api/use-workspace/mocks/handlers";
import * as patchHandlers from "../../api/use-update-invite-code/mocks/handlers";
import { useWorkspace } from "../../api/use-workspace";
import {
  MOCK_WORKSPACE_ID,
  MOCK_WORKSPACE_NAME,
  MOCK_WORKSPACE_INVITE_LINK,
  MOCK_WORKSPACE_INVITE_CODE,
} from "../../api/use-workspace/mocks/data";

import { InviteCard } from "./invite-card";

function InviteCardWrapper() {
  const { data: workspace } = useWorkspace(MOCK_WORKSPACE_ID);

  return <>{workspace && <InviteCard workspace={workspace} />}</>;
}

type SetupProps = {
  role: WorkspaceRoles;
  withoutInviteCode?: boolean;
  mutation?: "success" | "loading" | "error";
};

async function setup({
  role,
  withoutInviteCode,
  mutation = "success",
}: SetupProps) {
  if (role === WorkspaceRoles.user) {
    server.use(
      getHandlers[withoutInviteCode ? "successUserNoInvite" : "successUser"],
      patchHandlers[mutation],
    );
  } else if (role === WorkspaceRoles.admin) {
    server.use(
      getHandlers[withoutInviteCode ? "successAdminNoInvite" : "successAdmin"],
      patchHandlers[mutation],
    );
  } else if (role === WorkspaceRoles.owner) {
    server.use(
      getHandlers[withoutInviteCode ? "successOwnerNoInvite" : "successOwner"],
      patchHandlers[mutation],
    );
  }

  mockMatchMedia(true);

  render(
    <QueryWrapper>
      <InviteCardWrapper />
    </QueryWrapper>,
  );

  const toastSuccessSpy = vi.spyOn(toast, "success");
  const toastErrorSpy = vi.spyOn(toast, "error");
  const toastMessageSpy = vi.spyOn(toast, "message");

  return { toastSuccessSpy, toastErrorSpy, toastMessageSpy };
}

async function getAdminLevelSettingsWithInvite(isLinkUpdated?: boolean) {
  // Expect the buttons that modify link to be present.
  const removeLinkBtn = await screen.findByRole("button", {
    name: /remove invite link/i,
  });
  const updateLinkBtn = await screen.findByRole("button", {
    name: /update invite link/i,
  });
  expect(removeLinkBtn).toBeVisible();
  expect(updateLinkBtn).toBeVisible();

  expect(
    await screen.findByText(MOCK_WORKSPACE_NAME, { exact: false }),
  ).toBeVisible();

  // Expect input with invite link to be present
  const input = await screen.findByLabelText(/invite link/i);
  expect(input).toBeDisabled();

  if (isLinkUpdated) {
    expect(input).not.toHaveValue(MOCK_WORKSPACE_INVITE_LINK);
  } else {
    expect(input).toHaveValue(MOCK_WORKSPACE_INVITE_LINK);
  }

  // Expect generate invite link button not to be present
  expect(
    screen.queryByRole("button", { name: /generate invite link/i }),
  ).toBeNull();

  return { removeLinkBtn, updateLinkBtn, input };
}

async function getAdminLevelSettingsWithoutInvite() {
  // Expect generate invite link button to be present
  const generateLinkBtn = await screen.findByRole("button", {
    name: /generate invite link/i,
  });
  expect(generateLinkBtn).toBeVisible();

  expect(
    await screen.findByText(/does not have an invite link/i, {
      exact: false,
    }),
  ).toBeVisible();

  // Expect the buttons that modify link not to be present.
  expect(
    screen.queryByRole("button", { name: /remove invite link/i }),
  ).toBeNull();
  expect(
    screen.queryByRole("button", { name: /update invite link/i }),
  ).toBeNull();

  // Expect input with invite link and copy link button not to be present
  expect(screen.queryByLabelText(/invite link/i)).toBeNull();
  expect(screen.queryByRole("button", { name: /copy/i })).toBeNull();

  return { generateLinkBtn };
}

async function checkUpdatedInputValue() {
  // Expect input with correctly generated invite link to be present.
  const inputWithNewLink = await screen.findByLabelText(/invite link/i);
  const newInputValue = inputWithNewLink.getAttribute("value");
  expect(newInputValue).not.toBe(MOCK_WORKSPACE_INVITE_LINK);
  expect(
    newInputValue?.includes(
      `${env.NEXT_PUBLIC_APP_URL}/dashboard/workspaces/join`,
    ),
  ).toBe(true);

  const params = new URL(newInputValue || "").searchParams;
  expect(params.get("id") === MOCK_WORKSPACE_ID).toBe(true);
  expect(
    params.get("code")?.length === 6 &&
      params.get("code") !== MOCK_WORKSPACE_INVITE_CODE,
  ).toBe(true);
}

describe("Invite Card test", () => {
  describe("User role - not able to make changes to invite link", async () => {
    it("Should display a disabled input with an invite link that could that could be copied via button whenever the fetched workspace has an invite link.", async () => {
      const { toastMessageSpy } = await setup({ role: WorkspaceRoles.user });

      expect(
        await screen.findByText(MOCK_WORKSPACE_NAME, { exact: false }),
      ).toBeVisible();
      const input = await screen.findByLabelText(/invite link/i);
      expect(input).toBeDisabled();
      expect(input).toHaveValue(MOCK_WORKSPACE_INVITE_LINK);

      const user = userEvent.setup();
      await user.click(screen.getByRole("button"));
      const clipboardText = await navigator.clipboard.readText();
      expect(clipboardText).toBe(MOCK_WORKSPACE_INVITE_LINK);
      expect(toastMessageSpy).toHaveBeenCalledOnce();
    });

    it("Should only display a message whenever the fetched workspace does not have an invite link", async () => {
      await setup({ role: WorkspaceRoles.user, withoutInviteCode: true });
      expect(
        await screen.findByText(/does not have an invite link/i, {
          exact: false,
        }),
      ).toBeVisible();
      expect(screen.queryByRole("button")).toBeNull();
      expect(screen.queryByLabelText(/invite link/i)).toBeNull();
    });
  });

  describe("Admin role - able to make changes to invite link", async () => {
    describe("With present invite link", () => {
      it("Should be able to remove existing invite link and then generate new one when there are no server errors.", async () => {
        const { toastSuccessSpy, toastMessageSpy } = await setup({
          role: WorkspaceRoles.admin,
        });

        const { removeLinkBtn } = await getAdminLevelSettingsWithInvite();

        // Expect copy button to work
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /copy/i }));
        const clipboardText = await navigator.clipboard.readText();
        expect(clipboardText).toBe(MOCK_WORKSPACE_INVITE_LINK);
        expect(toastMessageSpy).toHaveBeenCalledOnce();

        // Remove invite link from workspace
        await user.click(removeLinkBtn);
        expect(
          await screen.findByRole("button", {
            name: /cancel/i,
          }),
        ).toBeVisible();
        expect(
          await screen.findByRole("button", {
            name: /confirm/i,
          }),
        ).toBeVisible();
        await user.click(screen.getByRole("button", { name: /confirm/i }));

        // Expect that previous buttons and input are no longer visible.
        await waitFor(() => {
          [/remove invite link/i, /update invite link/i, /copy/i].forEach(
            (name) => {
              expect(screen.queryByRole("button", { name })).toBeNull();
            },
          );

          expect(screen.queryByLabelText(/invite link/i)).toBeNull();
          expect(
            screen.getByText(/does not have an invite link/i, {
              exact: false,
            }),
          ).toBeVisible();

          expect(toastSuccessSpy).toHaveBeenCalledOnce();
        });

        // Generate new invite link
        const genInviteLinkBtn = await screen.findByRole("button", {
          name: /generate invite link/i,
        });
        await user.click(genInviteLinkBtn);

        // Expect the buttons that modify link to be present.
        expect(
          await screen.findByRole("button", {
            name: /remove invite link/i,
          }),
        ).toBeVisible();
        expect(
          await screen.findByRole("button", {
            name: /update invite link/i,
          }),
        ).toBeVisible();

        expect(toastSuccessSpy).toHaveBeenCalledTimes(2);

        await checkUpdatedInputValue();
      });

      it("Should be able to update existing invite link when there are no server errors.", async () => {
        const { toastSuccessSpy, toastMessageSpy } = await setup({
          role: WorkspaceRoles.admin,
        });

        const { updateLinkBtn } = await getAdminLevelSettingsWithInvite();

        // Expect copy button to work
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /copy/i }));
        const clipboardText = await navigator.clipboard.readText();
        expect(clipboardText).toBe(MOCK_WORKSPACE_INVITE_LINK);
        expect(toastMessageSpy).toHaveBeenCalledOnce();

        // Update invite link for workspace
        await user.click(updateLinkBtn);
        expect(
          await screen.findByRole("button", {
            name: /cancel/i,
          }),
        ).toBeVisible();
        expect(
          await screen.findByRole("button", {
            name: /confirm/i,
          }),
        ).toBeVisible();
        await user.click(screen.getByRole("button", { name: /confirm/i }));

        // Expect that previous buttons and input remain visible.
        await waitFor(() => {
          [/remove invite link/i, /update invite link/i, /copy/i].forEach(
            (name) => {
              expect(screen.getByRole("button", { name })).toBeVisible();
            },
          );

          expect(screen.getByLabelText(/invite link/i)).toBeVisible();
          expect(
            screen.queryByText(/does not have an invite link/i, {
              exact: false,
            }),
          ).toBeNull();
          expect(
            screen.queryByRole("button", {
              name: /generate invite link/i,
            }),
          ).toBeNull();

          expect(toastSuccessSpy).toHaveBeenCalledOnce();
        });

        await checkUpdatedInputValue();
      });

      it("Should not be able to update existing invite link and should show error message when server responds with an error.", async () => {
        const { toastSuccessSpy, toastMessageSpy, toastErrorSpy } = await setup(
          {
            role: WorkspaceRoles.admin,
            mutation: "error",
          },
        );

        const { updateLinkBtn } = await getAdminLevelSettingsWithInvite();

        // Expect copy button to work
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /copy/i }));
        const clipboardText = await navigator.clipboard.readText();
        expect(clipboardText).toBe(MOCK_WORKSPACE_INVITE_LINK);
        expect(toastMessageSpy).toHaveBeenCalledOnce();

        // Attempt to update invite link for workspace
        await user.click(updateLinkBtn);
        expect(
          await screen.findByRole("button", {
            name: /cancel/i,
          }),
        ).toBeVisible();
        expect(
          await screen.findByRole("button", {
            name: /confirm/i,
          }),
        ).toBeVisible();
        await user.click(screen.getByRole("button", { name: /confirm/i }));

        // Expect error message and for the component to have not changed
        await waitFor(() => {
          expect(toastErrorSpy).toHaveBeenCalled();
          expect(toastSuccessSpy).not.toHaveBeenCalled();
          [/remove invite link/i, /update invite link/i, /copy/i].forEach(
            (name) => {
              expect(screen.getByRole("button", { name })).toBeVisible();
            },
          );
          expect(screen.getByLabelText(/invite link/i)).toBeDisabled();
          expect(screen.getByLabelText(/invite link/i)).toHaveValue(
            MOCK_WORKSPACE_INVITE_LINK,
          );
        });
      });

      it("Should not be able to remove existing invite link and should show error message when server responds with an error.", async () => {
        const { toastSuccessSpy, toastMessageSpy, toastErrorSpy } = await setup(
          {
            role: WorkspaceRoles.admin,
            mutation: "error",
          },
        );

        const { removeLinkBtn } = await getAdminLevelSettingsWithInvite();

        // Expect copy button to work
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /copy/i }));
        const clipboardText = await navigator.clipboard.readText();
        expect(clipboardText).toBe(MOCK_WORKSPACE_INVITE_LINK);
        expect(toastMessageSpy).toHaveBeenCalledOnce();

        // Attempt to update invite link for workspace
        await user.click(removeLinkBtn);
        expect(
          await screen.findByRole("button", {
            name: /cancel/i,
          }),
        ).toBeVisible();
        expect(
          await screen.findByRole("button", {
            name: /confirm/i,
          }),
        ).toBeVisible();
        await user.click(screen.getByRole("button", { name: /confirm/i }));

        // Expect error message and for the component to have not changed
        await waitFor(() => {
          expect(toastErrorSpy).toHaveBeenCalled();
          expect(toastSuccessSpy).not.toHaveBeenCalled();
          expect(
            screen.queryByRole("button", {
              name: /generate invite link/i,
            }),
          ).toBeNull();
          [/remove invite link/i, /update invite link/i, /copy/i].forEach(
            (name) => {
              expect(screen.getByRole("button", { name })).toBeVisible();
            },
          );
          expect(screen.getByLabelText(/invite link/i)).toBeDisabled();
          expect(screen.getByLabelText(/invite link/i)).toHaveValue(
            MOCK_WORKSPACE_INVITE_LINK,
          );
        });
      });

      it("Should display loader for invite settings when attempting to update existing invite link and server response is awaited.", async () => {
        const { toastMessageSpy } = await setup({
          role: WorkspaceRoles.admin,
          mutation: "loading",
        });

        const { updateLinkBtn } = await getAdminLevelSettingsWithInvite();

        // Expect copy button to work
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /copy/i }));
        const clipboardText = await navigator.clipboard.readText();
        expect(clipboardText).toBe(MOCK_WORKSPACE_INVITE_LINK);
        expect(toastMessageSpy).toHaveBeenCalledOnce();

        // Attempt to update invite link for workspace
        await user.click(updateLinkBtn);

        const close = await screen.findByRole("button", {
          name: /close/i,
        });
        expect(close).toBeVisible();
        const confirmBtn = await screen.findByRole("button", {
          name: /confirm/i,
        });
        expect(confirmBtn).toBeVisible();

        await user.click(confirmBtn);
        await user.click(close);

        await waitFor(() => {
          expect(
            screen.queryByRole("button", { name: /remove invite link/i }),
          ).toBeDisabled();
          expect(
            screen.queryByRole("button", { name: /update invite link/i }),
          ).toBeDisabled();
          expect(screen.getByTestId("invite-settings-loader")).toBeVisible();
          expect(screen.getByLabelText(/invite link/i)).toBeDisabled();
          expect(screen.getByLabelText(/invite link/i)).toHaveValue(
            MOCK_WORKSPACE_INVITE_LINK,
          );
        });
      });

      it("Should display loader for invite settings when attempting to remove existing invite link and server response is awaited.", async () => {
        const { toastMessageSpy } = await setup({
          role: WorkspaceRoles.admin,
          mutation: "loading",
        });

        const { removeLinkBtn } = await getAdminLevelSettingsWithInvite();

        // Expect copy button to work
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /copy/i }));
        const clipboardText = await navigator.clipboard.readText();
        expect(clipboardText).toBe(MOCK_WORKSPACE_INVITE_LINK);
        expect(toastMessageSpy).toHaveBeenCalledOnce();

        // Attempt to update invite link for workspace
        await user.click(removeLinkBtn);

        const close = await screen.findByRole("button", {
          name: /close/i,
        });
        expect(close).toBeVisible();
        const confirmBtn = await screen.findByRole("button", {
          name: /confirm/i,
        });
        expect(confirmBtn).toBeVisible();

        await user.click(confirmBtn);
        await user.click(close);

        await waitFor(() => {
          expect(
            screen.queryByRole("button", { name: /remove invite link/i }),
          ).toBeDisabled();
          expect(
            screen.queryByRole("button", { name: /update invite link/i }),
          ).toBeDisabled();
          expect(screen.getByTestId("invite-settings-loader")).toBeVisible();
          expect(screen.getByLabelText(/invite link/i)).toBeDisabled();
          expect(screen.getByLabelText(/invite link/i)).toHaveValue(
            MOCK_WORKSPACE_INVITE_LINK,
          );
        });
      });
    });

    describe("Without invite link", () => {
      it("Should be able to generate an invite link and when there are no server errors.", async () => {
        const { toastErrorSpy, toastSuccessSpy } = await setup({
          role: WorkspaceRoles.admin,
          withoutInviteCode: true,
          mutation: "success",
        });

        const { generateLinkBtn } = await getAdminLevelSettingsWithoutInvite();

        const user = userEvent.setup();
        await user.click(generateLinkBtn);

        await getAdminLevelSettingsWithInvite(true);

        expect(toastErrorSpy).not.toHaveBeenCalled();
        expect(toastSuccessSpy).toHaveBeenCalled();
      });

      it("Should display loader for when attempting to generate an invite link and server response is awaited.", async () => {
        const { toastErrorSpy, toastSuccessSpy } = await setup({
          role: WorkspaceRoles.admin,
          withoutInviteCode: true,
          mutation: "loading",
        });

        const { generateLinkBtn } = await getAdminLevelSettingsWithoutInvite();

        const user = userEvent.setup();
        await user.click(generateLinkBtn);

        expect(generateLinkBtn).toBeDisabled();
        expect(await screen.findByTestId("loader")).toBeVisible();
        expect(toastErrorSpy).not.toHaveBeenCalled();
        expect(toastSuccessSpy).not.toHaveBeenCalled();
      });

      it("Should not be able to generate an invite link and should show error message when server responds with an error.", async () => {
        const { toastErrorSpy, toastSuccessSpy } = await setup({
          role: WorkspaceRoles.admin,
          withoutInviteCode: true,
          mutation: "error",
        });

        const { generateLinkBtn } = await getAdminLevelSettingsWithoutInvite();
        const user = userEvent.setup();
        await user.click(generateLinkBtn);

        await waitFor(() => {
          expect(toastErrorSpy).toHaveBeenCalled();
          expect(toastSuccessSpy).not.toHaveBeenCalled();
          [/remove invite link/i, /update invite link/i, /copy/i].forEach(
            (name) => {
              expect(screen.queryByRole("button", { name })).toBeNull();
            },
          );
          expect(screen.queryByLabelText(/invite link/i)).toBeNull();
        });
      });
    });
  });
});
