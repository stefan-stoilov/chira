"use client";
import type { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto p-4">
        <nav className="flex items-center justify-between">
          <Image src={"/logo.svg"} alt="logo" width={152} height={56} />

          <div className="flex items-center gap-2">
            <Button asChild variant={"secondary"}>
              <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
                {pathname === "/sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex w-full flex-col items-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}

export default Layout;
