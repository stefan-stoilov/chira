import { renderHook, act, waitFor } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import {
  useCreateWorkspaceModal,
  CREATE_WORKSPACE_SEARCH_PARAM,
} from "./use-create-workspace-modal";

describe("useCreateWorkspaceModal hook test", () => {
  it("Should be closed when there are no search params and should open once the open function has been called.", async () => {
    const { result } = renderHook(() => useCreateWorkspaceModal(), {
      wrapper: withNuqsTestingAdapter({ searchParams: {} }),
    });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.open();
    });

    waitFor(() => expect(result.current.isOpen).toBe(true));
  });

  it("Should be open when the search params are correct and should close once the close function has been called.", async () => {
    const { result } = renderHook(() => useCreateWorkspaceModal(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          [CREATE_WORKSPACE_SEARCH_PARAM]: "true",
        },
      }),
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    waitFor(() => expect(result.current.isOpen).toBe(false));
  });
});
