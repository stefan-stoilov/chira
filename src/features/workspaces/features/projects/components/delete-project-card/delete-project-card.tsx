import { useCallback, useState } from "react";

import { useDeleteProject } from "../../api/use-delete-project";

import {
  ResponsiveModal,
  ResponsiveModalCard,
} from "@/components/shared/responsive-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/shared/submit-button";

type DeleteProjectCardProps = {
  workspaceId: string;
  projectId: string;
};

export function DeleteProjectCard({
  workspaceId,
  projectId,
}: DeleteProjectCardProps) {
  return (
    <Card className="size-full border border-destructive-border bg-destructive-subtle shadow-none">
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>

          <p className="text-sm text-foreground-subtle">
            Deleting a project is irreversible and will remove all associated
            data.
          </p>

          <Separator className="my-7" />

          <DeleteProjectModal
            workspaceId={workspaceId}
            projectId={projectId}
            title={"Delete project"}
            description={"This action cannot be undone."}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type DeleteProjectModalProps = DeleteProjectCardProps & {
  title: string;
  description: string;
};

function DeleteProjectModal({
  workspaceId,
  projectId,
  title,
  description,
}: DeleteProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteProject({
    onError: () => setIsOpen(false),
  });

  const closeModal = useCallback(() => setIsOpen(false), []);

  const deleteProject = useCallback(() => {
    mutate({ param: { id: workspaceId, "project-id": projectId } });
  }, [mutate, workspaceId, projectId]);

  return (
    <>
      <SubmitButton
        size="sm"
        variant="destructive"
        type="button"
        isPending={isPending}
        onClick={() => setIsOpen(true)}
        className="ml-auto mt-6 w-fit"
        loaderClassName="text-destructive-foreground"
      >
        Delete Project
      </SubmitButton>

      <ResponsiveModal
        title={title}
        description={description}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <ResponsiveModalCard title={title} description={description}>
          <div className="flex w-full flex-col-reverse items-center justify-end gap-x-2 gap-y-3 pt-4 lg:flex-row">
            <Button
              onClick={closeModal}
              variant="outline"
              className="w-full lg:w-auto"
              disabled={isPending}
            >
              Cancel
            </Button>

            <SubmitButton
              type="button"
              onClick={deleteProject}
              variant={"destructive"}
              className="w-full lg:w-auto"
              isPending={isPending}
            >
              Confirm
            </SubmitButton>
          </div>
        </ResponsiveModalCard>
      </ResponsiveModal>
    </>
  );
}
