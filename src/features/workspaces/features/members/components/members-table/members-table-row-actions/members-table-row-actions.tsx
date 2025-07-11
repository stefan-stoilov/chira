import { MoreHorizontal, Trash2, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceRoles } from "@/server/db/schemas";

type MembersTableRowActionsProps = {
  userId: string;
  workspaceId: string;
  name: string;
  memberRole: WorkspaceRoles;
  currentUserRole: WorkspaceRoles;
  currentUserId: string;
};

export function MembersTableRowActions({
  userId,
  workspaceId,
  memberRole,
  currentUserRole,
  currentUserId,
}: MembersTableRowActionsProps) {
  return currentUserId !== userId ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {currentUserRole === WorkspaceRoles.owner && (
          <WorkspaceOwnerActions
            userId={userId}
            workspaceId={workspaceId}
            memberRole={memberRole}
          />
        )}

        {currentUserRole === WorkspaceRoles.admin && (
          <WorkspaceAdminActions
            userId={userId}
            workspaceId={workspaceId}
            memberRole={memberRole}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}

type ActionsProps = {
  userId: string;
  workspaceId: string;
  memberRole: WorkspaceRoles;
};

function WorkspaceOwnerActions({
  memberRole,
  userId,
  workspaceId,
}: ActionsProps) {
  return (
    <>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>

      {memberRole === WorkspaceRoles.user ? (
        <PromoteMember userId={userId} workspaceId={workspaceId} />
      ) : (
        <DemoteMember userId={userId} workspaceId={workspaceId} />
      )}

      <DropdownMenuSeparator />

      <RemoveMember userId={userId} workspaceId={workspaceId} />
    </>
  );
}

function WorkspaceAdminActions({
  memberRole,
  userId,
  workspaceId,
}: ActionsProps) {
  if (memberRole === WorkspaceRoles.user)
    return (
      <>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <PromoteMember userId={userId} workspaceId={workspaceId} />

        <DropdownMenuSeparator />

        <RemoveMember userId={userId} workspaceId={workspaceId} />
      </>
    );

  if (memberRole === WorkspaceRoles.owner)
    return (
      <>
        <DropdownMenuLabel>Member is the owner of workspace</DropdownMenuLabel>
        <DropdownMenuItem>No actions available</DropdownMenuItem>
      </>
    );

  return (
    <>
      <DropdownMenuLabel>Member is an admin</DropdownMenuLabel>
      <DropdownMenuItem>No actions available</DropdownMenuItem>
    </>
  );
}

function PromoteMember({
  userId,
  workspaceId,
}: Omit<ActionsProps, "memberRole">) {
  return (
    <DropdownMenuItem onClick={() => console.log({ userId, workspaceId })}>
      <UserPlus /> Promote
    </DropdownMenuItem>
  );
}

function DemoteMember({
  userId,
  workspaceId,
}: Omit<ActionsProps, "memberRole">) {
  return (
    <DropdownMenuItem onClick={() => console.log({ userId, workspaceId })}>
      <UserMinus /> Demote
    </DropdownMenuItem>
  );
}

function RemoveMember({
  userId,
  workspaceId,
}: Omit<ActionsProps, "memberRole">) {
  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() => console.log({ userId, workspaceId })}
    >
      <Trash2 className="text-destructive" />
      Remove
    </DropdownMenuItem>
  );
}
