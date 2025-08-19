import type { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { useMembers } from "../../use-members";

import * as data from "../data";
import * as handlers from "../handlers";

type QueryMockWorkspaceMembersProps = {
  queryClient: QueryClient;
  id: string;
};

/**
 * Utility function for unit / integration tests that fetches mock workspace members.
 * Use to check that query cache is properly updating.
 */
export async function queryMockWorkspaceMembers({
  queryClient,
  id,
}: QueryMockWorkspaceMembersProps) {
  server.use(handlers.success());

  const { result } = renderHook(() => useMembers(id), {
    wrapper: (props) => QueryWrapper({ ...props, queryClient }),
  });

  await waitFor(() => {
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toStrictEqual(data.success());
  });

  return data.success();
}
