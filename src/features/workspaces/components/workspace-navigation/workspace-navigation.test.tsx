import { render, screen, waitFor } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";

import { QueryWrapper, mockMatchMedia } from "@/tests/utils";
import { server } from "@/tests/mocks/server";
import { handlers, data } from "../../api/use-workspaces/mocks";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  WorkspaceNavigation,
  WORKSPACE_NAV_ROUTES,
} from "./workspace-navigation";

import { usePathname } from "next/navigation";
import { useWorkspaceId } from "../../hooks/use-workspace-id";

vi.mock("next/navigation");
vi.mock("@/features/workspaces/hooks/use-workspace-id");

function setup() {
  mockMatchMedia(false);

  render(
    <QueryWrapper>
      <NuqsTestingAdapter>
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <WorkspaceNavigation />
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </NuqsTestingAdapter>
    </QueryWrapper>,
  );
}

describe("Workspace Navigation test", () => {
  it("Should not render whenever the server responds with an error.", async () => {
    server.use(handlers.error);

    vi.mocked(usePathname).mockReturnValue(
      `/dashboard/workspaces/${data.getWorkspaceWithOwnerRights().id}`,
    );
    vi.mocked(useWorkspaceId).mockReturnValue(
      data.getWorkspaceWithOwnerRights().id,
    );
    setup();

    await waitFor(() => {
      expect(
        screen.queryAllByTestId("workspace-navigation-skeleton"),
      ).toHaveLength(0);
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });

  it("Should display skeletons whenever waiting for the server to respond.", async () => {
    server.use(handlers.loading);

    vi.mocked(usePathname).mockReturnValue(
      `/dashboard/workspaces/${data.getWorkspaceWithOwnerRights().id}`,
    );
    vi.mocked(useWorkspaceId).mockReturnValue(
      data.getWorkspaceWithOwnerRights().id,
    );
    setup();

    expect(
      await screen.findAllByTestId("workspace-navigation-skeleton"),
    ).toHaveLength(3);
  });

  it("Should render only the workspace route links that are accessible to user role whenever the user is not an admin or owner of the selected workspace.", async () => {
    server.use(handlers.successWithDifferentRoles);

    vi.mocked(usePathname).mockReturnValue(
      `/dashboard/workspaces/${data.getWorkspaceWithUserRights().id}`,
    );
    vi.mocked(useWorkspaceId).mockReturnValue(
      data.getWorkspaceWithUserRights().id,
    );
    setup();

    const { name, role } = data.getWorkspaceWithUserRights();

    expect(await screen.findByText(name)).toBeVisible();

    await waitFor(() => {
      WORKSPACE_NAV_ROUTES.forEach(({ label, permissions }) => {
        if (typeof permissions !== "undefined" && !permissions.has(role)) {
          expect(screen.queryByRole("link", { name: label })).toBeNull();
        } else {
          expect(screen.getByRole("link", { name: label })).toBeVisible();
        }
      });
    });
  });

  it("Should render all workspace route links whenever the user is the owner of the selected workspace.", async () => {
    server.use(handlers.successWithDifferentRoles);

    vi.mocked(usePathname).mockReturnValue(
      `/dashboard/workspaces/${data.getWorkspaceWithOwnerRights().id}`,
    );
    vi.mocked(useWorkspaceId).mockReturnValue(
      data.getWorkspaceWithOwnerRights().id,
    );
    setup();

    expect(
      await screen.findByText(data.getWorkspaceWithOwnerRights().name),
    ).toBeVisible();

    await waitFor(() => {
      WORKSPACE_NAV_ROUTES.forEach(({ label }) => {
        expect(screen.getByRole("link", { name: label })).toBeVisible();
      });
    });
  });
});
