import type { Meta, StoryObj } from "@storybook/react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Toaster } from "./sonner";

const schema = z.object({
  code: z
    .string()
    .length(6)
    .regex(/^[a-zA-Z0-9]+$/),
});
type Schema = z.infer<typeof schema>;

type InputOTPDemoProps = {
  disabled?: boolean;
};

function InputOTPDemo({ disabled }: InputOTPDemoProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(data: Schema) {
    toast.message(data.code);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-2/3 flex-col items-center space-y-6"
      >
        <FormField
          control={form.control}
          name="code"
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="flex flex-col items-center bg-background">
              <FormLabel className="text-foreground">Enter code</FormLabel>
              <FormControl>
                <InputOTP
                  {...field}
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  containerClassName="flex-wrap md:flex-nowrap"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              <FormDescription>Please enter the code.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={disabled}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

const meta = {
  title: "Components/UI/Input OTP",
  component: InputOTPDemo,
  decorators: (Story) => (
    <>
      <Story />
      <Toaster />
    </>
  ),
} satisfies Meta<typeof InputOTPDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
