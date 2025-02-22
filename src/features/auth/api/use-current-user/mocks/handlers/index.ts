import { http, HttpResponse, delay } from "msw";
import { env } from "@/env";
import { data } from "..";

const API_ENDPOINT = `${env.NEXT_PUBLIC_APP_URL}/api/auth/user`;

export const success = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.success, data.successStatus);
});

export const loading = http.get(API_ENDPOINT, async () => {
  await delay("infinite");
  return HttpResponse.json(data.success, data.successStatus);
});

export const error = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.error, data.errorStatus);
});
