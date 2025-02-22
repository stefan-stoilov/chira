import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { useSignIn } from "./use-sign-in";
import { userKeys } from "../query-keys";
import { handlers, data } from "./mocks";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe("useSignIn hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useSignIn(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        json: { email: "test@test.com", password: "test" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
    expect(refresh).toHaveBeenCalledTimes(0);
  });

  it("Should NOT fail when server responds with success and the mutation should invalidate queries.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSignIn(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({
        json: { email: "test@test.com", password: "test" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(data.success);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: userKeys.all,
      });
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });
});
