import { useParams } from "next/navigation";

export function useWorkspaceId(): string | undefined {
  const params = useParams();

  const workspaceId = params.workspaceId;

  return typeof workspaceId === "string" ? workspaceId : undefined;
}
