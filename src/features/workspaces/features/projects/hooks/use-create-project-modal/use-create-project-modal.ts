import { useCallback } from "react";
import { useQueryState, parseAsBoolean } from "nuqs";

export const CREATE_PROJECT_SEARCH_PARAM = "create-project";

export function useCreateProjectModal() {
  const [isOpen, setIsOpen] = useQueryState(
    CREATE_PROJECT_SEARCH_PARAM,
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
