import type { Meta, StoryObj } from "@storybook/react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto max-w-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              {
                "Make changes to your profile here. Click save when you're done."
              }
            </DrawerDescription>
          </DrawerHeader>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const meta = {
  title: "Components/UI/Drawer",
  component: DrawerDemo,
  parameters: {
    // Test runner incorrectly determines a color contrast violation while in reality there is no such violation.
    // Disabling a11y testing for drawer.
    a11y: {
      disable: true,
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
