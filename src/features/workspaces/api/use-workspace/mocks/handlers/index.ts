import { http, HttpResponse, delay } from "msw";
import * as data from "../data";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/${data.MOCK_WORKSPACE_ID}`;

export const successUser = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successUser, data.successStatus);
});

export const successAdmin = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successAdmin, data.successStatus);
});

export const successOwner = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successOwner, data.successStatus);
});

export const loading = http.get(API_ENDPOINT, async () => {
  await delay("infinite");
  return HttpResponse.json(data.successUser, data.successStatus);
});

export const error = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.error, data.errorStatus);
});

export const errorNotFound = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.errorNotFound, data.errorNotFoundStatus);
});

export const successUserNoInvite = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successUserNoInvite, data.successStatus);
});

export const successAdminNoInvite = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successAdminNoInvite, data.successStatus);
});

export const successOwnerNoInvite = http.get(API_ENDPOINT, () => {
  return HttpResponse.json(data.successOwnerNoInvite, data.successStatus);
});
