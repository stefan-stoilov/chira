import { http, HttpResponse, delay } from "msw";
import { data } from "..";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/invite-code`;

export const success = http.patch<{ id: string }, { remove?: boolean }>(
  API_ENDPOINT,
  async ({ params: { id }, request }) => {
    const { remove } = await request.json();

    if (remove)
      return HttpResponse.json(data.successRemove(id), data.successStatus);

    return HttpResponse.json(data.successUpdate(id), data.successStatus);
  },
);

export const successWithDelay = http.patch<
  { id: string },
  { remove?: boolean }
>(API_ENDPOINT, async ({ params: { id }, request }) => {
  const { remove } = await request.json();
  await delay(2500);

  if (remove)
    return HttpResponse.json(data.successRemove(id), data.successStatus);

  return HttpResponse.json(data.successUpdate(id), data.successStatus);
});

export const loading = http.patch(API_ENDPOINT, async () => {
  await delay("infinite");
});

export const error = http.patch(API_ENDPOINT, () => {
  return HttpResponse.json(
    data.errorInternalServerError,
    data.errorInternalSeverErrorStatus,
  );
});
