"use client";
import { useRouter } from "next/navigation";

import { useWorkspaces } from "@/features/workspaces/api/use-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceAvatar } from "../workspace-avatar";
import { Loader } from "@/components/shared/loader";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const workspaceId = useWorkspaceId();
  const { data, isFetching, isError, isLoading } = useWorkspaces();
  const router = useRouter();

  const onSelect = (id: string) => {
    router.push(`/dashboard/workspaces/${id}`);
  };

  return (
    <div className={"mt-1.5 flex flex-col gap-y-2"}>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger
          aria-label="select workspace"
          className={cn(
            "w-full bg-background p-1 font-medium",
            !workspaceId && "pl-2",
            isLoading && "p-1.5",
            isError && "border-destructive-foreground bg-destructive-subtle",
          )}
          noChevron={isError || isLoading}
        >
          {!isError ? (
            isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <SelectValue placeholder="No workspace selected" />
            )
          ) : (
            "Failed to load workspaces"
          )}
        </SelectTrigger>

        {!isError && (
          <SelectContent className="w-[--radix-popper-anchor-width]">
            {!data && isFetching && (
              <>
                <Skeleton
                  className="my-2 h-5 w-full rounded-md"
                  data-testid="workspaces-skeleton"
                />
                <Skeleton
                  className="my-2 h-5 w-full rounded-md"
                  data-testid="workspaces-skeleton"
                />
                <Skeleton
                  className="my-2 h-5 w-full rounded-md"
                  data-testid="workspaces-skeleton"
                />
              </>
            )}

            {!isFetching && data?.workspaces?.length === 0 && (
              <div className="my-2 flex flex-col gap-2">
                <span className="block w-full text-center text-sm font-medium">
                  No workspaces found.
                </span>
                <Button asChild variant={"secondary"}>
                  <SelectItem value={"create"}>Create workspace</SelectItem>
                </Button>
              </div>
            )}

            {data?.workspaces.map(({ id, name }) => (
              <SelectItem
                key={id}
                value={id}
                className="max-w-[--radix-popper-anchor-width] truncate"
              >
                <div className="flex max-w-full items-center justify-start gap-3 overflow-hidden font-medium">
                  <div className="block min-w-fit shrink-0">
                    <WorkspaceAvatar name={name} />
                  </div>

                  <span className="block max-w-[8rem] truncate">{name}</span>
                </div>
              </SelectItem>
            ))}

            {data?.workspaces && isFetching && (
              <div
                className="flex h-8 w-full items-center justify-center"
                data-testid="workspaces-loader"
              >
                <Loader />
              </div>
            )}
          </SelectContent>
        )}
      </Select>
    </div>
  );
}
