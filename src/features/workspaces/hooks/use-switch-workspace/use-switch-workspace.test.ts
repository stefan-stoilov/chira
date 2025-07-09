import { renderHook, act } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { useSwitchWorkspace } from "./use-switch-workspace";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

const mockedUseRouter = vi.mocked(useRouter);
const mockedUsePathname = vi.mocked(usePathname);

describe("useSwitchWorkspace", () => {
  const push = vi.fn();
  const mockRouterFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push,
      back: mockRouterFn,
      forward: mockRouterFn,
      refresh: mockRouterFn,
      replace: mockRouterFn,
      prefetch: mockRouterFn,
    });
  });

  describe("workspaceId extraction", () => {
    it("should correctly extract workspaceId from a base workspace path", () => {
      const id = crypto.randomUUID();
      mockedUsePathname.mockReturnValue(`/dashboard/workspaces/${id}`);

      const { result } = renderHook(() => useSwitchWorkspace());
      expect(result.current.workspaceId).toBe(id);
    });

    it("should correctly extract workspaceId from a nested workspace path", () => {
      const id = crypto.randomUUID();
      mockedUsePathname.mockReturnValue(`/dashboard/workspaces/${id}/settings`);

      const { result } = renderHook(() => useSwitchWorkspace());
      expect(result.current.workspaceId).toBe(id);
    });

    it("should return undefined for workspaceId if not on a workspace path", () => {
      mockedUsePathname.mockReturnValue("/dashboard/test");

      const { result } = renderHook(() => useSwitchWorkspace());
      expect(result.current.workspaceId).toBeUndefined();
    });
  });

  describe("switchWorkspace function", () => {
    it("should switch to the new workspace root from a base path", () => {
      mockedUsePathname.mockReturnValue(
        `/dashboard/workspaces/${crypto.randomUUID()}`,
      );
      const { result } = renderHook(() => useSwitchWorkspace());

      const id = crypto.randomUUID();
      act(() => {
        result.current.switchWorkspace(id);
      });
      expect(push).toHaveBeenCalledWith(`/dashboard/workspaces/${id}`);
    });

    it('should not preserve the "settings" sub-path when switching', () => {
      mockedUsePathname.mockReturnValue(
        `/dashboard/workspaces/${crypto.randomUUID()}/settings`,
      );
      const { result } = renderHook(() => useSwitchWorkspace());

      const id = crypto.randomUUID();
      act(() => {
        result.current.switchWorkspace(id);
      });

      expect(push).toHaveBeenCalledWith(`/dashboard/workspaces/${id}`);
    });

    it('should preserve the "invites" sub-path when switching', () => {
      mockedUsePathname.mockReturnValue(
        `/dashboard/workspaces/${crypto.randomUUID()}/invites`,
      );
      const { result } = renderHook(() => useSwitchWorkspace());

      const id = crypto.randomUUID();
      act(() => {
        result.current.switchWorkspace(id);
      });

      expect(push).toHaveBeenCalledWith(`/dashboard/workspaces/${id}/invites`);
    });

    it('should preserve the "members" sub-path when switching', () => {
      mockedUsePathname.mockReturnValue(
        `/dashboard/workspaces/${crypto.randomUUID()}/members`,
      );
      const { result } = renderHook(() => useSwitchWorkspace());

      const id = crypto.randomUUID();
      act(() => {
        result.current.switchWorkspace(id);
      });

      expect(push).toHaveBeenCalledWith(`/dashboard/workspaces/${id}/members`);
    });
  });
});
