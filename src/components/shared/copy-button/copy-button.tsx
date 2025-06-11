"use client";
import { useCallback, useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CopyButtonProps = { value: string } & Omit<ButtonProps, "onClick">;

export function CopyButton({
  value,
  size,
  className,
  children,
  disabled,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const reset = useCallback(() => {
    setHasCopied(false);
  }, []);

  useEffect(() => {
    if (!hasCopied) return;

    const id = setTimeout(() => {
      reset();
    }, 2000);

    return () => {
      clearTimeout(id);
    };
  }, [reset, hasCopied]);

  return (
    <Button
      size={children ? size : "icon"}
      onClick={() => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
        toast.message("Copied to clipboard.");
      }}
      disabled={typeof disabled === "undefined" ? hasCopied : disabled}
      className={cn("disabled:opacity-100", className)}
      {...props}
    >
      {children ?? <VisuallyHidden>Copy</VisuallyHidden>}
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}
