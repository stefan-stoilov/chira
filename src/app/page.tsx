import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <ThemeToggle />
      <Button disabled>Primary</Button>
      <Button disabled variant={"secondary"}>
        Secondary
      </Button>
      <Button disabled variant={"destructive"}>
        Destructive
      </Button>
      <Button disabled variant={"ghost"}>
        Ghost
      </Button>
      <Button disabled variant={"muted"}>
        Link
      </Button>
      <Button disabled variant={"outline"}>
        Outline
      </Button>
      <Button disabled variant={"tertiary"}>
        Tertiary
      </Button>
    </main>
  );
}
