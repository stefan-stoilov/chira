import type { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import {
  useWorkspaceInvites,
  type WorkspaceInvitesQueryProps,
} from "../../use-workspace-invites";

import * as data from "../data";
import * as handlers from "../handlers";

type QueryMockWorkspaceInvitesProps = {
  queryClient: QueryClient;
  id: string;
} & WorkspaceInvitesQueryProps;

/**
 * Utility function for unit / integration tests that fetches mock workspace invites.
 * Use to check that query cache is properly updating.
 */
export async function queryMockWorkspaceInvites({
  queryClient,
  id,
  page = 1,
}: QueryMockWorkspaceInvitesProps) {
  server.use(handlers.success);

  const { result } = renderHook(() => useWorkspaceInvites({ id, page }), {
    wrapper: (props) => QueryWrapper({ ...props, queryClient }),
  });

  await waitFor(() => {
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);

    const mappedData = {
      ...data.success(page),
      invites: data.success(page).invites.map((inv) => ({
        ...inv,
        createdAt: new Date(inv.createdAt).toDateString(),
        deletedAt: inv.deletedAt
          ? new Date(inv.deletedAt).toDateString()
          : null,
        acceptedAt: inv.acceptedAt
          ? new Date(inv.acceptedAt).toDateString()
          : null,
      })),
    };

    expect(result.current.data).toStrictEqual(mappedData);
  });

  return data.success(page);
}
