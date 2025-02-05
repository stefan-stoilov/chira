import type { Databases } from "node-appwrite";
import type { Workspace } from "@/features/workspaces/types";

import { env } from "@/env";

type GetWorkspaceProps = {
  databases: Databases;
  workspaceId: string;
};

export async function getWorkspace({
  databases,
  workspaceId,
}: GetWorkspaceProps): Promise<Workspace> {
  const workspace = await databases.getDocument<Workspace>(
    env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
    workspaceId,
  );

  return workspace;
}
