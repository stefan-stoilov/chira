import { renderHook, act, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";

import { workspacesKeys } from "../query-key-factory";
import { queryMockWorkspaces } from "../use-workspaces/mocks";
import { queryMockWorkspace } from "../use-workspace/mocks";
import { useDeleteWorkspace } from "./use-delete-workspace";
import { handlers } from "./mocks";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("useDeleteWorkspace hook test", () => {
  it("Should NOT fail when server responds with success and the mutation should update the query data without invalidating queries for workspaces list.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { workspaces } = await queryMockWorkspaces(queryClient);

    const toDeleteId = workspaces[0]!.id;

    const { result } = renderHook(() => useDeleteWorkspace(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({ param: { id: toDeleteId } });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({ id: toDeleteId });

      // Queries should not be invalidated.
      expect(invalidateQueriesSpy).not.toHaveBeenCalled();

      // Query cache should be updated when a workspace is deleted.
      expect(setQueryDataSpy).toHaveBeenCalledTimes(1);

      expect(
        qcResult.current.getQueryData(workspacesKeys.lists()),
      ).toStrictEqual({
        workspaces: workspaces.slice(1),
      });

      expect(push).toHaveBeenCalledTimes(1);
    });
  });

  it("Should NOT fail when server responds with success and the mutation should update the query data without invalidating query for workspace.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");
    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const workspace = await queryMockWorkspace(queryClient);

    const toDeleteId = workspace.id;

    const { result } = renderHook(() => useDeleteWorkspace(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({ param: { id: toDeleteId } });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({ id: toDeleteId });

      // Queries should not be invalidated.
      expect(invalidateQueriesSpy).not.toHaveBeenCalled();

      // // Query cache should be updated when a workspace is deleted.
      expect(setQueryDataSpy).toHaveBeenCalledTimes(1);
      expect(removeQueriesSpy).toHaveBeenCalledWith({
        queryKey: workspacesKeys.detail(toDeleteId),
      });

      expect(
        qcResult.current.getQueryData(workspacesKeys.detail(toDeleteId)),
      ).toBe(undefined);

      expect(push).toHaveBeenCalledTimes(2);
    });
  });
});
