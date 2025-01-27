"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

import {
  createWorkspaceSchema,
  type CreateWorkspaceSchema,
} from "@/features/workspaces/schemas";
import { useCreateWorkspace } from "@/features/workspaces/api";

import { cn } from "@/lib/utils";
import { Loader } from "@/components/shared";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";

type CreateWorkspaceFormProps = {
  onCancel?: () => void;
};

export function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
  const { mutate, isPending } = useCreateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  const submit = (data: CreateWorkspaceSchema) => {
    mutate({ form: { ...data } });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes;
    const file = e.target.files?.[0];

    if (file) {
      const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];

      if (!validImageTypes.includes(file.type))
        return toast.error("File is not a valid image.");
      if (file.size > MAX_FILE_SIZE)
        return toast.error("Image size cannot exceed 1 MB.");

      form.setValue("image", file);
      form.setValue("fileName", file.name);
    } else {
      form.setValue("image", undefined);
      form.setValue("fileName", undefined);
    }
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

              <FormField
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

                              if (inputRef.current) inputRef.current.value = "";
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
                disabled={isPending}
                type="submit"
                size="lg"
                className="relative"
              >
                <span className={cn(isPending && "invisible")}>
                  Create workspace
                </span>
                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
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
