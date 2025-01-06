import { http, HttpResponse } from "msw";
import { renderHook, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { env } from "@/env";
import { useCurrentUser } from "./use-current-user";

const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/auth/current`;

vi.mock("@/lib/rpc", async () => {
  const rpc = {
    api: {
      auth: {
        current: {
          $get: async () => {
            return await fetch(API_ENDPOINT, {
              method: "GET",
            });
          },
        },
      },
    },
  };

  return { rpc };
});

describe("useCurrentUser hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(
      http.get(API_ENDPOINT, async () => {
        return HttpResponse.json(
          { error: "Unexpected error occurred" },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.data).toBeFalsy());
  });

  it("Should NOT fail when server responds with success", async () => {
    server.use(
      http.get(API_ENDPOINT, async () => {
        return HttpResponse.json({ success: true }, { status: 200 });
      }),
    );

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.isError).toBe(false));
    await waitFor(() => expect(result.current.data).toBeTruthy());
  });
});
