import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster } from "./sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

function ToasterDemo({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

function ShowToastButton(props: ButtonProps) {
  return <Button {...props} />;
}

const meta = {
  title: "Components/UI/Toaster",
  component: ToasterDemo,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ToasterDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <ShowToastButton onClick={() => toast("Event has been created")}>
        Show Toast
      </ShowToastButton>
    ),
  },
};

export const Description: Story = {
  args: {
    children: (
      <ShowToastButton
        onClick={() =>
          toast.message("Event has been created", {
            description: "Monday, January 3rd at 6:00pm",
          })
        }
      >
        Description Toast
      </ShowToastButton>
    ),
  },
};

export const Success: Story = {
  args: {
    children: (
      <ShowToastButton onClick={() => toast.success("Event has been created")}>
        Success Toast
      </ShowToastButton>
    ),
  },
};

export const Info: Story = {
  args: {
    children: (
      <ShowToastButton
        onClick={() =>
          toast.info("Be at the area 10 minutes before the event time")
        }
      >
        Info Toast
      </ShowToastButton>
    ),
  },
};

export const Warning: Story = {
  args: {
    children: (
      <ShowToastButton
        onClick={() =>
          toast.warning("Event start time cannot be earlier than 8am")
        }
      >
        Warning Toast
      </ShowToastButton>
    ),
  },
};

export const Error: Story = {
  args: {
    children: (
      <ShowToastButton
        onClick={() => toast.error("Event has not been created")}
      >
        Error Toast
      </ShowToastButton>
    ),
  },
};

export const Action: Story = {
  args: {
    children: (
      <ShowToastButton
        onClick={() =>
          toast("Event has been created", {
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Action Toast
      </ShowToastButton>
    ),
  },
};
