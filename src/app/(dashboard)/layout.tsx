import type { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Navbar } from "@/components/shared/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

function Layout({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <SidebarProvider>
        <div className="min-h-screen w-full">
          <CreateWorkspaceModal />

          <div className="flex size-full">
            <AppSidebar />

            <SidebarInset className="w-full">
              <div className="w-full">
                <div className="container mx-auto h-full">
                  <Navbar />
                  <div className="flex h-full flex-col px-6 py-8">
                    {children}
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </NuqsAdapter>
  );
}

export default Layout;
