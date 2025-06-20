import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAcceptWorkspaceInvites } from "../../api/use-accept-workspace-invites";
import { useSoftDeleteWorkspaceInvites } from "../../api/use-soft-delete-workspace-invites";

type InviteTableActionsProps = {
  page: number;
  userId: string;
  workspaceId: string;
  deletedAt: string | null;
  acceptedAt: string | null;
};

export function InviteTableActions({
  page,
  userId,
  workspaceId,
  deletedAt,
  acceptedAt,
}: InviteTableActionsProps) {
  const { mutate: acceptInvite } = useAcceptWorkspaceInvites();
  const { mutate: deleteInvite } = useSoftDeleteWorkspaceInvites();

  if (deletedAt)
    return (
      <div className="flex h-8 w-full items-center justify-end text-destructive">
        <span className="block">Deleted</span>
      </div>
    );

  if (acceptedAt)
    return (
      <div className="flex h-8 w-full items-center justify-end text-success">
        <span className="block">Accepted</span>
      </div>
    );

  return (
    <div className="flex w-full justify-end gap-3">
      <Button
        size={"icon"}
        onClick={() =>
          acceptInvite({
            page,
            param: { id: workspaceId },
            json: { userIds: [userId] },
          })
        }
      >
        <Check />
        <span className="sr-only">Accept join request</span>
      </Button>

      <Button
        size={"icon"}
        variant="destructive"
        onClick={() =>
          deleteInvite({
            page,
            param: { id: workspaceId },
            json: { userIds: [userId] },
          })
        }
      >
        <X />
        <span className="sr-only">Reject and delete join request</span>
      </Button>
    </div>
  );
}
