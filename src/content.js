const MIN_UPDATE_INTERVAL_MS = 1000;
let currentVideo = null;
let lastUpdateTimestamp = 0;
let lastAppliedSeconds = null;
let videoCheckInterval = null;
let navigationListenerSetup = false;

const isWatchPage = () => window.location.pathname === "/watch";

const parseSeconds = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const updateUrlTimeParam = (seconds) => {
  const roundedSeconds = Math.max(0, Math.floor(seconds));
  if (roundedSeconds === lastAppliedSeconds) return;

  const url = new URL(window.location.href);
  const existing = parseSeconds(url.searchParams.get("t"));
  if (existing === roundedSeconds) {
    lastAppliedSeconds = roundedSeconds;
    return;
  }

  url.searchParams.set("t", String(roundedSeconds));
  history.replaceState(history.state, "", url.toString());
  lastAppliedSeconds = roundedSeconds;
};

const handleTimeUpdate = () => {
  if (!currentVideo || !isWatchPage()) return;

  const now = performance.now();
  if (now - lastUpdateTimestamp < MIN_UPDATE_INTERVAL_MS) return;
  lastUpdateTimestamp = now;

  if (!Number.isFinite(currentVideo.duration) || currentVideo.duration <= 0) return;
  updateUrlTimeParam(currentVideo.currentTime);
};

const detachVideoListeners = () => {
  if (!currentVideo) return;
  currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
  currentVideo.removeEventListener("seeked", handleTimeUpdate);
  currentVideo.removeEventListener("play", handleTimeUpdate);
  currentVideo = null;
};

const attachVideoListeners = () => {
  const video = document.querySelector("video.html5-main-video");
  if (!video || video === currentVideo) return;

  detachVideoListeners();
  currentVideo = video;
  currentVideo.addEventListener("timeupdate", handleTimeUpdate);
  currentVideo.addEventListener("seeked", handleTimeUpdate);
  currentVideo.addEventListener("play", handleTimeUpdate);
};

const startVideoPolling = () => {
  if (videoCheckInterval) return;

  videoCheckInterval = setInterval(() => {
    if (!isWatchPage()) {
      detachVideoListeners();
      return;
    }
    attachVideoListeners();
  }, 500);
};

const resetStateForNavigation = () => {
  lastAppliedSeconds = parseSeconds(new URL(window.location.href).searchParams.get("t"));
  lastUpdateTimestamp = 0;
  detachVideoListeners();
  attachVideoListeners();
};

const setupNavigationListeners = () => {
  if (navigationListenerSetup) return;
  navigationListenerSetup = true;

  const notifyNavigation = () => resetStateForNavigation();

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  window.addEventListener("yt-navigate-finish", notifyNavigation);
  // YouTube uses SPA navigation; fire our sync reset when the URL changes.
  window.addEventListener("yt-page-data-updated", notifyNavigation);
  window.addEventListener("popstate", notifyNavigation);
  window.addEventListener("locationchange", notifyNavigation);
};

const init = () => {
  if (!window.location.hostname.includes("youtube.com")) return;
  resetStateForNavigation();
  setupNavigationListeners();
  startVideoPolling();
};

init();
