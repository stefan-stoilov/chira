import { renderHook, waitFor } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { server } from "@/tests/mocks/server";
import { createTestQueryClient, QueryWrapper } from "@/tests/utils";
import { useCurrentUser } from "./use-current-user";
import { userKeys } from "../query-keys";
import { handlers, data } from "./mocks";

describe("useCurrentUser hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.data).toBe(null));
  });

  it("Should NOT fail when server responds with success", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    const { result: qcResult } = renderHook(() => useQueryClient(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toEqual(data.success);

      // Check that the correct query key is associated with the data
      expect(qcResult.current.getQueryData(userKeys.all)).toEqual(data.success);
    });
  });
});
