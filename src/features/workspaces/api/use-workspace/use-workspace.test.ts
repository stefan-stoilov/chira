import { renderHook, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { server } from "@/tests/mocks/server";
import { createTestQueryClient, QueryWrapper } from "@/tests/utils";
import { useWorkspace } from "./use-workspace";
import { workspacesKeys } from "../query-key-factory";
import { data, handlers } from "./mocks";

describe("useWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useWorkspace(data.MOCK_WORKSPACE_ID), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Should NOT fail when server responds with success.", async () => {
    server.use(handlers.successUser);

    const queryClient = createTestQueryClient();

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { result } = renderHook(() => useWorkspace(data.MOCK_WORKSPACE_ID), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toStrictEqual(data.successUser);

      // Check that the correct query key is associated with the data
      expect(
        qcResult.current.getQueryData(
          workspacesKeys.detail(data.MOCK_WORKSPACE_ID),
        ),
      ).toStrictEqual(data.successUser);
    });
  });
});
