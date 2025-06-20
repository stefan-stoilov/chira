"use client";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";
import { PageLoader } from "@/components/shared/page-loader";
import { InviteCard } from "@/features/workspaces/components/invite-card";
import { InvitesTable } from "@/features/workspaces/components/invites-table";

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
        <div className="flex flex-col gap-8">
          <InviteCard workspace={data} />
          <InvitesTable
            workspaceId={data.id}
            role={data.role}
            allowMemberInviteManagement={data.allowMemberInviteManagement}
          />
        </div>
      )}
    </div>
  );
}

export default Page;
