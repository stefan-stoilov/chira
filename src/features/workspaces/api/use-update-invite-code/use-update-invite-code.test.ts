import { renderHook, act, waitFor } from "@testing-library/react";
import { toast } from "sonner";

import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { handlers } from "./mocks";
import { MOCK_WORKSPACE_ID } from "../use-workspace/mocks/data";
import { useUpdateInviteCode } from "./use-update-invite-code";

describe("useUpdateInviteCode hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const toastErrorSpy = vi.spyOn(toast, "error");

    const { result } = renderHook(() => useUpdateInviteCode(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        param: { id: MOCK_WORKSPACE_ID },
        json: {},
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });

  it("Should return only workspace ID whenever remove is included in request body and is true.", async () => {
    server.use(handlers.success);
    const toastSuccessSpy = vi.spyOn(toast, "success");
    const { result } = renderHook(() => useUpdateInviteCode(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        param: { id: MOCK_WORKSPACE_ID },
        json: { remove: true },
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual({ id: MOCK_WORKSPACE_ID });
      expect(toastSuccessSpy).toHaveBeenCalled();
    });
  });

  it("Should return workspace ID and new invite code whenever remove is not included in request body.", async () => {
    server.use(handlers.success);
    const toastSuccessSpy = vi.spyOn(toast, "success");
    const { result } = renderHook(() => useUpdateInviteCode(), {
      wrapper: QueryWrapper,
    });

    await act(async () => {
      result.current.mutate({
        param: { id: MOCK_WORKSPACE_ID },
        json: {},
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.id).toEqual(MOCK_WORKSPACE_ID);
      expect(result.current.data?.inviteCode).toHaveLength(6);
      expect(toastSuccessSpy).toHaveBeenCalled();
    });
  });
});
