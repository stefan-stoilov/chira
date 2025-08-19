import { http, HttpResponse } from "msw";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/invites`;

export const success = http.patch<{ id: string }, { userIds: string[] }>(
  API_ENDPOINT,
  async ({ request }) => {
    const { userIds } = await request.json();

    const res = {
      deletedInvites: userIds.map((id) => ({ id })),
    };

    return HttpResponse.json(res, { status: 200 });
  },
);

export const error = http.patch(API_ENDPOINT, () =>
  HttpResponse.json({ error: "Internal server error" }, { status: 500 }),
);
