---
description: How to verify UI changes — no browser subagent
---

## Standing Instruction: No Browser Subagent for Testing

**Do NOT use the `browser_subagent` tool for testing or verification.**

Instead, verify changes through:
1. **TypeScript compilation** — run `npx tsc --noEmit` to catch type errors
2. **Code review** — read the modified files to confirm logic
3. **Ask the user for screenshots** — if visual confirmation is needed, ask the user to share a screenshot. They are happy to do this.

The user finds the browser subagent playback disruptive.
