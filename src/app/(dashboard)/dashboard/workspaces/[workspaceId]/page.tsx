"use client";
import { PageLoader } from "@/components/shared/page-loader";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";

function Page({ params }: { params: { workspaceId: string } }) {
  const { isLoading, isError, error, data } = useWorkspace(params.workspaceId);

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
    <div>
      Workspace {data?.name} {data?.id}
    </div>
  );
}

export default Page;
