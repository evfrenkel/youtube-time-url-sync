# Agents Guide

Project: Firefox add-on that syncs the YouTube watch URL `t` parameter with the current playback time.

Key points
- Target: `*.youtube.com` watch pages; content script runs at `document_idle`.
- Behavior: Does not auto-sync. Clicking the toolbar icon sends a message to the content script to set `t` to the current playback time via `history.replaceState`.
- Navigation: No history patching; relies on the current page URL when the user clicks.
- Skips: Shorts are ignored implicitly because path `/watch` is required; live (DVR) is supported.

Dev notes
- Content script handler is in `src/content.js`; background click handler is `src/background.js`.
- Manifest is `manifest_version: 3` with background.scripts (service workers disabled); uses Gecko id `youtube-time-url-sync@evfrenkel.com`.
- Load for testing via `about:debugging` → "Load Temporary Add-on…" → select `manifest.json`, then click the toolbar icon on a watch page to sync `t`.
