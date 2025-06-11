"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";

type ReplaceButtonProps = Omit<ButtonProps, "onClick"> & { path: string };

export function ReplaceButton({ path, ...props }: ReplaceButtonProps) {
  const router = useRouter();
  const handleClick = useCallback(() => router.replace(path), [router, path]);

  return <Button onClick={handleClick} {...props} />;
}
