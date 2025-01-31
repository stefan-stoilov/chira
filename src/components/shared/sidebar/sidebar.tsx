import { Logo } from "../logo";
import { NavList } from "../nav-list";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  return (
    <aside className="size-full bg-primary/10 p-4">
      <Logo />
      <Separator className="my-4 bg-primary/20" />
      <WorkspaceSwitcher />
      <Separator className="my-4 bg-primary/20" />
      <NavList />
    </aside>
  );
}
