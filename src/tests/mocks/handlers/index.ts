import { HttpResponse, http } from "msw";

import { networkDelay } from "@/tests/utils";

export const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/health-check`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
