import { useCallback } from "react";
import { useQueryState, parseAsBoolean } from "nuqs";

export const CREATE_WORKSPACE_SEARCH_PARAM = "create-workspace";

export function useCreateWorkspaceModal() {
  const [isOpen, setIsOpen] = useQueryState(
    CREATE_WORKSPACE_SEARCH_PARAM,
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
