"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { useWorkspaces } from "@/features/workspaces/api/use-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

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
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">Workspaces</p>

        <Suspense
          fallback={
            <PlusCircle className="size-5 cursor-pointer text-muted-foreground transition hover:opacity-75" />
          }
        >
          <CreateWorkspaceButton />
        </Suspense>
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full bg-background p-1 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>

        <SelectContent>
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
            <SelectItem key={$id} value={$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar name={name} image={imageUrl} />

                <span className="truncate">{name}</span>
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

/**
 * Component that opens up a modal to create a new workspace.
 *
 * @warning This component must be wrapped with Suspense to avoid Next.js errors because of the `nuqs` package.
 *
 * @example
 * ```tsx
 * <Suspense
 *   fallback={<PlusCircle className="size-5 cursor-pointer text-muted-foreground transition hover:opacity-75" />}
 * >
 *    <CreateWorkspaceButton />
 * </Suspense>
 * ```
 */
function CreateWorkspaceButton() {
  const { open } = useCreateWorkspaceModal();

  return (
    <Button variant={"ghost"} className="px-3" onClick={() => open()}>
      <PlusCircle className="size-5 cursor-pointer text-muted-foreground transition hover:opacity-75" />
    </Button>
  );
}
