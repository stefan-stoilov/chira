import { http, HttpResponse, delay } from "msw";
import { data } from "..";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/join`;

export const success = http.post(API_ENDPOINT, () => {
  return HttpResponse.json(data.success("Test Workspace"), data.successStatus);
});

export const successWithDelay = http.post(API_ENDPOINT, async () => {
  await delay(2500);
  return HttpResponse.json(data.success("Test Workspace"), data.successStatus);
});

export const loading = http.post(API_ENDPOINT, async () => {
  await delay("infinite");

  return HttpResponse.json(data.success("Test Workspace"), data.successStatus);
});

export const errorAlreadyMember = http.post(API_ENDPOINT, () => {
  return HttpResponse.json(
    data.errorAlreadyMember("Test Workspace"),
    data.errorAlreadyMemberStatus,
  );
});

export const errorNotFound = http.post(API_ENDPOINT, () => {
  return HttpResponse.json(data.errorNotFound, data.errorNotFoundStatus);
});
