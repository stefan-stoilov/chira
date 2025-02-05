import { http, HttpResponse, delay } from "msw";
import { env } from "@/env";
import { data } from "..";

const API_ENDPOINT = `${env.NEXT_PUBLIC_APP_URL}/api/auth/current`;

export const get = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.success, { status: 200 });
});

export const loading = http.get(API_ENDPOINT, async () => {
  await delay("infinite");
  return HttpResponse.json(data.success, data.successStatus);
});

export const error = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.error, data.errorStatus);
});
