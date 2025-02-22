"use client";
import Link from "next/link";
import { useWorkspaces } from "@/features/workspaces/api/use-workspaces";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/page-loader";
import { typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

function Page() {
  const { data, isError, isLoading } = useWorkspaces();

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <h1 className={cn(typography.h2, "text-center")}>
        Unexpected error occurred.
      </h1>
    );
  }
  if (data?.workspaces.length === 0) {
    return (
      <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-3">
        <h1 className={cn(typography.h2, "text-center")}>
          Hmm, no workspaces have been found.
        </h1>
        <Button asChild>
          <Link href="/dashboard/workspaces/create">Create workspace</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.workspaces.map(({ id, name }) => (
        <li
          key={id}
          className="flex aspect-square w-full items-center justify-center rounded-lg border shadow"
        >
          <p>{name}</p>
        </li>
      ))}
    </ul>
  );
}

export default Page;
