import { http, HttpResponse } from "msw";
import { renderHook, waitFor } from "@testing-library/react";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { env } from "@/env";
import { useWorkspaces } from "./use-workspaces";

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces`;

vi.mock("@/lib/rpc", () => {
  const rpc = {
    api: {
      workspaces: {
        $post: async () => {
          return await fetch(API_ENDPOINT, { method: "GET" });
        },
      },
    },
  };

  return { rpc };
});

describe("useWorkspaces hook test", () => {
  it("Should throw when server responds with an error.", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return HttpResponse.json({ error: "Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useWorkspaces(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("Should NOT throw when server responds with an error.", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return HttpResponse.json({}, { status: 200 });
      }),
    );

    const { result } = renderHook(() => useWorkspaces(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(false));
  });
});
