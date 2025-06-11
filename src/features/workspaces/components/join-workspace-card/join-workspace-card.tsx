"use client";
import { useMemo } from "react";

import { useJoinSearchParams } from "../../hooks/use-join-search-params";
import { useJoinWorkspace } from "../../api/use-join-workspace";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SubmitButton } from "@/components/shared/submit-button";
import { ReplaceButton } from "@/components/shared/replace-button";
import { Separator } from "@/components/ui/separator";
import { H4, Small } from "@/components/ui/typography";

export function JoinWorkspaceCard() {
  const { data, errors, isError } = useJoinSearchParams();

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        <CardTitle className="mt-7">Join workspace</CardTitle>

        <Separator />

        {isError ? (
          <>
            <H4 className="text-center">
              {"The invite link in use has the following error(s):"}
            </H4>

            <ul className="flex list-decimal flex-col gap-2 text-destructive">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>

            <Separator />

            <Small>
              Please ensure that you are using a correct invite link to join
              workspace.
            </Small>

            <BackToDashboard />
          </>
        ) : (
          <>
            <Label htmlFor="invite code" className="sr-only">
              Invite code
            </Label>
            <InputOTP
              id="invite code"
              value={data.code}
              disabled
              maxLength={6}
              className="disabled:cursor-default"
              containerClassName="flex-wrap md:flex-nowrap has-[:disabled]:opacity-100"
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

            <JoinRequest {...data} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BackToDashboard() {
  return <ReplaceButton path="/dashboard">Back to dashboard</ReplaceButton>;
}

type JoinRequestProps = {
  id: string;
  code: string;
};

function JoinRequest({ id, code }: JoinRequestProps) {
  const { mutate, isPending, error, isError, isSuccess } = useJoinWorkspace();
  const backToDashboard = useMemo(() => <BackToDashboard />, []);

  return (
    <>
      {!(isError || isSuccess) && (
        <SubmitButton
          type="button"
          isPending={isPending}
          onClick={() => {
            mutate({ param: { id }, json: { inviteCode: code } });
          }}
        >
          Send request
        </SubmitButton>
      )}

      {isError && (
        <>
          <Separator />

          <p data-testid="error-message" className="text-destructive">
            {error?.message}
          </p>

          {backToDashboard}
        </>
      )}

      {isSuccess && (
        <>
          <Separator />

          <p data-testid="success-message" className="text-success">
            Join request sent successfully.
          </p>

          {backToDashboard}
        </>
      )}
    </>
  );
}
