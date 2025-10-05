"use client";
import { Suspense } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PlusCircle } from "lucide-react";

import { useCreateProjectModal } from "../../hooks/use-create-project-modal";
import { CreateProjectForm } from "../create-project-form";
import { ResponsiveModal } from "@/components/shared/responsive-modal";
import { Button } from "@/components/ui/button";

function Modal() {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal
      title="Create project"
      description="Create a new project to get started."
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}

function ModalButton() {
  const { open } = useCreateProjectModal();

  return (
    <Button variant={"ghost"} className="px-3" onClick={() => open()}>
      <CreateProjectIcon />
      <VisuallyHidden>Create Project</VisuallyHidden>
    </Button>
  );
}

function CreateProjectIcon() {
  return (
    <PlusCircle className="size-5 cursor-pointer text-muted-foreground transition hover:opacity-75" />
  );
}

export function CreateProjectModal() {
  return (
    <Suspense>
      <Modal />
    </Suspense>
  );
}

export function CreateProjectButton() {
  return (
    <Suspense fallback={<CreateProjectIcon />}>
      <ModalButton />
    </Suspense>
  );
}
