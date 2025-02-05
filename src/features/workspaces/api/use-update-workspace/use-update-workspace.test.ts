import { http, HttpResponse } from "msw";
import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { env } from "@/env";
import { useUpdateWorkspace } from "./use-update-workspace";

const TEST_WORKSPACE_ID = vi.hoisted(() => "test-id");

const MSW_API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces/:id`;
const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces/${TEST_WORKSPACE_ID}`;

const payload = {
  form: { name: "Test" },
  param: { id: TEST_WORKSPACE_ID },
};

vi.mock("@/lib/rpc", () => {
  const rpc = {
    api: {
      workspaces: {
        [":id"]: {
          $patch: async (args: typeof payload) => {
            return await fetch(API_ENDPOINT, {
              method: "PATCH",
              body: JSON.stringify(args),
            });
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
      http.patch(MSW_API_ENDPOINT, () => {
        return HttpResponse.json({ error: "Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useUpdateWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  it("Should NOT fail when server responds with success and the mutation should invalidate queries.", async () => {
    server.use(
      http.patch(MSW_API_ENDPOINT, async () => {
        return HttpResponse.json({ $id: TEST_WORKSPACE_ID }, { status: 200 });
      }),
    );

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateWorkspace(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({ $id: TEST_WORKSPACE_ID });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["workspaces"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["workspace", TEST_WORKSPACE_ID],
        exact: true,
      });
    });
  });
});
