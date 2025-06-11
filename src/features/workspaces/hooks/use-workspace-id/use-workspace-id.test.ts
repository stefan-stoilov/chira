import { renderHook } from "@testing-library/react";
import { useParams } from "next/navigation";
import { useWorkspaceId } from "./use-workspace-id";

vi.mock("next/navigation");

describe("useWorkspaceId hook test", () => {
  it("Should return workspaceId if it is present as a parameter within pathname.", () => {
    const workspaceId = crypto.randomUUID();

    vi.mocked(useParams).mockReturnValue({ workspaceId });

    const { result } = renderHook(() => useWorkspaceId());

    expect(result.current).toBe(workspaceId);
  });

  it("Should return undefined if workspaceId is not present as a parameter within pathname.", () => {
    vi.mocked(useParams).mockReturnValue({});

    const { result } = renderHook(() => useWorkspaceId());

    expect(result.current).toBeUndefined();
  });
});
