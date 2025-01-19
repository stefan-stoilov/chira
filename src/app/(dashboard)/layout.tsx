import type { PropsWithChildren } from "react";
import { Sidebar, Navbar } from "@/components/shared";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <div className="flex size-full">
        <div className="fixed left-0 top-0 hidden h-full overflow-auto lg:block lg:w-64">
          <Sidebar />
        </div>

        <div className="w-full lg:pl-64">
          <div className="container mx-auto h-full">
            <Navbar />
            <main className="flex h-full flex-col px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
