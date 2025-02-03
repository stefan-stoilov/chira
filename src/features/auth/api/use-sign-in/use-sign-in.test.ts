import { http, HttpResponse } from "msw";
import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { env } from "@/env";
import { useSignIn } from "./use-sign-in";

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/auth/sign-in`;

const refresh = vi.fn();

vi.mock("next/navigation", () => {
  return {
    useRouter: () => {
      return {
        refresh,
      };
    },
  };
});

vi.mock("@/lib/rpc", () => {
  const rpc = {
    api: {
      auth: {
        "sign-in": {
          $post: async () => {
            return await fetch(API_ENDPOINT, { method: "POST" });
          },
        },
      },
    },
  };

  return { rpc };
});

describe("useSignIn hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(
      http.post(API_ENDPOINT, async () => {
        return HttpResponse.json({ error: "Error" }, { status: 401 });
      }),
    );

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
    server.use(
      http.post(API_ENDPOINT, async () => {
        return HttpResponse.json({ success: true }, { status: 200 });
      }),
    );

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
      expect(result.current.data).toEqual({ success: true });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["currentUser"],
      });
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });
});
