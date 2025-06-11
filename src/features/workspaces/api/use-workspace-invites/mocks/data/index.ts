import type { UseWorkspaceInvitesData } from "../../use-workspace-invites";
import * as http from "@/server/lib/http-status-codes";

export const success: UseWorkspaceInvitesData = {
  invites: [
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 1",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user1.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 2",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user2.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 3",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user3.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 4",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user4.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 5",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user5.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 6",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user6.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 7",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user7.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 8",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user8.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 9",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user9.com",
    },
    {
      id: "9ee3ba03-7e14-4cc1-a440-9a6477a303f4",
      name: "Test user 10",
      createdAt: "Wed Jun 11 2025",
      githubId: null,
      email: "test@user10.com",
    },
  ],
};
export const successStatus = { status: http.OK };
