"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProjectSchema,
  type CreateProjectSchema,
} from "@/features/workspaces/features/projects/schemas";
import { useCreateProject } from "@/features/workspaces/features/projects/api/use-create-project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

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
import { SubmitButton } from "@/components/shared/submit-button";

type CreateProjectFormProps = {
  onCancel?: () => void;
};

export function CreateProjectForm({ onCancel }: CreateProjectFormProps) {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateProject();

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
  });

  if (!workspaceId) return null;

  const submit = (data: CreateProjectSchema) => {
    mutate({ json: data, param: { id: workspaceId } });
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new project
        </CardTitle>
      </CardHeader>

      <div className="px-7">
        <Separator className="px-7" />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form name="Create project form" onSubmit={form.handleSubmit(submit)}>
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

            <div className="flex items-center justify-between">
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

              <SubmitButton isPending={isPending} size="lg">
                Create Project
              </SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
