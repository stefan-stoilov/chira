import { http, HttpResponse } from "msw";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/members/:userId`;

export const success = http.delete<{ id: string }>(API_ENDPOINT, async () => {
  return HttpResponse.json({ success: true }, { status: 200 });
});

export const error = http.delete<{ id: string }>(API_ENDPOINT, async () => {
  return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
});
