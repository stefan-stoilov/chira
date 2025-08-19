import { http, HttpResponse } from "msw";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/members/:userId/promote`;

export const success = http.patch(API_ENDPOINT, async () => {
  return HttpResponse.json({ success: true }, { status: 200 });
});

export const error = http.patch(API_ENDPOINT, async () => {
  return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
});
