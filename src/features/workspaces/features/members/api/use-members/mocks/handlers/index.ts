import { http, HttpResponse, delay } from "msw";
import * as data from "../data";
import type { SuccessDataProps } from "../data";

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/:id/members`;

type SuccessHandlerProps = SuccessDataProps & {
  loadTime?: number | "infinite";
};

export const success = ({ loadTime, firstMember }: SuccessHandlerProps = {}) =>
  http.get<{ id: string }>(API_ENDPOINT, async () => {
    if (loadTime) {
      await delay(loadTime);
    }

    return HttpResponse.json(data.success({ firstMember }), data.successStatus);
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
