import { useCallback, useState } from "react";

import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import {
  ResponsiveModal,
  ResponsiveModalCard,
} from "@/components/shared/responsive-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/shared/submit-button";

export function DeleteWorkspaceCard({ workspaceId }: { workspaceId: string }) {
  return (
    <Card className="size-full border border-destructive-border bg-destructive-subtle shadow-none">
      <CardContent className="p-7">
        <div className="flex flex-col">
          <h3 className="font-bold">Danger Zone</h3>

          <p className="text-sm text-foreground-subtle">
            Deleting a workspace is irreversible and will remove all associated
            data.
          </p>

          <Separator className="my-7" />

          <DeleteWorkspaceModal
            workspaceId={workspaceId}
            title={"Delete workspace"}
            description={"This action cannot be undone."}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type DeleteWorkspaceModalProps = {
  workspaceId: string;
  title: string;
  description: string;
};

function DeleteWorkspaceModal({
  workspaceId,
  title,
  description,
}: DeleteWorkspaceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteWorkspace({
    onError: () => setIsOpen(false),
  });

  const closeModal = useCallback(() => setIsOpen(false), []);

  const deleteWorkspace = useCallback(() => {
    mutate({ param: { id: workspaceId } });
  }, [mutate, workspaceId]);

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
        Delete Workspace
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
              onClick={deleteWorkspace}
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
