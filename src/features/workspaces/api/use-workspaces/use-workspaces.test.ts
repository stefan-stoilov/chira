import { renderHook, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { useWorkspaces } from "./use-workspaces";
import { workspacesKeys } from "../query-key-factory";
import { data, handlers } from "./mocks";

describe("useWorkspaces hook test", () => {
  it("Should throw when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useWorkspaces(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Should NOT throw when server responds with an error.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { result } = renderHook(() => useWorkspaces(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toStrictEqual(data.success);

      // Check that the correct query key is associated with the data
      expect(
        qcResult.current.getQueryData(workspacesKeys.lists()),
      ).toStrictEqual(data.success);
    });
  });
});
