import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import type { Options } from "nuqs";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OnOpenChange =
  | Dispatch<SetStateAction<boolean>>
  | ((
      value: boolean | ((old: boolean) => boolean | null) | null,
      options?: Options,
    ) => Promise<URLSearchParams>);

type ResponsiveModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange?: OnOpenChange;
} & PropsWithChildren;

export function ResponsiveModal({
  children,
  title,
  description,
  isOpen,
  onOpenChange,
}: ResponsiveModalProps) {
  const screenLg = useMediaQuery({ type: "min", breakpoint: "md" });

  return screenLg ? (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange ? (value) => onOpenChange(value) : undefined}
    >
      <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
        <VisuallyHidden.Root>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden.Root>
        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange ? (value) => onOpenChange(value) : undefined}
    >
      <DrawerContent>
        <VisuallyHidden.Root>
          <DrawerTitle>{title}</DrawerTitle>

          <DrawerDescription>{description}</DrawerDescription>
        </VisuallyHidden.Root>
        <div className="hide-scrollbar max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type ResponsiveModalCardProps = {
  title: string;
  description: string;
  className?: string;
  contentCn?: string;
} & PropsWithChildren;

export function ResponsiveModalCard({
  title,
  description,
  children,
  className,
  contentCn,
}: ResponsiveModalCardProps) {
  return (
    <Card className={cn("size-full border-none shadow-none", className)}>
      <CardContent className={cn("pt-8", contentCn)}>
        <CardHeader className="p-0">
          <CardTitle className="mb-2">{title}</CardTitle>

          <CardDescription>{description}</CardDescription>
        </CardHeader>

        {children}
      </CardContent>
    </Card>
  );
}
