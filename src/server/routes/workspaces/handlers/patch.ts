import { AppwriteException, ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { UpdateWorkspaceRoute } from "../workspaces.routes";
import type { Workspace } from "@/features/workspaces/types";
import { MemberRole, type Member } from "@/features/members/types";

import { env } from "@/env";
import { getWorkspaceMember } from "@/server/lib/get-workspace-member";
import { getWorkspace } from "@/server/lib/get-workspace";
import { validateImage } from "@/server/lib/validate-image";

export const updateWorkspaceHandler: AppRouteHandler<
  UpdateWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const { name, image, fileName } = c.req.valid("form");
  const { id: workspaceId } = c.req.valid("param");

  const databases = c.get("databases");
  const storage = c.get("storage");
  const user = c.get("user");

  let workspace: Workspace;
  let member: Member | undefined;

  try {
    workspace = await getWorkspace({
      databases,
      workspaceId,
    });
  } catch (error) {
    if (error instanceof AppwriteException) {
      if (error.code === 404) {
        return c.json({ error: `${error.message}` }, 404);
      }
    }
    return c.json({ error: "Unexpected error." }, 500);
  }

  try {
    member = await getWorkspaceMember({
      databases,
      workspaceId: workspace.$id,
      userId: user.$id,
    });
  } catch (error) {
    return c.json({ error: "Unexpected error." }, 500);
  }

  if (!member || member.role !== MemberRole.ADMIN) {
    return c.json({ error: "Unauthorized." }, 401);
  }

  let uploadedImgUrl: string | undefined;

  if (image instanceof Blob) {
    const isSupportedImage = await validateImage(image);

    if (isSupportedImage) {
      const file = await storage.createFile(
        env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
        ID.unique(),
        new File([image], fileName || ID.unique(), {
          type: image.type,
          lastModified: Date.now(),
        }),
      );

      const arrayBuffer = await storage.getFilePreview(
        env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
        file.$id,
      );

      uploadedImgUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }
  }

  try {
    await databases.updateDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      workspace.$id,
      {
        name,
        imageUrl: uploadedImgUrl,
      },
    );
  } catch (error) {
    return c.json({ error: "Unexpected error." }, 500);
  }

  revalidatePath("/dashboard", "page");
  return c.json({ $id: workspace.$id }, 200);
};
