"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";

export function BackButton(props: Omit<ButtonProps, "onClick">) {
  const router = useRouter();
  const handleClick = useCallback(() => router.back(), [router]);

  return <Button onClick={handleClick} {...props} />;
}
