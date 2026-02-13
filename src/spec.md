# Specification

## Summary
**Goal:** Add a real “Publish updated edits” flow so edited Valentine photos/letters can be published to the backend and shown consistently to all visitors across browsers/devices.

**Planned changes:**
- Add backend stable persistence for the currently published ValentineContent, with methods to fetch published content and to publish/overwrite content.
- Restrict publishing to an authorized admin identity (caller principal allowlist) and return clear errors for unauthorized publish attempts.
- Update frontend content loading to use backend-published content as the default base, while continuing to auto-save local draft edits in localStorage.
- Add an Edit Mode “Publish changes” UI action that sends the current draft content to the backend, showing English success/error confirmations and keeping the local draft on failure.
- Add an Edit Mode status indicator showing “Draft (not published)” vs “Published”, plus a one-click action to discard the local draft and reload the latest published content from the backend.

**User-visible outcome:** Editors can publish their updated photos/letters so everyone sees the new version on reload (including in private mode/other devices), while still being able to keep local drafts, see draft vs published status, and reload the published version when needed.
