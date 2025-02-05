import { renderHook, waitFor } from "@testing-library/react";
import { server } from "@/tests/mocks/server";
import { QueryWrapper } from "@/tests/utils";
import { useCurrentUser } from "./use-current-user";
import { handlers } from "./mocks";

describe("useCurrentUser hook test", () => {
  it("Should fail when server responds with an error.", async () => {
    server.use(handlers.error);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.data).toBe(null));
  });

  it("Should NOT fail when server responds with success", async () => {
    server.use(handlers.get);

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeTruthy();
    });
  });
});
