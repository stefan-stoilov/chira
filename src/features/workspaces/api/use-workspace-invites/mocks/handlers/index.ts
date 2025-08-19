import { http, HttpResponse, delay } from "msw";
import { data } from "..";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/invites`;

export const success = http.get<{ id: string }>(
  API_ENDPOINT,
  async ({ request }) => {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");

    const page = isNaN(Number(pageParam)) ? 1 : Number(pageParam);

    return HttpResponse.json(data.success(page), data.successStatus);
  },
);

export const loading = http.get(API_ENDPOINT, async ({ request }) => {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");

  const page = isNaN(Number(pageParam)) ? 1 : Number(pageParam);

  await delay("infinite");
  return HttpResponse.json(data.success(page), data.successStatus);
});

export const noResults = http.get(API_ENDPOINT, async ({ request }) => {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");

  const page = isNaN(Number(pageParam)) ? 1 : Number(pageParam);

  return HttpResponse.json(data.noResults(page), data.successStatus);
});

export const error = ({
  message,
  status,
}: {
  message?: string;
  status?: 401 | 404 | 422 | 500;
} = {}) =>
  http.get<{ id: string }>(API_ENDPOINT, () => {
    return HttpResponse.json(data.error(message), data.errorStatus(status));
  });
