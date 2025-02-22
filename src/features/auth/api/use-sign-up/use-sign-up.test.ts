import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { data, handlers } from "./mocks";
import { useSignUp } from "./use-sign-up";
import { userKeys } from "../query-keys";

const push = vi.fn();

vi.mock("next/navigation", async () => {
  return {
    useRouter: () => {
      return {
        push,
      };
    },
  };
});

describe("useSignIn hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useSignUp(), { wrapper: QueryWrapper });

    await act(async () => {
      result.current.mutate({
        json: { email: "test@test.com", password: "Test1234", name: "Test" },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Should NOT fail when server responds with success and the mutation should invalidate queries.", async () => {
    server.use(handlers.success);

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSignUp(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({
        json: { email: "test@test.com", password: "Test1234", name: "Test" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(data.success);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: userKeys.all,
      });
      expect(push).toHaveBeenCalledTimes(1);
    });
  });
});
