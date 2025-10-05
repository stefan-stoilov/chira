"use client";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useProject } from "@/features/workspaces/features/projects/api/use-project";
import { PageLoader } from "@/components/shared/page-loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function Page({
  params,
}: {
  params: { workspaceId: string; projectId: string };
}) {
  const { isLoading, isError, error, data } = useProject(params);

  if (isLoading) return <PageLoader />;

  if (isError) {
    const { message } = error;

    return <h1>{message}</h1>;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <Avatar
          className={"relative block size-6 shrink-0 rounded-md bg-primary"}
        >
          <AvatarFallback className="inset-0 bg-primary text-sm font-semibold uppercase text-background">
            {data?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <p className="text-lg font-semibold">{data?.name}</p>
      </div>

      <div>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/dashboard/workspaces/${data?.workspaceId}/projects/${data?.id}/settings`}
          >
            <Pencil className="mr-1 size-4" />
            Edit Project
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Page;
