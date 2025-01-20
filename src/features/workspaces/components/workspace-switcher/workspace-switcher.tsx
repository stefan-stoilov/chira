"use client";
import { useWorkspaces } from "@/features/workspaces/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

export function WorkspaceSwitcher() {
  const { data: workspaces } = useWorkspaces();

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
          {workspaces?.documents.map(({ $id, name }) => (
            <SelectItem key={$id} value={$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                {/* <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl} /> */}

                <span className="truncate">{name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
