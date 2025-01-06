import { HttpResponse, http } from "msw";

import { env } from "@/env";
import { networkDelay } from "@/tests/utils";

export const handlers = [
  http.get(`${env.NEXT_PUBLIC_APP_URL}/api/health-check`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
