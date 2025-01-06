import { env } from "@/env";

export async function enableMocking() {
  if (env.NEXT_PUBLIC_ENABLE_API_MOCKING) {
    const { worker } = await import("./browser");
    return worker.start();
  }
}
