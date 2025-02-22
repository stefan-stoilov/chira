import { http, HttpResponse, delay } from "msw";
import { env } from "@/env";
import { data } from "..";

const API_ENDPOINT = `${env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id`;

export const success = http.patch<{ id: string }, { name: string }>(
  API_ENDPOINT,
  async ({ params, request }) => {
    const { name } = await request.json();

    return HttpResponse.json(
      data.success({ id: params.id, name }),
      data.successStatus,
    );
  },
);

export const loading = http.patch<{ id: string }, { name: string }>(
  API_ENDPOINT,
  async ({ params }) => {
    await delay("infinite");
    return HttpResponse.json(
      data.success({ id: params.id, name: "New Name" }),
      data.successStatus,
    );
  },
);

export const errorUnauthorized = http.patch(API_ENDPOINT, () => {
  return HttpResponse.json(
    data.errorUnauthorized,
    data.errorUnauthorizedStatus,
  );
});

export const errorNotFound = http.patch(API_ENDPOINT, () => {
  return HttpResponse.json(data.errorNotFound, data.errorNotFoundStatus);
});
