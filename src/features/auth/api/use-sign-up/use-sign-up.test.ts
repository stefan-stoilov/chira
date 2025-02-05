import { http, HttpResponse } from "msw";
import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { env } from "@/env";
import { useSignUp } from "./use-sign-up";

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/auth/sign-up`;

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

vi.mock("@/lib/rpc", () => {
  const rpc = {
    api: {
      auth: {
        "sign-up": {
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
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ error: "Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useSignUp(), { wrapper: QueryWrapper });

    await act(async () => {
      result.current.mutate({
        json: { email: "test@test.com", password: "Test1234", name: "Test" },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Should NOT fail when server responds with success and the mutation should invalidate queries.", async () => {
    server.use(
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ success: true }, { status: 200 });
      }),
    );

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
      expect(result.current.data).toEqual({ success: true });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["currentUser"],
      });
      expect(push).toHaveBeenCalledTimes(1);
    });
  });
});
