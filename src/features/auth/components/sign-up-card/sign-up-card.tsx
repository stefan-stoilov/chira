import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "./sign-up-form";

export function SignUpCard() {
  return (
    <Card className="h-full w-full border-none bg-muted shadow-none md:w-[500px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>

        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="#" className={typography.link}>
            Terms {"&"} Conditions
          </Link>
          .
        </CardDescription>
      </CardHeader>

      <div className="mb-7 px-7">
        <Separator className="bg-foreground" />
      </div>

      <CardContent>
        <SignUpForm />
      </CardContent>

      <div className="mb-7 px-7">
        <Separator className="bg-foreground" />
      </div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button variant={"outline"} size={"lg"} className="w-full">
          <FaGoogle /> Sign Up with Google
        </Button>
        <Button variant={"outline"} size={"lg"} className="w-full">
          <FaGithub /> Sign Up with GitHub
        </Button>
      </CardContent>
    </Card>
  );
}
