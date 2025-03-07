"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "../user-button";

export function Navbar() {
  return (
    <nav className="relative flex items-center justify-between px-6 pt-4">
      <SidebarTrigger />

      <div className="absolute right-6 top-4 flex items-center gap-x-2.5">
        <UserButton />
      </div>
    </nav>
  );
}
