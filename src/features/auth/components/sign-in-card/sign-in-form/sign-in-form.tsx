"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Link from "next/link";

import { signInSchema, type SignInSchema } from "@/features/auth/schemas";
import { useSignIn } from "@/features/auth/api/use-sign-in";

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
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/shared/submit-button";

export function SignInForm() {
  const { mutate, isPending } = useSignIn();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  const togglePasswordVisibility = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    setShouldShowPassword((prev) => !prev);
  };

  const submit = async (data: SignInSchema) => {
    mutate({ json: data });
  };

  return (
    <Form {...form}>
      <form
        name="Sign in form"
        onSubmit={form.handleSubmit(submit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription hidden>Email input</FormDescription>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type="email"
                  placeholder="your.email@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormDescription hidden>Password input</FormDescription>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type={shouldShowPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pr-9"
                />
              </FormControl>

              <div className="absolute right-2 top-9">
                <Button
                  variant={"ghost"}
                  className="flex h-7 w-7 items-center justify-center p-0"
                  onClick={togglePasswordVisibility}
                  data-testid="toggle-password-visibility"
                >
                  <VisuallyHidden.Root>
                    {shouldShowPassword ? "Hide password" : "Show password"}
                  </VisuallyHidden.Root>
                  {shouldShowPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>

              <FormMessage />
              <Button className="font-normal" size="sm" variant="ghost" asChild>
                <Link href="/reset-password">Forgot Password?</Link>
              </Button>
            </FormItem>
          )}
        />

        <SubmitButton isPending={isPending} className="w-full">
          Sign In
        </SubmitButton>
      </form>
    </Form>
  );
}
