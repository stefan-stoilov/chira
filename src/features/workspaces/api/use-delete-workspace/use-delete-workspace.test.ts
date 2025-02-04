import { http, HttpResponse } from "msw";
import { renderHook, act, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper, createTestQueryClient } from "@/tests/utils";
import { env } from "@/env";
import { useDeleteWorkspace } from "./use-delete-workspace";

const TEST_WORKSPACE_ID = vi.hoisted(() => "test-id");

const MSW_API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces/:id`;
const API_ENDPOINT = `${env.NEXT_PUBLIC_MOCK_API_ENDPOINT}/workspaces/${TEST_WORKSPACE_ID}`;

const push = vi.fn();

vi.mock("@/lib/rpc", () => {
  const rpc = {
    api: {
      workspaces: {
        [":id"]: {
          $delete: async () => {
            return await fetch(API_ENDPOINT, {
              method: "DELETE",
            });
          },
        },
      },
    },
  };

  return { rpc };
});

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("useDeleteWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(
      http.delete(MSW_API_ENDPOINT, () => {
        return HttpResponse.json({ error: "Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useDeleteWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({ param: { id: TEST_WORKSPACE_ID } });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  it("Should NOT fail when server responds with success and the mutation should invalidate queries.", async () => {
    server.use(
      http.delete(MSW_API_ENDPOINT, async () => {
        return HttpResponse.json({ $id: TEST_WORKSPACE_ID }, { status: 200 });
      }),
    );

    const queryClient = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteWorkspace(), {
      wrapper: (props) => QueryWrapper({ ...props, queryClient }),
    });

    await act(async () => {
      result.current.mutate({ param: { id: TEST_WORKSPACE_ID } });
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

      expect(push).toHaveBeenCalledOnce();
    });
  });
});
