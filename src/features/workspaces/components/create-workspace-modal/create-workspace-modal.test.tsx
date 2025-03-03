import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";

import { CREATE_WORKSPACE_SEARCH_PARAM } from "../../hooks/use-create-workspace-modal";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, mockMatchMedia } from "@/tests/utils";
import { handlers } from "../../api/use-create-workspace/mocks";
import {
  CreateWorkspaceButton,
  CreateWorkspaceModal,
} from "./create-workspace-modal";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function setup(
  searchParams?: string | Record<string, string> | URLSearchParams,
) {
  render(
    <QueryWrapper>
      <CreateWorkspaceButton />
      <CreateWorkspaceModal />
    </QueryWrapper>,
    {
      wrapper: withNuqsTestingAdapter({ searchParams }),
    },
  );
}

describe("Create Workspace Modal test", () => {
  it("Should render with modal closed and open it when the user clicks create workspace modal button.", async () => {
    server.use(handlers.success);
    mockMatchMedia(true);

    setup();
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    expect(button).toBeVisible();

    await user.click(button);
    expect(await screen.findByRole("form")).toBeVisible();
  });

  it("Should render with the modal open then the search param is set for it.", async () => {
    server.use(handlers.success);
    mockMatchMedia(true);

    setup({
      [CREATE_WORKSPACE_SEARCH_PARAM]: "true",
    });

    expect(
      await screen.findByRole("button", {
        name: /create workspace/i,
      }),
    ).toBeVisible();
    expect(await screen.findByRole("form")).toBeVisible();
  });
});
