import { http, HttpResponse } from "msw";
import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { env } from "@/env";
import { useUpdateWorkspace } from "./use-update-workspace";

const TEST_WORKSPACE_ID = vi.hoisted(() => "test-id");

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces/${TEST_WORKSPACE_ID}`;

vi.mock("@/lib/rpc", () => {
  const rpc = {
    api: {
      workspaces: {
        [TEST_WORKSPACE_ID]: {
          $patch: async () => {
            return await fetch(API_ENDPOINT, { method: "PATCH" });
          },
        },
      },
    },
  };

  return { rpc };
});

describe("useUpdateWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ error: "Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useUpdateWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        form: { name: "Test" },
        param: { id: TEST_WORKSPACE_ID },
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

    const { result } = renderHook(() => useUpdateWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        form: { name: "Test" },
        param: { id: TEST_WORKSPACE_ID },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(false));
  });
});
