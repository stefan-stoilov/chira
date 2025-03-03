import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader } from "../loader";
import { cn } from "@/lib/utils";

export type SubmitButtonProps = {
  isPending: boolean;
  isDirty?: boolean;
  type?: ButtonProps["type"];
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  onClick?: ButtonProps["onClick"];
  className?: ButtonProps["className"];
  loaderClassName?: string;
} & React.PropsWithChildren;

export function SubmitButton({
  isPending,
  isDirty,
  type,
  variant,
  size,
  onClick,
  className,
  loaderClassName,
  children,
}: SubmitButtonProps) {
  return (
    <Button
      disabled={isPending || isDirty === false}
      type={type || "submit"}
      variant={variant || "primary"}
      size={size}
      onClick={onClick}
      className={cn("relative", className)}
    >
      <span className={cn(isPending && "invisible")}>{children}</span>
      {isPending && <VisuallyHidden>Loading</VisuallyHidden>}
      {isPending && (
        <div
          data-testid="loader"
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader className={cn("text-primary-foreground", loaderClassName)} />
        </div>
      )}
    </Button>
  );
}
