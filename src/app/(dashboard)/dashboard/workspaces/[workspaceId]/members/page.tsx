"use client";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";
import { PageLoader } from "@/components/shared/page-loader";
import type { WorkspacePageParams } from "@/features/workspaces/schemas";
import { MembersTable } from "@/features/workspaces/features/members/components/members-table";

function Page({ params }: WorkspacePageParams) {
  const { data, isLoading, isError, error } = useWorkspace(params.workspaceId);

  if (isLoading) return <PageLoader />;

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
      {data && <MembersTable workspaceId={data.id} role={data.role} />}
    </div>
  );
}

export default Page;
