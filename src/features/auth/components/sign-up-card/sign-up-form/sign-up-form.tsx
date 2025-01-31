"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";

import { signUpSchema, type SignUpSchema } from "@/features/auth/schemas";
import { useSignUp } from "@/features/auth/api/use-sign-up";

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

export function SignUpForm() {
  const { mutate, isPending } = useSignUp();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const togglePasswordVisibility = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    setShouldShowPassword((prev) => !prev);
  };

  const submit = async (data: SignUpSchema) => {
    mutate({ json: data });
  };

  return (
    <Form {...form}>
      <form
        name="Sign up form"
        onSubmit={form.handleSubmit(submit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormDescription hidden>Name input</FormDescription>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type="text"
                  placeholder="Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {shouldShowPassword ? (
                    <>
                      <VisuallyHidden>Show password</VisuallyHidden>
                      <EyeOff />
                    </>
                  ) : (
                    <>
                      <VisuallyHidden>Hide password</VisuallyHidden>
                      <Eye />
                    </>
                  )}
                </Button>
              </div>

              <FormMessage>
                {
                  "Password must have a minimum of 8 characters, at least one uppercase and lowercase character, at least one digit and special character."
                }
              </FormMessage>
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

        <Button disabled={isPending} className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
