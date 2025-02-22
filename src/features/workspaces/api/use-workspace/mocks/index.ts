import type { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { WorkspaceRoles } from "@/server/db/schemas";
import { useWorkspace } from "../use-workspace";
import * as data from "./data";
import * as handlers from "./handlers";

/**
 * Utility function for unit / integration tests that fetches a mock workspace.
 * Use to check that query cache is properly updating.
 *
 * @param queryClient
 */
export async function queryMockWorkspace(
  queryClient: QueryClient,
  role?: WorkspaceRoles,
) {
  const mocks = {
    [WorkspaceRoles.user]: {
      handler: handlers.successUser,
      data: data.successUser,
    },
    [WorkspaceRoles.admin]: {
      handler: handlers.successAdmin,
      data: data.successAdmin,
    },
    [WorkspaceRoles.owner]: {
      handler: handlers.successOwner,
      data: data.successOwner,
    },
  };

  server.use(role ? mocks[role].handler : handlers.successUser);

  const { result } = renderHook(() => useWorkspace(data.MOCK_WORKSPACE_ID), {
    wrapper: (props) => QueryWrapper({ ...props, queryClient }),
  });

  const mockResData = role ? mocks[role].data : data.successUser;

  await waitFor(() => {
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toStrictEqual(mockResData);
  });

  return mockResData;
}

export { data, handlers };
