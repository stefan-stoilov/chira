import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { rpc } from "@/lib/rpc";

type NotFound = "Not found";
type Unauthorized = "Unauthorized";
type ServerError = "Server error";

export const NOT_FOUND: NotFound = "Not found";
export const UNAUTHORIZED: Unauthorized = "Unauthorized";
export const SERVER_ERROR: ServerError = "Server error";

type UseWorkspaceResult = UseQueryResult<
  {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    $collectionId: string;
    $databaseId: string;
    $permissions: string[];
    userId: string;
    imageUrl?: string | undefined;
  },
  Error & { cause: NotFound | Unauthorized | ServerError }
>;

export function useWorkspace(workspaceId: string): UseWorkspaceResult {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const res = await rpc.api.workspaces[":id"].$get({
        param: { id: workspaceId },
      });

      if (!res.ok) {
        const { status } = res;

        if (status === 404)
          throw new Error("Oops, seems this workspace could not be found!", {
            cause: NOT_FOUND,
          });

        if (status === 401)
          throw new Error(UNAUTHORIZED, { cause: UNAUTHORIZED });

        if (status === 500)
          throw new Error(SERVER_ERROR, { cause: SERVER_ERROR });
      }

      return await res.json();
    },
  });
}
