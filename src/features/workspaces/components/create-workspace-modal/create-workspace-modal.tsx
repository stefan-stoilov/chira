"use client";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { CreateWorkspaceForm } from "../create-workspace-form";
import { ResponsiveModal } from "@/components/shared/responsive-modal";

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
