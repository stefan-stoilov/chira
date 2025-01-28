import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { PropsWithChildren } from "react";
import type { Options } from "nuqs";

import { useMediaQuery } from "@/hooks";
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

type ResponsiveModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options,
  ) => Promise<URLSearchParams>;
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
    <Dialog open={isOpen} onOpenChange={(value) => onOpenChange(value)}>
      <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
        <VisuallyHidden.Root>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden.Root>
        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={(value) => onOpenChange(value)}>
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
