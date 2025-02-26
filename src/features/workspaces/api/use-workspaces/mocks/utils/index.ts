import type { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { useWorkspaces } from "../../use-workspaces";
import * as data from "../data";
import * as handlers from "../handlers";

/**
 * Utility function for unit / integration tests that fetches mock workspaces.
 * Use to check that query cache is properly updating.
 *
 * @param queryClient
 */
export async function queryMockWorkspaces(queryClient: QueryClient) {
  server.use(handlers.success);

  const { result } = renderHook(() => useWorkspaces(), {
    wrapper: (props) => QueryWrapper({ ...props, queryClient }),
  });

  await waitFor(() => {
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toStrictEqual(data.success);
  });

  return data.success;
}
