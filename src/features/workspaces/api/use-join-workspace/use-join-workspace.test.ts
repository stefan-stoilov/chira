import { renderHook, act, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { handlers } from "./mocks";
import { MOCK_WORKSPACE_ID } from "../use-workspace/mocks/data";
import { useJoinWorkspace } from "./use-join-workspace";

describe("useJoinWorkspace hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.errorNotFound);

    const toastErrorSpy = vi.spyOn(toast, "error");

    const { result } = renderHook(() => useJoinWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        param: { id: MOCK_WORKSPACE_ID },
        json: { inviteCode: "TEST01" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });

  it("Should NOT fail when server responds with success.", async () => {
    server.use(handlers.success);

    const toastSuccessSpy = vi.spyOn(toast, "success");

    const { result } = renderHook(() => useJoinWorkspace(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        param: { id: MOCK_WORKSPACE_ID },
        json: { inviteCode: "TEST01" },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.name).toBeTypeOf("string");
      expect(toastSuccessSpy).toHaveBeenCalled();
    });
  });
});
