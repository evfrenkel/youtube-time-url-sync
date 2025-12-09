# YouTube Time URL Sync

Firefox extension that lets you manually sync the `t` query parameter in a YouTube watch URL with the current playback time. Click the toolbar icon while on a watch page to update the URL; copying the link will then preserve your position without refreshing the page.

## How it works
- Runs a content script on `youtube.com` watch pages.
- When you click the extension icon, it reads the current playback time of the main video and updates the URL's `t` param in-place via `history.replaceState`.

## Install for development
1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select this folder's `manifest.json`.
4. Navigate to a YouTube watch page, start playback, then click the extension icon to update the `t` param.

## Notes
- Works on standard watch pages, including live streams with DVR. Shorts are ignored.

## License
MIT License. See `LICENSE` for details.
