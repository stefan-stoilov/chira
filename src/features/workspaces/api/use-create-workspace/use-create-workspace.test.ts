import { renderHook, act, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";

import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { handlers, data } from "./mocks";
import { useCreateWorkspace } from "./use-create-workspace";
import { workspacesKeys } from "../query-key-factory";
import { queryMockWorkspaces } from "../use-workspaces/mocks";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("useCreateWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useCreateWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        json: { name: "Test" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  it("Should NOT fail when server responds with success and the mutation should update the query data without invalidating queries.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const workspacesQueryData = await queryMockWorkspaces(queryClient);

    expect(qcResult.current.getQueryData(workspacesKeys.lists())).toEqual(
      workspacesQueryData,
    );

    const { result } = renderHook(() => useCreateWorkspace(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({
        json: { name: data.MOCK_WORKSPACE.name },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(data.success);

      // Queries should not be invalidated.
      expect(invalidateQueriesSpy).not.toHaveBeenCalled();

      // Query cache should be updated when a workspace is created.
      expect(setQueryDataSpy).toHaveBeenCalledTimes(2);

      // Query cache for the associated keys should be properly updated
      expect(
        qcResult.current.getQueryData(workspacesKeys.lists()),
      ).toStrictEqual({
        workspaces: [...workspacesQueryData.workspaces, data.success],
      });
      expect(
        qcResult.current.getQueryData(
          workspacesKeys.detail(data.MOCK_WORKSPACE.id),
        ),
      ).toStrictEqual(data.success);
    });
    expect(push).toHaveBeenCalledTimes(1);
  });
});
