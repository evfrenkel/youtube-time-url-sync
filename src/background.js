const api = typeof browser !== "undefined" ? browser : chrome;

const isYouTubeWatchUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("youtube.com") && parsed.pathname === "/watch";
  } catch {
    return false;
  }
};

api.action.onClicked.addListener((tab) => {
  if (!tab?.id || !tab.url || !isYouTubeWatchUrl(tab.url)) return;
  api.tabs.sendMessage(tab.id, { type: "SYNC_TIME" });
});
