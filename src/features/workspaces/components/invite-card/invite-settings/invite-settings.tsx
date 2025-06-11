import { useCallback, useEffect, useState } from "react";

import { useUpdateInviteCode } from "@/features/workspaces/api/use-update-invite-code";
import { Button, type ButtonProps } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/shared/submit-button";
import {
  ResponsiveModal,
  ResponsiveModalCard,
} from "@/components/shared/responsive-modal";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/shared/loader";

type InviteSettingsProps = {
  inviteLink: string | null;
  workspaceId: string;
};

export function InviteSettings({
  workspaceId,
  inviteLink,
}: InviteSettingsProps) {
  const { mutate, isPending, isError, isSuccess } = useUpdateInviteCode();

  const updateInviteLink = useCallback(() => {
    mutate({ param: { id: workspaceId }, json: {} });
  }, [mutate, workspaceId]);

  const removeInviteLink = useCallback(() => {
    mutate({ param: { id: workspaceId }, json: { remove: true } });
  }, [mutate, workspaceId]);

  return (
    <>
      <Separator className="mb-4" />
      <CardFooter className="pb-4">
        <div
          className={cn(
            "relative flex w-full flex-row flex-wrap-reverse gap-3",
            inviteLink && "justify-between",
          )}
        >
          {inviteLink ? (
            <>
              <InviteSettingsModal
                variant={"destructive"}
                mutation={removeInviteLink}
                isPending={isPending}
                isError={isError}
                isSuccess={isSuccess}
                title={"Remove invite link"}
                description={
                  "Removing invite link for the workspace will make all previously sent invites non functional. Are you sure you want to continue?"
                }
              />

              <InviteSettingsModal
                variant={"secondary"}
                mutation={updateInviteLink}
                isPending={isPending}
                isError={isError}
                isSuccess={isSuccess}
                title={"Update invite link"}
                description={
                  "Updating invite link for the workspace will make all previously sent invites non functional. Are you sure you want to continue?"
                }
              />

              {isPending && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  data-testid="invite-settings-loader"
                >
                  <Loader />
                </div>
              )}
            </>
          ) : (
            <SubmitButton
              type="button"
              variant={"secondary"}
              onClick={updateInviteLink}
              isPending={isPending}
            >
              Generate Invite Link
            </SubmitButton>
          )}
        </div>
      </CardFooter>
    </>
  );
}

type InviteSettingsModalProps = {
  variant: ButtonProps["variant"];
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  mutation: () => void;
  title: string;
  description: string;
};

function InviteSettingsModal({
  variant,
  mutation,
  isError,
  isSuccess,
  isPending,
  title,
  description,
}: InviteSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (isError || isSuccess) setIsOpen(false);
  }, [isError, isSuccess]);

  return (
    <>
      <SubmitButton
        variant={variant}
        type="button"
        isPending={isPending}
        onClick={open}
        className={cn("w-fit", isPending && "invisible")}
        loaderClassName="text-destructive-foreground"
      >
        {title}
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
              onClick={close}
              variant="outline"
              className="w-full lg:w-auto"
              disabled={isPending}
            >
              Cancel
            </Button>

            <SubmitButton
              type="button"
              onClick={mutation}
              variant={variant}
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
