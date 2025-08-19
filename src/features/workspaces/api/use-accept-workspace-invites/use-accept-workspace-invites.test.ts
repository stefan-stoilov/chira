import { renderHook, act, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { workspacesKeys } from "@/features/workspaces/api/query-key-factory";

import { useAcceptWorkspaceInvites } from "./use-accept-workspace-invites";
import { handlers } from "./mocks";
import { queryMockWorkspaceInvites } from "../use-workspace-invites/mocks/utils";

describe("useAcceptWorkspaceInvites hook test", () => {
  it("Should NOT fail when server responds with success and create an optimistic update once mutation is called.", async () => {
    server.use(handlers.success);

    const WORKSPACE_ID = crypto.randomUUID();
    const onMutate = vi.fn();

    const queryClient = createTestQueryClient();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    const { invites } = await queryMockWorkspaceInvites({
      queryClient,
      id: WORKSPACE_ID,
      page: 1,
    });

    const { result } = renderHook(
      () => useAcceptWorkspaceInvites({ onMutate }),
      {
        wrapper: (props) => QueryWrapper({ ...props, queryClient }),
      },
    );

    await act(async () => {
      result.current.mutate({
        param: { id: WORKSPACE_ID },
        json: { userIds: [invites[0]!.id] },
        page: 1,
      });
    });

    await waitFor(() => {
      // Additional onMutate should be called when provided
      expect(onMutate).toHaveBeenCalledOnce();

      // Query cache should be set when mutation is called.
      expect(setQueryDataSpy).toHaveBeenCalledOnce();

      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("Should revert optimistic update when server responds an error.", async () => {
    server.use(handlers.error);

    const WORKSPACE_ID = crypto.randomUUID();
    const onError = vi.fn();

    const queryClient = createTestQueryClient();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const toastErrorSpy = vi.spyOn(toast, "error");

    const { invites } = await queryMockWorkspaceInvites({
      queryClient,
      id: WORKSPACE_ID,
      page: 1,
    });

    const { result } = renderHook(
      () => useAcceptWorkspaceInvites({ onError }),
      {
        wrapper: (props) => QueryWrapper({ ...props, queryClient }),
      },
    );

    await act(async () => {
      result.current.mutate({
        param: { id: WORKSPACE_ID },
        json: { userIds: [invites[0]!.id] },
        page: 1,
      });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledOnce();

      // Query cache should be set when mutation is called.
      expect(setQueryDataSpy).toHaveBeenCalledOnce();

      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(toastErrorSpy).toHaveBeenCalled();

      // Invalidate queries should be called when there is an error
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: workspacesKeys.invites({ id: WORKSPACE_ID, page: 1 }),
      });
    });
  });
});
