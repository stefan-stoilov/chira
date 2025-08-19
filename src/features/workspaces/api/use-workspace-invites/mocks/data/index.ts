import type { InferResponseType } from "hono";
import { getMockIteratedDate } from "@/tests/utils";
import type {
  UseWorkspaceInvitesData,
  WorkspaceInvitesRpc,
} from "../../use-workspace-invites";
import * as http from "@/server/lib/http-status-codes";

const TOTAL_INVITES = 20 * 5 - 5;
const RESULTS_PER_PAGE = 20;
const TOTAL_PAGES = Math.ceil(TOTAL_INVITES / RESULTS_PER_PAGE);

const BASE_TIMESTAMP_STRING = "2025-02-11 14:14:28.038697";

const blueprint = {
  name: "Test User",
  email: "test@user",
};

const INVITES: UseWorkspaceInvitesData["invites"] = Array.from({
  length: TOTAL_INVITES,
}).map((_, i) => ({
  id: `${i}`,
  name: blueprint.name + " " + (i + 1),
  email: `${blueprint.email + i + 1}.com`,
  createdAt: getMockIteratedDate({
    index: i,
    timestamp: BASE_TIMESTAMP_STRING,
    type: i < 5 ? "increment" : "decrement",
  }),
  deletedAt: null,
  acceptedAt: null,
  githubId: null,
}));

export const success = (page: number): UseWorkspaceInvitesData => {
  const currentPage = TOTAL_PAGES < page ? TOTAL_PAGES : page;
  const offset =
    (TOTAL_PAGES < page ? TOTAL_PAGES - 1 : page - 1) * RESULTS_PER_PAGE;

  const invites: UseWorkspaceInvitesData["invites"] = INVITES.slice(
    offset,
    offset + RESULTS_PER_PAGE,
  );

  return {
    invites,
    totalPages: TOTAL_PAGES,
    currentPage,
  };
};
export const successStatus = { status: http.OK };

export const noResults = (page: number): UseWorkspaceInvitesData => ({
  invites: [],
  totalPages: 0,
  currentPage: page,
});

export const error = (
  message?: string,
): InferResponseType<WorkspaceInvitesRpc, 401 | 404 | 422 | 500> => ({
  error: message ?? "Error",
});

export const errorStatus = (status?: 401 | 404 | 422 | 500) => ({
  status: status ?? http.INTERNAL_SERVER_ERROR,
});
