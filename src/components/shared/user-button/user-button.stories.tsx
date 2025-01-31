import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Loader } from "../loader";
import { LogOut } from "lucide-react";

const meta = {
  title: "Components/Shared/UserButton",
  render() {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="relative">
          <Avatar className="size-10 border border-neutral-300 transition hover:opacity-75">
            <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
              {"U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-60"
          sideOffset={10}
        >
          <div className="flex flex-col items-center justify-center gap-2 rounded border border-muted px-2.5 py-4">
            <Avatar className="size-14 border border-neutral-300 transition hover:opacity-75">
              <AvatarFallback className="flex items-center justify-center bg-neutral-200 text-xl font-medium text-neutral-500">
                {"U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-sm font-medium text-foreground">
                {name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {"mock@email.com"}
              </p>
            </div>

            <Separator className="mb-1" />

            <DropdownMenuItem className="flex h-10 cursor-pointer items-center justify-center font-medium text-amber-700">
              <LogOut className="mr-2 size-4" />
              Sign Out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render() {
    return (
      <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
        <Loader />
      </div>
    );
  },
};
