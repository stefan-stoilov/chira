import { renderHook, act } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import {
  usePaginationSearchParams,
  PAGE_SEARCH_PARAM,
} from "./use-pagination-search-params";

describe("usePaginationSearchParams", () => {
  it("should default to page 1 when no search param is present", () => {
    const { result } = renderHook(() => usePaginationSearchParams(), {
      wrapper: withNuqsTestingAdapter({ searchParams: {} }),
    });
    expect(result.current.page).toBe(1);
  });

  it("should read the initial page from the search params", () => {
    const { result } = renderHook(() => usePaginationSearchParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: { [PAGE_SEARCH_PARAM]: "5" },
      }),
    });
    expect(result.current.page).toBe(5);
  });

  it("should default to 1 if page param is invalid (e.g., 0 or negative)", () => {
    const { result } = renderHook(() => usePaginationSearchParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: { [PAGE_SEARCH_PARAM]: "0" },
      }),
    });
    expect(result.current.page).toBe(1);
  });

  it("should update the page using setPage", async () => {
    const { result } = renderHook(() => usePaginationSearchParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: { [PAGE_SEARCH_PARAM]: "1" },
      }),
    });
    await act(() => result.current.setPage(10));
    expect(result.current.page).toBe(10);
  });

  describe("next()", () => {
    it("should increment the page", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "2" },
        }),
      });
      act(() => result.current.next());
      expect(result.current.page).toBe(3);
    });

    it("should not increment beyond totalPages", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "10" },
        }),
      });
      act(() => result.current.next(10));
      expect(result.current.page).toBe(10);
    });
  });

  describe("prev()", () => {
    it("should decrement the page", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "5" },
        }),
      });
      act(() => result.current.prev());
      expect(result.current.page).toBe(4);
    });

    it("should not decrement below 1", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "1" },
        }),
      });
      act(() => result.current.prev());
      expect(result.current.page).toBe(1);
    });

    it("should go to the second last page if the current page is out of bounds", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "15" },
        }),
      });
      act(() => result.current.prev(10));
      expect(result.current.page).toBe(9);
    });
  });

  describe("first()", () => {
    it("should set the page to 1", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "10" },
        }),
      });
      act(() => result.current.first());
      expect(result.current.page).toBe(1);
    });
  });

  describe("last()", () => {
    it("should set the page to totalPages", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "1" },
        }),
      });
      act(() => result.current.last(25));
      expect(result.current.page).toBe(25);
    });

    it("should do nothing if totalPages is not provided", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "1" },
        }),
      });
      act(() => result.current.last());
      expect(result.current.page).toBe(1);
    });

    it("should do nothing if totalPages is less than 1", async () => {
      const { result } = renderHook(() => usePaginationSearchParams(), {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [PAGE_SEARCH_PARAM]: "5" },
        }),
      });
      act(() => result.current.last(0));
      expect(result.current.page).toBe(5);
    });
  });

  it("should work with a custom page search parameter", () => {
    const customParam = "p";
    const { result } = renderHook(
      () => usePaginationSearchParams(customParam),
      {
        wrapper: withNuqsTestingAdapter({
          searchParams: { [customParam]: "7" },
        }),
      },
    );
    expect(result.current.page).toBe(7);
  });
});
