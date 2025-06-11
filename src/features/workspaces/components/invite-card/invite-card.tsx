import type { UseWorkspaceData } from "../../api/use-workspace";
import { INVITE_LINK_SEARCH_PARAMS } from "../../hooks/use-join-search-params";
import { WorkspaceRoles } from "@/server/db/schemas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InviteSettings } from "./invite-settings";

type InviteCardProps = {
  workspace: UseWorkspaceData;
};

export function InviteCard({
  workspace: { id, name, inviteCode, role },
}: InviteCardProps) {
  const inviteLink = inviteCode
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/workspaces/join?${INVITE_LINK_SEARCH_PARAMS.code}=${inviteCode}&${INVITE_LINK_SEARCH_PARAMS.id}=${id}`
    : null;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0 pt-7">
        <CardTitle className="text-xl font-bold">
          Invite members to {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-7">
        {inviteLink ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite link">Invite Link</Label>
            <div className="flex gap-2">
              <Input
                id="invite link"
                value={inviteLink}
                disabled
                className="h-10 disabled:cursor-default disabled:opacity-100"
              />

              <CopyButton
                value={inviteLink}
                className="size-10 flex-shrink-0"
              />
            </div>
          </div>
        ) : (
          <>
            <p>
              Workspace currently does not have an invite link.
              {!inviteLink &&
                role === WorkspaceRoles.user &&
                " Make a request to an admin to set an invite link for the workspace if you wish to invite a new member."}
            </p>
          </>
        )}
      </CardContent>

      {role !== WorkspaceRoles.user && (
        <InviteSettings workspaceId={id} inviteLink={inviteLink} />
      )}
    </Card>
  );
}
