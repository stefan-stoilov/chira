"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  signInSchema,
  type SignInSchema,
} from "@/features/auth/schemas/sign-in";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });
  const [validation, setValidation] = useState<{
    status: "idle" | "pending" | "error" | "success";
    message: string;
  }>({
    status: "idle",
    message: "",
  });
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  const togglePasswordVisibility = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.preventDefault();
    setShouldShowPassword((prev) => !prev);
  };

  const submit = async (data: SignInSchema) => {
    setValidation({ status: "pending", message: "" });
    await new Promise(() => {
      setTimeout(() => {}, 2000);
    });
    console.log(data);
    setValidation((prev) => ({ ...prev, status: "success" }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={validation.status === "pending"}
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
                  disabled={validation.status === "pending"}
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
                >
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

        <Button disabled={validation.status === "pending"} className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );
}

export default SignInForm;
