"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export function WorkspaceSwitcher() {
  const workspaceId = useWorkspaceId();
  const { data: workspaces, isFetching } = useWorkspaces();
  const router = useRouter();

  const onSelect = (id: string) => {
    router.push(`/dashboard/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-background p-1 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>

        <SelectContent className="w-[--radix-popper-anchor-width]">
          {!workspaces && isFetching && (
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

          {!isFetching && workspaces?.total === 0 && (
            <div className="my-2 flex flex-col gap-2">
              <span className="block w-full text-center text-sm font-medium">
                No workspaces found.
              </span>
              <Button asChild variant={"muted"}>
                <Link href="/dashboard/workspaces/create">
                  Create workspace
                </Link>
              </Button>
            </div>
          )}

          {workspaces?.documents.map(({ $id, name, imageUrl }) => (
            <SelectItem
              key={$id}
              value={$id}
              className="max-w-[--radix-popper-anchor-width] truncate"
            >
              <div className="flex max-w-full items-center justify-start gap-3 overflow-hidden font-medium">
                <div className="block min-w-fit shrink-0">
                  <WorkspaceAvatar name={name} image={imageUrl} />
                </div>

                <span className="block max-w-[8rem] truncate">{name}</span>
              </div>
            </SelectItem>
          ))}

          {workspaces && isFetching && (
            <div
              className="flex h-8 w-full items-center justify-center"
              data-testid="workspaces-loader"
            >
              <Loader />
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
