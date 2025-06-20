import { renderHook, act, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";

import { workspacesQuery } from "../use-workspaces";
import { workspaceQuery } from "../use-workspace";
import { queryMockWorkspaces } from "../use-workspaces/mocks/utils";
import { queryMockWorkspace } from "../use-workspace/mocks";
import { useUpdateWorkspace } from "./use-update-workspace";
import { handlers } from "./mocks";

describe("useUpdateWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.errorUnauthorized);

    const { result } = renderHook(() => useUpdateWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        param: { id: "test" },
        json: { name: "New Name" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  it("Should NOT fail when server responds with success and the mutation should update the query data without invalidating queries for workspaces.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { workspaces } = await queryMockWorkspaces(queryClient);

    const toUpdateId = workspaces[0]!.id;
    const name = "New Name";

    const { result } = renderHook(() => useUpdateWorkspace(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({
        param: { id: toUpdateId },
        json: { name },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);

      // Queries should not be invalidated.
      expect(invalidateQueriesSpy).not.toHaveBeenCalled();

      // Query cache should be updated when a workspace is deleted.
      expect(setQueryDataSpy).toHaveBeenCalledTimes(2);

      expect(qcResult.current.getQueryData(workspacesQuery.queryKey)).toEqual({
        workspaces: workspaces.map((workspace) =>
          toUpdateId !== workspace.id ? workspace : { ...workspace, name },
        ),
      });
    });

    const workspace = await queryMockWorkspace(queryClient);

    await act(async () => {
      result.current.mutate({
        param: { id: workspace.id },
        json: { name },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);

      // Queries should not be invalidated.
      expect(invalidateQueriesSpy).not.toHaveBeenCalled();

      // Query cache should be updated when a workspace is deleted.
      expect(setQueryDataSpy).toHaveBeenCalledTimes(4);

      expect(
        qcResult.current.getQueryData(workspaceQuery(workspace.id).queryKey),
      ).toEqual({ ...workspace, name });
    });
  });
});
