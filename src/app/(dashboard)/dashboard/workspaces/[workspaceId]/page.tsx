// import { redirect } from "next/navigation";
// import { rpc } from "@/lib/rpc";

async function Page({ params }: { params: { workspaceId: string } }) {
  // const res = await rpc.api.workspaces.$get();

  // if (!res.ok) {
  //   redirect("/sign-in");
  // }

  // const { documents } = await res.json();

  return <div>Workspace {params.workspaceId}</div>;
}

export default Page;
