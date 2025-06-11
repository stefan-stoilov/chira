import { renderHook } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import {
  useJoinSearchParams,
  INVITE_LINK_SEARCH_PARAMS,
  INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES,
} from "./use-join-search-params";
import {
  INVALID_INVITE_LINK_SEARCH_PARAMS,
  VALID_INVITE_LINK_SEARCH_PARAMS,
} from "./mocks";

describe("useJoinSearchParams hook test", () => {
  it("Should result in error with 2 error messages whenever no search params are present.", () => {
    const { result } = renderHook(() => useJoinSearchParams(), {
      wrapper: withNuqsTestingAdapter({ searchParams: {} }),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.errors).toEqual(
      [
        INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.code.notProvided,
        INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.id.notProvided,
      ].sort(),
    );
  });

  it("Should result in error with 2 error messages whenever the search params do not match schema.", () => {
    const { result } = renderHook(() => useJoinSearchParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: INVALID_INVITE_LINK_SEARCH_PARAMS,
      }),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.errors).toEqual(
      [
        INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.code.invalid,
        INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.id.invalid,
      ].sort(),
    );
  });

  it("Should result in error with 1 error message whenever the 'id' search param does not match schema.", () => {
    const { result } = renderHook(() => useJoinSearchParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          [INVITE_LINK_SEARCH_PARAMS.code]:
            VALID_INVITE_LINK_SEARCH_PARAMS.code,
          [INVITE_LINK_SEARCH_PARAMS.id]: INVALID_INVITE_LINK_SEARCH_PARAMS.id,
        },
      }),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.errors).toEqual([
      INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.id.invalid,
    ]);
  });

  it("Should result in error with 1 error message whenever the 'code' search param does not match schema.", () => {
    const { result } = renderHook(() => useJoinSearchParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          [INVITE_LINK_SEARCH_PARAMS.code]:
            INVALID_INVITE_LINK_SEARCH_PARAMS.code,
          [INVITE_LINK_SEARCH_PARAMS.id]: VALID_INVITE_LINK_SEARCH_PARAMS.id,
        },
      }),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.errors).toEqual([
      INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.code.invalid,
    ]);
  });

  it("Should result in no errors when both search params match schema,", () => {
    const { result } = renderHook(() => useJoinSearchParams(), {
      wrapper: withNuqsTestingAdapter({
        searchParams: VALID_INVITE_LINK_SEARCH_PARAMS,
      }),
    });

    expect(result.current.data).toEqual(VALID_INVITE_LINK_SEARCH_PARAMS);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.errors).toBeUndefined();
  });
});
