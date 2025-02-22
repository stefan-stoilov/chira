import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { handlers, data } from "./mocks";
import { useSignOut } from "./use-sign-out";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("useSignOut hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useSignOut(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(push).toHaveBeenCalledTimes(0);
    });
  });

  it("Should NOT fail when server responds with success and the mutation should invalidate queries.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSignOut(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(data.success);
      expect(invalidateQueriesSpy).toHaveBeenCalled();
      expect(push).toHaveBeenCalledTimes(1);
    });
  });
});
