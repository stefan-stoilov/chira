"use client";
import { PlusCircle } from "lucide-react";
import { useWorkspaces } from "@/features/workspaces/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceAvatar } from "..";
import { Loader } from "@/components/shared";

export function WorkspaceSwitcher() {
  const { data: workspaces, isFetching } = useWorkspaces();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground">Workspaces</p>
        <PlusCircle className="size-5 cursor-pointer text-muted-foreground transition hover:opacity-75" />
      </div>

      <Select>
        <SelectTrigger className="w-full bg-background p-1 font-medium">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>

        <SelectContent>
          {!workspaces && isFetching && (
            <>
              <Skeleton className="my-2 h-5 w-full rounded-md" />
              <Skeleton className="my-2 h-5 w-full rounded-md" />
              <Skeleton className="my-2 h-5 w-full rounded-md" />
            </>
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
            <div className="flex h-8 w-full items-center justify-center">
              <Loader />
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
