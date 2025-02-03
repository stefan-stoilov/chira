import { http, HttpResponse } from "msw";
import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { env } from "@/env";
import { useCreateWorkspace } from "./use-create-workspace";

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces/create`;

const push = vi.fn();

vi.mock("next/navigation", () => {
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
      workspaces: {
        $post: async (payload: {
          form: {
            name: string;
            image?: string | Blob | undefined;
            fileName?: string | undefined;
          };
        }) => {
          return await fetch(API_ENDPOINT, {
            method: "POST",
            body: JSON.stringify(payload),
          });
        },
      },
    },
  };

  return { rpc };
});

describe("useCreateWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ error: "Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useCreateWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        form: { name: "Test" },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Should NOT fail when server responds with success and the mutation should invalidate queries.", async () => {
    server.use(
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ $id: "test-id" }, { status: 200 });
      }),
    );

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateWorkspace(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({
        form: { name: "Test" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({ $id: "test-id" });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["workspaces"],
      });
    });
    expect(push).toHaveBeenCalledTimes(1);
  });
});
