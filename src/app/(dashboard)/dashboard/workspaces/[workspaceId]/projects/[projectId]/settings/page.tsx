"use client";
import { useMemo } from "react";

import { PageLoader } from "@/components/shared/page-loader";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";
import { useProject } from "@/features/workspaces/features/projects/api/use-project";
import { EditProjectForm } from "@/features/workspaces/features/projects/components/edit-project-form";
import { WorkspaceRoles } from "@/server/db/schemas";
import { DeleteProjectCard } from "@/features/workspaces/features/projects/components/delete-project-card";

function Page({
  params,
}: {
  params: { workspaceId: string; projectId: string };
}) {
  const workspace = useWorkspace(params.workspaceId);
  const project = useProject(params);

  const role = workspace?.data?.role;

  console.log({ role });

  const deleteProjectCard = useMemo(
    () =>
      role === WorkspaceRoles.owner ? (
        <DeleteProjectCard
          workspaceId={params.workspaceId}
          projectId={params.projectId}
        />
      ) : null,
    [role, params],
  );

  if (project.isLoading || workspace.isLoading) return <PageLoader />;

  if (project.isError || workspace.isError) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <div className="mx-auto w-full lg:max-w-xl">
      {project?.data && workspace?.data && role !== WorkspaceRoles.user && (
        <EditProjectForm
          project={project.data}
          deleteProjectCard={deleteProjectCard}
        />
      )}
    </div>
  );
}

export default Page;
