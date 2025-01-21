import { AppwriteException, ID } from "node-appwrite";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { CreateWorkspaceRoute } from "../workspaces.routes";

import { env } from "@/env";

export const create: AppRouteHandler<
  CreateWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const databases = c.get("databases");
  const storage = c.get("storage");
  const user = c.get("user");

  const { name, image, fileName } = c.req.valid("form");

  let uploadedImgUrl: string | undefined;

  if (image instanceof Blob) {
    const file = await storage.createFile(
      env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID,
      ID.unique(),
      new File([image], fileName || "unnamed", {
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

  try {
    await databases.createDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImgUrl,
      },
    );

    return c.json({ success: true }, 200);
  } catch (error) {
    if (error instanceof AppwriteException) {
      return c.json({ error: error.message }, 401);
    } else {
      return c.json({ error: "Unexpected error." }, 500);
    }
  }
};
