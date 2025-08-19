import { renderHook, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";

import { useWorkspaceInvites } from "./use-workspace-invites";
import { workspacesKeys } from "@/features/workspaces/api/query-key-factory";
import { data, handlers } from "./mocks";

const MOCK_ID = crypto.randomUUID();

describe("useWorkspaceInvites hook test", () => {
  it("Should throw when server responds with an error.", async () => {
    server.use(handlers.error());

    const { result } = renderHook(
      () => useWorkspaceInvites({ id: MOCK_ID, page: 1 }),
      {
        wrapper: QueryWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(true);
    });
  });

  it("Should NOT throw when server responds with an success.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { result } = renderHook(
      () => useWorkspaceInvites({ id: MOCK_ID, page: 1 }),
      {
        wrapper: (props) => QueryWrapper({ ...props, queryClient }),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);

      const mappedData = {
        ...data.success(1),
        invites: data.success(1).invites.map((inv) => ({
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

      // Check that the correct query key is associated with the data
      expect(
        qcResult.current.getQueryData(
          workspacesKeys.invites({ id: MOCK_ID, page: 1 }),
        ),
      ).toStrictEqual(data.success(1));
    });
  });
});
