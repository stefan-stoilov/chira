import { AppwriteException, ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { CreateWorkspaceRoute } from "../workspaces.routes";

import { env } from "@/env";
import { MemberRole } from "@/features/members/types";
import { validateImage } from "@/server/lib/validate-image";

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
    const workspace = await databases.createDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImgUrl,
        inviteCode: crypto.randomUUID(),
      },
    );

    await databases.createDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
      ID.unique(),
      {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      },
    );

    revalidatePath("/dashboard", "page");

    return c.json({ $id: workspace.$id }, 200);
  } catch (error) {
    if (error instanceof AppwriteException) {
      return c.json({ error: error.message }, 401);
    } else {
      return c.json({ error: "Unexpected error." }, 500);
    }
  }
};
