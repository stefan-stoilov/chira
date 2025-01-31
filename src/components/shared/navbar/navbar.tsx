"use client";
import { MobileSidebar } from "../mobile-sidebar";
import { UserButton } from "../user-button";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all your projects in one place.
        </p>
      </div>

      <MobileSidebar />

      <div className="flex items-center gap-x-2.5">
        <UserButton />
      </div>
    </nav>
  );
}
