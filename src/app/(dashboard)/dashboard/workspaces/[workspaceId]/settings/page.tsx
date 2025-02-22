"use client";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { DeleteWorkspaceCard } from "@/features/workspaces/components/delete-workspace-card";
import { PageLoader } from "@/components/shared/page-loader";

function Page({ params }: { params: { workspaceId: string } }) {
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
      {data && (
        <EditWorkspaceForm
          workspace={data}
          deleteWorkspaceCard={<DeleteWorkspaceCard workspaceId={data.id} />}
        />
      )}
    </div>
  );
}

export default Page;
