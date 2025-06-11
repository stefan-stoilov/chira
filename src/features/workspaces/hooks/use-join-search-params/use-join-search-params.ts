import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { z } from "zod";

export const INVITE_LINK_SEARCH_PARAMS = {
  code: "code",
  id: "id",
} as const;

export const INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES = {
  [INVITE_LINK_SEARCH_PARAMS.code]: {
    notProvided: "Invite code not provided.",
    invalid: "Invalid invite code provided.",
  },
  [INVITE_LINK_SEARCH_PARAMS.id]: {
    notProvided: "Workspace ID not provided.",
    invalid: "Invalid workspace ID provided.",
  },
} as const;

const searchParamsSchema = z.object({
  code: z
    .string({
      message: INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.code.notProvided,
    })
    .length(6, {
      message: INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.code.invalid,
    }),
  id: z
    .string({
      message: INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.id.notProvided,
    })
    .uuid({ message: INVITE_LINK_SEARCH_PARAMS_ERROR_MESSAGES.id.invalid }),
});

type UseJoinSearchParamsResult =
  | {
      data: {
        code: string;
        id: string;
      };
      isSuccess: true;
      errors: undefined;
      isError: false;
    }
  | {
      data: undefined;
      isSuccess: false;
      errors: string[];
      isError: true;
    };

export function useJoinSearchParams(): UseJoinSearchParamsResult {
  const [code] = useQueryState(INVITE_LINK_SEARCH_PARAMS.code);
  const [id] = useQueryState(INVITE_LINK_SEARCH_PARAMS.id);

  const result: UseJoinSearchParamsResult = useMemo(() => {
    const { data, error, success } = searchParamsSchema.safeParse({ code, id });

    if (success) {
      return { data, isSuccess: success, isError: !success, errors: undefined };
    } else {
      const errors = Object.values(error.flatten().fieldErrors).flat();

      return { data, isSuccess: success, isError: !success, errors };
    }
  }, [code, id]);

  return result;
}
