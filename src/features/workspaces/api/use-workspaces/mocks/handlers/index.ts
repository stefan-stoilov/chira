import { http, HttpResponse, delay } from "msw";
import { data } from "..";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces`;

export const success = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.success, data.successStatus);
});

export const successWithDifferentRoles = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successWithDifferentRoles, data.successStatus);
});

export const successExtended = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successExtended, data.successStatus);
});

export const successZeroWorkspaces = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successZeroWorkspaces, data.successStatus);
});

export const loading = http.get(API_ENDPOINT, async () => {
  await delay("infinite");
  return HttpResponse.json(data.success, data.successStatus);
});

export const error = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.error, data.errorStatus);
});
