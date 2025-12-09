# YouTube Time URL Sync

Firefox extension that keeps the `t` query parameter in a YouTube watch URL synced with the current playback time. As you watch or scrub, the URL updates in-place via `history.replaceState` so copying the link preserves your position without refreshing the page.

## How it works
- Runs a content script on `youtube.com` pages.
- Polls for the active `<video>` element and listens for time updates, seeks, and play events.
- Throttles URL updates to once per second and skips live streams (non-finite duration).
- Handles YouTube's single-page navigation by hooking into history and YouTube navigation events.

## Install for development
1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select this folder's `manifest.json`.
4. Navigate to a YouTube watch page and play a video; the URL's `t` param will update as playback progresses.

## Notes
- Works on standard watch pages. Shorts and live streams are ignored because their duration is non-finite.
- URL updates are throttled to reduce history churn; expect ~1s granularity.
