import { useCallback, useState, useEffect } from "react";

import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { ResponsiveModal } from "@/components/shared/responsive-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/shared/submit-button";

export function DeleteWorkspaceCard({ workspaceId }: { workspaceId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending, isError } = useDeleteWorkspace();

  const closeModal = useCallback(() => setIsOpen(false), []);

  const deleteWorkspace = useCallback(() => {
    mutate({ param: { id: workspaceId } });
  }, [mutate, workspaceId]);

  useEffect(() => {
    if (isError) setIsOpen(false);
  }, [isError]);

  return (
    <>
      <Card className="border-destructive-border size-full border bg-destructive-subtle shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>

            <p className="text-sm text-foreground-subtle">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>

            <Separator className="my-7" />

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
          </div>
        </CardContent>
      </Card>

      <ResponsiveModal
        title={"Delete workspace"}
        description={"This action cannot be undone."}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Card className="size-full border-none shadow-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{"Delete workspace"}</CardTitle>

              <CardDescription>
                {"This action cannot be undone."}
              </CardDescription>
            </CardHeader>

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
          </CardContent>
        </Card>
      </ResponsiveModal>
    </>
  );
}
