"use client";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";
import { PageLoader } from "@/components/shared/page-loader";
import type { WorkspacePageParams } from "@/features/workspaces/schemas";
import { MembersTable } from "@/features/workspaces/features/members/components/members-table";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

function Page({ params }: WorkspacePageParams) {
  const { data, isLoading, isError, error } = useWorkspace(params.workspaceId);
  const { data: currentUser, isLoading: userIsLoading } = useCurrentUser();

  if (isLoading || userIsLoading) return <PageLoader />;

  if (isError) {
    const { cause, message } = error;

    return (
      <h1>
        {cause} {message}
      </h1>
    );
  }

  return (
    <div className="mx-auto w-full lg:max-w-xl">
      {data && currentUser && (
        <MembersTable
          workspaceId={data.id}
          role={data.role}
          currentUserId={currentUser.id}
        />
      )}
    </div>
  );
}

export default Page;
