import { delay } from "msw";

export function networkDelay(delayTime = 500) {
  return delay(delayTime);
}
