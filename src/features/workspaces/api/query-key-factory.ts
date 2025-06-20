/**
 * Manually declaring the Query Keys s not only error-prone, but it also makes changes
 * harder in the future, for example, if you find out that you'd like to add another
 * level of granularity to your keys.
 *
 * TKDodo's recommendation is to use one Query Key factory per feature. It's just a simple
 * object with entries and functions that will produce query keys, which you can then use
 * in your custom hooks.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 */
export const workspacesKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspacesKeys.all, "list"] as const,
  list: (filters: string) => [...workspacesKeys.lists(), { filters }] as const,
  details: () => [...workspacesKeys.all, "detail"] as const,
  detail: (id: string) => [...workspacesKeys.details(), id] as const,
  invites: ({ id, page = 0 }: { id: string; page: number }) =>
    [...workspacesKeys.detail(id), "invites", page] as const,
};
