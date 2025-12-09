const isWatchPage = () => window.location.pathname === "/watch";
const nativeReplaceState = History.prototype.replaceState;

const syncTimeToUrl = () => {
  if (!isWatchPage()) return;
  const video = document.querySelector("video.html5-main-video");
  if (!video) return;
  if (!Number.isFinite(video.currentTime) || video.currentTime < 0) return;

  const seconds = Math.max(0, Math.floor(video.currentTime));
  const url = new URL(window.location.href);
  const existing = parseInt(url.searchParams.get("t"), 10);
  if (Number.isFinite(existing) && existing === seconds) return;

  url.searchParams.set("t", String(seconds));
  nativeReplaceState.call(history, history.state, "", `${url.pathname}${url.search}${url.hash}`);
};

const runtime = typeof browser !== "undefined" ? browser.runtime : chrome?.runtime;
if (runtime) {
  runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "SYNC_TIME") {
      syncTimeToUrl();
      sendResponse?.({ ok: true });
    }
  });
}
