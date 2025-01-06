"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Link from "next/link";

import { signInSchema, type SignInSchema } from "@/features/auth/schemas";
import { useSignIn } from "@/features/auth/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        role="form"
        onSubmit={form.handleSubmit(submit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <Button
                className="px-0 font-normal"
                size="sm"
                variant="ghost"
                asChild
              >
                <Link href="/reset-password">Forgot Password?</Link>
              </Button>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
