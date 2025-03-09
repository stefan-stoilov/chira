import { http, HttpResponse, delay } from "msw";
import { data } from "..";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/sign-up`;

export const success = http.post(API_ENDPOINT, () => {
  return HttpResponse.json(data.success, data.successStatus);
});

export const loading = http.post(API_ENDPOINT, async () => {
  await delay("infinite");
  return HttpResponse.json(data.success, data.successStatus);
});

export const error = http.post(API_ENDPOINT, () => {
  return HttpResponse.json(data.error, data.errorStatus);
});
