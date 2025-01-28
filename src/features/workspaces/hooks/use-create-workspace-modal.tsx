import { useCallback } from "react";
import { useQueryState, parseAsBoolean } from "nuqs";

export function useCreateWorkspaceModal() {
  const [isOpen, setIsOpen] = useQueryState(
    "create-workspace",
    parseAsBoolean.withOptions({ clearOnDefault: true }).withDefault(false),
  );

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
  };
}
