import { http, HttpResponse } from "msw";
import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { env } from "@/env";
import { useCreateWorkspace } from "./use-create-workspace";

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces`;

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
        $post: async () => {
          return await fetch(API_ENDPOINT, { method: "POST" });
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

  it("Should NOT fail when server responds with success.", async () => {
    server.use(
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ success: true }, { status: 200 });
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

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(push).toHaveBeenCalledTimes(1);
  });
});
