# Twitch Giveaway Assistant

A Chrome browser extension (Manifest V3) that watches Twitch chat while you watch a
stream, detects when a giveaway is running, and lets you know, or enters for you.

Built for a streamer friend who kept missing giveaways while actually watching the stream.

## What it does

- **Reads chat live.** The extension observes the chat container in the page and
  processes messages as they arrive. No Twitch API, no account connection and no token.
  It works with what the page already shows you.
- **Detects giveaways two ways.** A keyword match (configurable list) or a sudden spike
  in message frequency, which is what a chat actually looks like the moment a giveaway
  starts. Either one can trigger.
- **Notifies you.** Desktop notification plus a sound, so you notice even if the stream
  is in a background tab.
- **Optional auto-entry.** If enabled, it sends a fixed message (e.g. `!enter`) to the chat.

## Why a browser extension

The first version was a Node.js bot on Twitch EventSub. It worked, but it needed an
application, an OAuth token and a running process, which is too much setup for someone who just
wants to watch a stream. As an extension it runs inside the tab that is already open,
with no backend, no credentials and nothing to keep alive.

## Tech

- JavaScript, Chrome Extension Manifest V3
- Content script observing chat DOM changes
- Chrome Notifications API
- No build step, no dependencies

## Status

Working and in daily use. Ideas for later: per-channel settings, smarter spike detection,
an entry log.

## Install (development)

1. Clone this repository
2. Open `chrome://extensions` and enable **Developer mode**
3. **Load unpacked** and select the project folder
4. Open a Twitch stream, the extension activates on the chat page

## Note

Some streamers do not want automated giveaway entries. Use the auto-entry option only
where it is allowed.
