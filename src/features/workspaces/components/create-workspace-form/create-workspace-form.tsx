"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createWorkspaceSchema,
  type CreateWorkspaceSchema,
} from "@/features/workspaces/schemas";
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace";

import { cn } from "@/lib/utils";
import { Loader } from "@/components/shared/loader";
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

type CreateWorkspaceFormProps = {
  onCancel?: () => void;
};

export function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  const submit = (data: CreateWorkspaceSchema) => {
    mutate({ json: data });
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>

      <div className="px-7">
        <Separator className="px-7" />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form
            name="Create workspace form"
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

              <Button
                variant="primary"
                disabled={isPending}
                type="submit"
                size="lg"
                className="relative"
              >
                <span className={cn(isPending && "invisible")}>
                  Create workspace
                </span>
                {isPending && (
                  <div
                    data-testid="loader"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Loader />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
