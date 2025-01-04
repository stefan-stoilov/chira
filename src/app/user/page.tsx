"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useSignOut } from "@/features/auth/api";

function Page() {
  const { data, isLoading } = useCurrentUser();
  const { mutate } = useSignOut();

  return isLoading ? (
    "Loading"
  ) : (
    <div>
      <div>{data?.user?.name}</div>
      <div>
        <Button
          onClick={() => {
            mutate();
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Page;
