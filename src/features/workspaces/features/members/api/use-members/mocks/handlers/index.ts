import { http, HttpResponse, delay } from "msw";
import * as data from "../data";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/members`;

export const success = (loadTime?: number | "infinite") =>
  http.get<{ id: string }>(API_ENDPOINT, async () => {
    if (loadTime) {
      await delay(loadTime);
    }

    return HttpResponse.json(data.success, data.successStatus);
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
