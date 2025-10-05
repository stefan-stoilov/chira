import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubmitButton, type SubmitButtonProps } from "../submit-button";

export type SubmitTooltipButtonProps = {
  label: string;
  tooltip: string;
} & Omit<SubmitButtonProps, "children">;

export function SubmitTooltipButton({
  isPending,
  isDirty,
  label,
  tooltip,
  ...props
}: SubmitTooltipButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip open={isPending || isDirty ? false : undefined}>
        <TooltipTrigger asChild disabled={isPending || isDirty}>
          <div>
            <SubmitButton isPending={isPending} isDirty={isDirty} {...props}>
              {label}
            </SubmitButton>
          </div>
        </TooltipTrigger>

        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
