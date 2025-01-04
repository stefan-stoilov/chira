import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";

async function Page() {
  return (
    <>
      <main className="pb-40 pt-20">
        <div className="flex flex-col items-center justify-center">
          <div className={"flex flex-col items-center justify-center"}>
            <div className="mb-4 flex items-center rounded-full border bg-amber-100 p-4 uppercase text-amber-700 shadow-sm">
              <Medal className="mr-2 h-6 w-6" />
              No 1 task managment
            </div>
            <h1 className="mb-6 text-center text-3xl text-foreground md:text-6xl">
              Chira helps team move
            </h1>
            <div className="w-fit rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 p-2 px-4 pb-4 text-3xl text-white md:text-6xl">
              work forward.
            </div>
          </div>
          <div
            className={
              "mx-auto mt-4 max-w-xs text-center text-sm text-muted-foreground md:max-w-2xl md:text-xl"
            }
          >
            Collaborate, manage projects, and reach new productivity peaks. From
            high rises to the home office, the way your team works is unique -
            accomplish it all with Chira.
          </div>
          <Button className="mt-6" size="lg" asChild>
            <Link href="/sign-up">Get Chira for free</Link>
          </Button>
        </div>
      </main>
    </>
  );
}

export default Page;
