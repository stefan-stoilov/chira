import { renderHook, act, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { workspacesKeys } from "@/features/workspaces/api/query-key-factory";
import { WorkspaceRoles } from "@/server/db/schemas";

import { usePromoteMember } from "./use-promote-member";
import { handlers } from "./mocks";
import { queryMockWorkspaceMembers } from "../use-members/mocks/utils";

describe("usePromoteMember hook test", () => {
  it("Should NOT fail when server responds with success and create an optimistic update once mutation is called.", async () => {
    server.use(handlers.success);

    const WORKSPACE_ID = crypto.randomUUID();
    const onMutate = vi.fn();

    const queryClient = createTestQueryClient();
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { members } = await queryMockWorkspaceMembers({
      queryClient,
      id: WORKSPACE_ID,
    });

    const { result } = renderHook(() => usePromoteMember({ onMutate }), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({
        param: { id: WORKSPACE_ID, "user-id": members[2]!.id },
      });
    });

    await waitFor(() => {
      // Additional onMutate should be called when provided
      expect(onMutate).toHaveBeenCalledOnce();

      // Query cache should be set when mutation is called.
      expect(setQueryDataSpy).toHaveBeenCalledOnce();
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        workspacesKeys.members(WORKSPACE_ID),
        {
          members: members.map((mem, i) =>
            i !== 2 ? mem : { ...mem, role: WorkspaceRoles.admin },
          ),
        },
      );

      // Query cache should be updated when mutation is called.
      expect(
        qcResult.current.getQueryData(workspacesKeys.members(WORKSPACE_ID)),
      ).toStrictEqual({
        members: members.map((mem, i) =>
          i !== 2 ? mem : { ...mem, role: WorkspaceRoles.admin },
        ),
      });

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

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { members } = await queryMockWorkspaceMembers({
      queryClient,
      id: WORKSPACE_ID,
    });

    const { result } = renderHook(() => usePromoteMember({ onError }), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({
        param: { id: WORKSPACE_ID, "user-id": members[2]!.id },
      });
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledOnce();

      // Query cache should be set when mutation is called.
      expect(setQueryDataSpy).toHaveBeenCalledOnce();
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        workspacesKeys.members(WORKSPACE_ID),
        {
          members: members.map((mem, i) =>
            i !== 2 ? mem : { ...mem, role: WorkspaceRoles.admin },
          ),
        },
      );

      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(toastErrorSpy).toHaveBeenCalled();

      // Invalidate queries should be called when there is an error
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: workspacesKeys.members(WORKSPACE_ID),
      });

      // Data for workspace members should have the value as before the mutation call
      expect(
        qcResult.current.getQueryData(workspacesKeys.members(WORKSPACE_ID)),
      ).toStrictEqual({
        members,
      });
    });
  });
});
