import { CreateProjectModal } from "@/features/workspaces/features/projects/components/create-project-modal";
import type { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <CreateProjectModal />
    </>
  );
}

export default Layout;
