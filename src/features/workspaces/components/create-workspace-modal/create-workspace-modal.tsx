"use client";
import { Suspense } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PlusCircle } from "lucide-react";

import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { CreateWorkspaceForm } from "../create-workspace-form";
import { ResponsiveModal } from "@/components/shared/responsive-modal";
import { Button } from "@/components/ui/button";

function Modal() {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal
      title="Create Workspace"
      description="Create a new workspace to get started."
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
}

function ModalButton() {
  const { open } = useCreateWorkspaceModal();

  return (
    <Button
      variant={"ghost"}
      className="px-3"
      onClick={() => open()}
      data-testid="create-workspace-button"
    >
      <CreateWorkspaceIcon />
      <VisuallyHidden>Create Workspace</VisuallyHidden>
    </Button>
  );
}

function CreateWorkspaceIcon() {
  return (
    <PlusCircle className="size-5 cursor-pointer text-muted-foreground transition hover:opacity-75" />
  );
}

export function CreateWorkspaceModal() {
  return (
    <Suspense>
      <Modal />
    </Suspense>
  );
}

export function CreateWorkspaceButton() {
  return (
    <Suspense fallback={<CreateWorkspaceIcon />}>
      <ModalButton />
    </Suspense>
  );
}
