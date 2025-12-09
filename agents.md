# Agents Guide

Project: Firefox content-script extension that syncs the YouTube watch URL `t` parameter with the current playback time.

Key points
- Target: `*.youtube.com` watch pages; script runs at `document_idle`.
- Behavior: Polls for the main video, listens to time/seek/play, throttles updates (~1s) via `history.replaceState`.
- Navigation: Hooks YouTube SPA events and patched history methods to reattach on URL changes.
- Skips: Live/shorts (non-finite durations) are ignored.

Dev notes
- Main logic lives in `src/content.js`; adjust `MIN_UPDATE_INTERVAL_MS` for granularity.
- Manifest is `manifest_version: 3` with Firefox `browser_specific_settings` id placeholder.
- Load for testing via `about:debugging` → "Load Temporary Add-on…" → select `manifest.json`.
