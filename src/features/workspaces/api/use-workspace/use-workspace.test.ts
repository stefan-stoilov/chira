import { http, HttpResponse } from "msw";
import { renderHook, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { env } from "@/env";
import { useWorkspace } from "./use-workspace";

const TEST_WORKSPACE_ID = vi.hoisted(() => "test-id");

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces/${TEST_WORKSPACE_ID}`;

vi.mock("@/lib/rpc", () => {
  const rpc = {
    api: {
      workspaces: {
        [TEST_WORKSPACE_ID]: {
          $get: async () => {
            return await fetch(API_ENDPOINT);
          },
        },
      },
    },
  };

  return { rpc };
});

describe("useWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ error: "Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useWorkspace(TEST_WORKSPACE_ID), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Should NOT fail when server responds with success.", async () => {
    server.use(
      http.post(API_ENDPOINT, () => {
        return HttpResponse.json({ success: true }, { status: 200 });
      }),
    );

    const { result } = renderHook(() => useWorkspace(TEST_WORKSPACE_ID), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(false));
  });
});
