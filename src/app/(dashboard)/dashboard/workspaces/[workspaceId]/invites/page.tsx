"use client";
import { useWorkspace } from "@/features/workspaces/api/use-workspace";
import { PageLoader } from "@/components/shared/page-loader";
import { InviteCard } from "@/features/workspaces/components/invite-card";
import { useWorkspaceInvites } from "@/features/workspaces/api/use-workspace-invites";

function Page({ params }: { params: { workspaceId: string } }) {
  const { data, isLoading, isError, error } = useWorkspace(params.workspaceId);
  const { data: invitesData } = useWorkspaceInvites(params.workspaceId);
  console.log(invitesData);

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
      {data && <InviteCard workspace={data} />}
      {invitesData && (
        <>
          {invitesData.pages.map((page) =>
            page.invites.map((invite) => (
              <p key={invite.id}>
                {invite.name} {invite.createdAt}
              </p>
            )),
          )}
        </>
      )}
    </div>
  );
}

export default Page;
