import { http, HttpResponse } from "msw";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/invites`;

export const success = http.post<{ id: string }, { userIds: string[] }>(
  API_ENDPOINT,
  async ({ request }) => {
    const { userIds } = await request.json();

    const res = {
      members: userIds.map((id) => ({ id })),
    };

    return HttpResponse.json(res, { status: 200 });
  },
);
