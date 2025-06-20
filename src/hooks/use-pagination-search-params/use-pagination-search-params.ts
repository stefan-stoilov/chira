import { useCallback, useMemo } from "react";
import { useQueryState, parseAsInteger, type Options } from "nuqs";
import { z } from "zod";

export const PAGE_SEARCH_PARAM = "page";

export type UsePaginationSearchParamsReturnT = {
  page: number;
  setPage: (
    value: number | ((old: number) => number | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;
  next: (totalPages?: number) => void;
  prev: (totalPages?: number) => void;
  last: (totalPages?: number) => void;
  first: () => void;
};

function parsePageParam(param: unknown) {
  const { data, success } = z.number().min(1).safeParse(param);

  return success ? data : 1;
}

export function usePaginationSearchParams(
  pageSearchParam: string = PAGE_SEARCH_PARAM,
): UsePaginationSearchParamsReturnT {
  const [unparsedPage, setPage] = useQueryState(
    pageSearchParam,
    parseAsInteger.withDefault(1),
  );

  const page = useMemo(() => parsePageParam(unparsedPage), [unparsedPage]);

  const next = useCallback(
    (totalPages?: number) => {
      if (typeof totalPages === "number") {
        setPage((prev) => (totalPages > prev ? prev + 1 : prev));
      } else {
        setPage((prev) => prev + 1);
      }
    },
    [setPage],
  );

  const prev = useCallback(
    (totalPages?: number) => {
      if (typeof totalPages === "number") {
        setPage((prev) => {
          if (totalPages < prev - 1) return totalPages - 1;

          return prev > 1 ? prev - 1 : prev;
        });
      } else {
        setPage((prev) => prev - 1);
      }
    },
    [setPage],
  );

  const first = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const last = useCallback(
    (totalPages?: number) => {
      if (typeof totalPages === "number" && totalPages > 0) {
        setPage(totalPages);
      }
    },
    [setPage],
  );

  return {
    page,
    setPage,
    next,
    prev,
    last,
    first,
  };
}
