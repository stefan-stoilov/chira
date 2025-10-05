"use client";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import {
  updateWorkspaceSchema,
  type UpdateWorkspaceSchema,
} from "@/features/workspaces/schemas";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import type { UseWorkspaceData } from "@/features/workspaces/api/use-workspace";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/shared/back-button";
import { SubmitTooltipButton } from "@/components/shared/submit-tooltip-button";

type EditWorkspaceFormProps = {
  onCancel?: () => void;
  workspace: UseWorkspaceData;
  deleteWorkspaceCard?: ReactNode;
};

export function EditWorkspaceForm({
  onCancel,
  workspace,
  deleteWorkspaceCard,
}: EditWorkspaceFormProps) {
  const { mutate, isPending } = useUpdateWorkspace();

  const form = useForm<UpdateWorkspaceSchema>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: { name: workspace.name },
  });

  const submit = (data: UpdateWorkspaceSchema) => {
    mutate({ json: data, param: { id: workspace.id } });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="size-full border shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0 p-7">
          <BackButton variant={"outline"} size="xs">
            <ArrowLeft />
            Back
          </BackButton>
          <CardTitle className="text-xl font-bold">{workspace.name}</CardTitle>
        </CardHeader>

        <div className="px-7">
          <Separator className="px-7" />
        </div>

        <CardContent className="p-7">
          <Form {...form}>
            <form
              name="Edit workspace form"
              onSubmit={form.handleSubmit(submit)}
            >
              <div className="flex flex-col gap-y-4">
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormDescription hidden>Workspace Name</FormDescription>

                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter workspace name"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  disabled={isPending}
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative size-[72px] overflow-hidden rounded-md">
                            <Image
                              src={
                                typeof field.value === "string"
                                  ? field.value
                                  : URL.createObjectURL(field.value)
                              }
                              alt="Workspace Logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className="flex flex-col">
                          <Label htmlFor="picture" className="text-sm">
                            Workspace Icon
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, or JPEG, max 1MB
                          </p>

                          <input
                            id="picture"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept=".jpg, .png, .jpeg"
                            ref={inputRef}
                            disabled={isPending}
                          />

                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="mt-2 w-fit"
                              onClick={() => {
                                field.onChange(null);

                                if (inputRef.current)
                                  inputRef.current.value = "";
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="tertiary"
                              size="xs"
                              className="mt-2 w-fit"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                /> */}
              </div>

              <div className="py-7">
                <Separator />
              </div>

              <div className="flex flex-wrap-reverse items-center justify-between">
                <Button
                  disabled={isPending}
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>

                <SubmitTooltipButton
                  isPending={isPending}
                  isDirty={form.formState.isDirty}
                  label="Save changes"
                  tooltip="No changes made to workspace"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {deleteWorkspaceCard}
    </div>
  );
}
