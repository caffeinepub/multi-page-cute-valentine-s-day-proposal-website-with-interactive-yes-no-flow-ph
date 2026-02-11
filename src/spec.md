# Specification

## Summary
**Goal:** Remove the landing page background music UI/audio and make the YES button skip the celebration page to go straight to the final page.

**Planned changes:**
- Remove the background music section from the Landing page so no music controls render and no background `<audio>` element mounts by default.
- Update the proposal YES button navigation flow to bypass the current heart celebration page and navigate directly to the final page route, updating routes/navigation so the celebration page is not reached through normal app use.

**User-visible outcome:** The Landing page shows no music player or background audio, and tapping YES takes the user directly to the final page without an intermediate celebration screen.
