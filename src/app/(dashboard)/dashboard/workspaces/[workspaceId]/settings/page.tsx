"use client";
import { useMemo } from "react";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { DeleteWorkspaceCard } from "@/features/workspaces/components/delete-workspace-card";
import { PageLoader } from "@/components/shared/page-loader";
import { WorkspaceRoles } from "@/server/db/schemas";

function Page({ params }: { params: { workspaceId: string } }) {
  const { data, isLoading, isError, error } = useWorkspace(params.workspaceId);

  const deleteWorkspaceCard = useMemo(
    () => (data?.id ? <DeleteWorkspaceCard workspaceId={data.id} /> : null),
    [data?.id],
  );

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
      {data && data.role !== WorkspaceRoles.user && (
        <EditWorkspaceForm
          workspace={data}
          deleteWorkspaceCard={deleteWorkspaceCard}
        />
      )}
    </div>
  );
}

export default Page;
