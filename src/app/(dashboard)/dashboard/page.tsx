import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Account, Databases, Query, type Models } from "node-appwrite";

import { env } from "@/env";
import { createClient } from "@/server/lib/appwrite";
import { SESSION_COOKIE } from "@/server/routes/auth/constants";
import type { Member } from "@/features/members/types";
import type { Workspace } from "@/features/workspaces/types";

async function Page() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);

  if (!sessionCookie) redirect("/sign-in");

  let workspaces: Models.DocumentList<Workspace> = { documents: [], total: 0 };

  try {
    const client = createClient();
    client.setSession(sessionCookie.value);

    const account = new Account(client);
    const user = await account.get();
    const databases = new Databases(client);

    const members: Models.DocumentList<Member> = await databases.listDocuments(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
      [Query.equal("userId", user.$id)],
    );

    // Only fetch workspaces if the user has any. Otherwise use simulated version used to initialize workspaces.
    if (members.total > 0) {
      const workspaceIds = members.documents.map(
        (member) => member.workspaceId,
      );

      workspaces = await databases.listDocuments(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
        [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
      );
    }
  } catch (error) {
    console.log(error);

    return <h1>Unexpected error occurred.</h1>;
  }

  const { documents } = workspaces;

  return (
    <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map(({ $id, name }) => (
        <li
          key={$id}
          className="flex aspect-square w-full items-center justify-center rounded-lg border shadow"
        >
          <p>{name}</p>
        </li>
      ))}
    </ul>
  );
}

export default Page;
