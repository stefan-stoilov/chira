"use client";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks";
import { CreateWorkspaceForm } from "..";
import { ResponsiveModal } from "@/components/shared";

/**
 * Modal that contains a form to create a new workspace.
 *
 * @warning This component must be wrapped with Suspense to avoid Next.js errors because of the `nuqs` package.
 *
 * @example
 * ```tsx
 * <Suspense>
 *    <CreateWorkspaceModal />
 * </Suspense>
 * ```
 */
export function CreateWorkspaceModal() {
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
