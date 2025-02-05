import { Loader as LucideLoader } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
};

export function Loader({ className }: LoaderProps) {
  return (
    <LucideLoader
      className={cn("size-4 animate-spin text-muted-foreground", className)}
    />
  );
}
