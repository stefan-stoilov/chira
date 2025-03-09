import { http, HttpResponse, delay } from "msw";
import { data } from "..";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id`;

export const success = http.delete<{ id: string }>(
  API_ENDPOINT,
  ({ params }) => {
    return HttpResponse.json(data.success(params.id), data.successStatus);
  },
);

export const loading = http.delete<{ id: string }>(
  API_ENDPOINT,
  async ({ params }) => {
    await delay("infinite");
    return HttpResponse.json(data.success(params.id), data.successStatus);
  },
);

export const errorUnauthorized = http.delete<{ id: string }>(
  API_ENDPOINT,
  () => {
    return HttpResponse.json(
      data.errorUnauthorized,
      data.errorUnauthorizedStatus,
    );
  },
);

export const errorNotFound = http.delete<{ id: string }>(API_ENDPOINT, () => {
  return HttpResponse.json(data.errorNotFound, data.errorNotFoundStatus);
});
