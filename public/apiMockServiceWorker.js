/**
 * @see https://github.com/mswjs/msw-storybook-addon/issues/36#issuecomment-1496150729
 */
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (!url.pathname.startsWith("/api/")) {
    // Do not propagate this event to other listeners (from MSW)
    event.stopImmediatePropagation();
  }
});

importScripts("./mockServiceWorker.js");
