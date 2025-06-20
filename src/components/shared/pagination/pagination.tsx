import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import type { UsePaginationSearchParamsReturnT } from "@/hooks/use-pagination-search-params";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type PaginationProps = {
  totalPages: number;
  currentPage: number;
  className?: string;
  canGetPrevPage: boolean;
  canGetNextPage: boolean;
} & Omit<UsePaginationSearchParamsReturnT, "page">;

export function Pagination({
  totalPages,
  currentPage,
  first,
  prev,
  next,
  last,
  setPage,
  className,
  canGetPrevPage,
  canGetNextPage,
}: PaginationProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 px-4 pb-6",
        className,
      )}
    >
      <Button
        variant="outline"
        className="h-8 w-8 p-0 lg:flex"
        onClick={() => first()}
        disabled={canGetPrevPage}
      >
        <span className="sr-only">Go to first page</span>
        <ChevronsLeft />
      </Button>

      <Button
        variant="outline"
        className="size-8"
        size="icon"
        onClick={() => prev(totalPages)}
        disabled={canGetPrevPage}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeft />
      </Button>

      {totalPages > 1 ? (
        <Select
          value={currentPage.toString()}
          onValueChange={(value) => setPage(Number(value))}
        >
          <SelectTrigger className="h-8 w-16" aria-label="select-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }).map((_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Button size="icon" variant="outline">
          1
        </Button>
      )}

      <Button
        variant="outline"
        className="size-8"
        size="icon"
        onClick={() => next(totalPages)}
        disabled={canGetNextPage}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        className="size-8 lg:flex"
        size="icon"
        onClick={() => last(totalPages)}
        disabled={canGetNextPage}
      >
        <span className="sr-only">Go to last page</span>
        <ChevronsRight />
      </Button>
    </div>
  );
}
