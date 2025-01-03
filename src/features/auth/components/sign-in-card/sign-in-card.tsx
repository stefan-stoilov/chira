import { FaGithub, FaGoogle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./sign-in-form";

export function SignInCard() {
  return (
    <Card className="h-full w-full border-none bg-muted shadow-none md:w-[500px]">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">{"Welcome back!"}</CardTitle>
      </CardHeader>

      <div className="mb-7 px-7">
        <Separator className="bg-foreground" />
      </div>

      <CardContent>
        <SignInForm />
      </CardContent>

      <div className="mb-7 px-7">
        <Separator className="bg-foreground" />
      </div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button variant={"outline"} size={"lg"} className="w-full">
          <FaGoogle /> Sign In with Google
        </Button>
        <Button variant={"outline"} size={"lg"} className="w-full">
          <FaGithub /> Sign In with GitHub
        </Button>
      </CardContent>
    </Card>
  );
}
