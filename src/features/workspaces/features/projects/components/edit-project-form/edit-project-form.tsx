"use client";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import type { UseProjectData } from "../../api/use-project";
import { useUpdateProject } from "../../api/use-update-project";

import { Separator } from "@/components/ui/separator";
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
import { type UpdateProjectSchema, updateProjectSchema } from "../../schemas";

type EditProjectFormProps = {
  project: UseProjectData;
  deleteProjectCard?: ReactNode;
};

export function EditProjectForm({
  project,
  deleteProjectCard,
}: EditProjectFormProps) {
  const { mutate, isPending } = useUpdateProject();

  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: { name: project.name },
  });

  const submit = (data: UpdateProjectSchema) => {
    mutate({
      json: data,
      param: { id: project.workspaceId, "project-id": project.id },
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="size-full border shadow-none">
        <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0 p-7">
          <BackButton variant={"outline"} size="xs">
            <ArrowLeft />
            Back
          </BackButton>
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
        </CardHeader>

        <div className="px-7">
          <Separator className="px-7" />
        </div>

        <CardContent className="p-7">
          <Form {...form}>
            <form name="Edit project form" onSubmit={form.handleSubmit(submit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormDescription hidden>Project Name</FormDescription>

                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter project name"
                          disabled={isPending}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="py-7">
                <Separator />
              </div>

              <div className="flex flex-wrap-reverse items-center justify-between">
                <SubmitTooltipButton
                  isPending={isPending}
                  isDirty={form.formState.isDirty}
                  label="Save changes"
                  tooltip="No changes made to project"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {deleteProjectCard}
    </div>
  );
}
