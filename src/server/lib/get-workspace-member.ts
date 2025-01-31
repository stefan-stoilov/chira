import { Query, type Databases, type Models } from "node-appwrite";
import type { Member } from "@/features/members/types";

import { env } from "@/env";

type GetWorkspaceMemberProps = {
  databases: Databases;
  workspaceId: string;
  userId: string;
};

export async function getWorkspaceMember({
  databases,
  workspaceId,
  userId,
}: GetWorkspaceMemberProps): Promise<Member | undefined> {
  const members: Models.DocumentList<Member> = await databases.listDocuments(
    env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
    [Query.equal("workspaceId", workspaceId), Query.equal("userId", userId)],
  );

  return members.documents[0];
}
