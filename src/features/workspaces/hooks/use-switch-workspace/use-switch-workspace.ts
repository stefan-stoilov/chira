import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const ALLOWED_SWITCH_PATH = new Set(["invites", "members"]);

export function useSwitchWorkspace() {
  const router = useRouter();
  const pathname = usePathname();

  const workspacePath = pathname.split("/workspaces/")[1];
  const workspaceId = workspacePath?.split("/")[0];

  const switchWorkspace = useCallback(
    (id: string) => {
      if (workspacePath) {
        const nextInPath = workspacePath.split("/")?.[1];

        if (nextInPath && ALLOWED_SWITCH_PATH.has(nextInPath)) {
          router.push(`/dashboard/workspaces/${id}/${nextInPath}`);
          return;
        }
      }

      router.push(`/dashboard/workspaces/${id}`);
    },
    [router, workspacePath],
  );

  return { workspaceId, switchWorkspace };
}
