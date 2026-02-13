# Shastrarthi Dashboard V1 Simplification - Task Breakdown

This document breaks down the implementation plan into 85 specific, actionable tasks organized by phases.

## Overview

The Dashboard V1 simplification focuses on:
- Chat as the central experience
- Integrated Guru personas with configurable prompts
- Notes side panel
- Merged discovery
- Streamlined sidebar

---

## Phase 1: Core Fixes & Configuration (7 tasks)

### Task 1.1: Fix Gemini Model Error

**File:** [`shastrarthi/lib/learnlm.ts`](shastrarthi/lib/learnlm.ts:1)

**Action:** Update `GEMINI_API_URL` constant
- Change `gemini-2.0-flash-exp` → `gemini-2.0-flash`

**Verification:**
- Test the chat API route to ensure model responds correctly
- No model errors should appear in console

---

### Task 1.2-1.7: Update Guru Persona Configuration

**File:** [`shastrarthi/lib/config/prompts.ts`](shastrarthi/lib/config/prompts.ts:1)

**Action 1.2:** Add `masterPrompt` field to `GuruPersona` interface
```typescript
interface GuruPersona {
  key: string;
  name: string;
  icon: string;
  masterPrompt: string;   // NEW: configurable personality prompt
  promptConfigId: string;
}
```

**Action 1.3:** Add master prompts for each persona
- `default` (Swami Vivekananda): Modern relevance, practical ethics, Sanskrit etymology
- `yoga` (Shri Krishna): Gītā teacher, Kriya Yoga, action & devotion
- `advaita` (Ramana Maharshi): Self-inquiry, "return to the I"
- `tantra` (Abhinavagupta): Kashmir Śaiva Recognition, world-affirming psychology

**Action 1.4:** Remove deprecated entries
- Remove `agentEtymology`
- Remove `agentSanatan`

**File:** [`shastrarthi/app/api/chat/route.ts`](shastrarthi/app/api/chat/route.ts:1)

**Action 1.5:** Inject `masterPrompt` into system instructions
- When building the system prompt, concatenate the persona's `masterPrompt` with the existing prompt config

**Action 1.6:** Update `AGENT_PROMPT_CONFIG_IDS` mapping
- Map to new persona keys: `default`, `yoga`, `advaita`, `tantra`

**Action 1.7:** Test API with each persona
- Verify each persona responds in character

---

## Phase 2: Navigation & Layout Simplification (11 tasks)

### Task 2.1-2.2: Update Navigation Configuration

**File:** [`shastrarthi/lib/config/nav.ts`](shastrarthi/lib/config/nav.ts:1)

**Action 2.1:** Reduce to 5 items
```typescript
export const appNavItems = [
  { label: 'Home', href: '/app', icon: Home },
  { label: 'My Notes', href: '/app/notes', icon: StickyNote },
  { label: 'My Library', href: '/app/library', icon: Library },
  { label: 'Shastra Discovery', href: '/app/discover', icon: Search },
  { label: 'Ancient History', href: '/history', icon: Library },
];
```

**Action 2.2:** Verify icon imports are correct

---

### Task 2.3-2.5: Simplify TopBar Component

**File:** [`shastrarthi/components/app/TopBar.tsx`](shastrarthi/components/app/TopBar.tsx:1)

**Action 2.3:** Remove Bell icon
- Remove notification-related code and imports

**Action 2.4:** Remove CircleUserRound icon
- Remove profile-related code and imports

**Action 2.5:** Keep only Breadcrumb and Pricing link
- Ensure remaining elements render correctly

**Action 2.6:** Test TopBar rendering
- Verify no console errors
- Check layout integrity

---

### Task 2.7-2.11: Update Sidebar Component

**File:** [`shastrarthi/components/app/Sidebar.tsx`](shastrarthi/components/app/Sidebar.tsx:1)

**Action 2.7:** Rename "Recent Chats" → "Chat History"
- Update the section label

**Action 2.8:** Create expandable account menu in footer
- User avatar with initials
- User name and email (clickable to expand)
- Popover menu on click

**Action 2.9:** Add popover menu options
- My Account
- Settings
- Help
- Log out

**Action 2.10:** Add "Upgrade plan" placeholder
- For future pricing feature

**Action 2.11:** Test functionality
- Verify navigation works
- Test account menu expand/collapse
- Verify all menu items work

---

## Phase 3: Chat Interface Overhaul (24 tasks)

### Task 3.1-3.6: Create New Chat Welcome Component

**File:** [`shastrarthi/components/chat/NewChatWelcome.tsx`](shastrarthi/components/chat/NewChatWelcome.tsx:1) (NEW)

**Action 3.1:** Create component structure
```typescript
export default function NewChatWelcome({ onPromptSelect }: Props) {
  // Centered hero section
  // 2×3 use-case cards
  // Clean chat input below
}
```

**Action 3.2:** Add 6 use-case cards with icons
- 📖 Study Shastras — Deep-dive into ancient texts
- ✨ Simplify & Translate — Simplify concepts or translate passages
- ⚡ Extract Insights — Extract themes and relationships
- 🧘 Ask a Guru — Chat with a specialized guru persona
- 🔍 Search Texts — Search across the Shastra corpus
- 🧭 Explore Topics — Browse traditions and concepts

**Action 3.3:** Implement click handlers
- Each card should pre-populate a prompt or open a flow
- Use `onPromptSelect` callback

**Action 3.4:** Add clean chat input below cards
- Use existing ChatInput component or create simplified version

**Action 3.5:** Style to match Script.io reference
- Centered layout
- Clean, minimal design
- Colored icons for cards

**Action 3.6:** Test component
- Verify all cards are clickable
- Test prompt pre-population

---

### Task 3.7-3.12: Create Guru Selector Component

**File:** [`shastrarthi/components/chat/GuruSelector.tsx`](shastrarthi/components/chat/GuruSelector.tsx:1) (NEW)

**Action 3.7:** Create dropdown component structure
```typescript
export default function GuruSelector({ selectedPersona, onSelect }: Props) {
  // Dropdown with persona avatars
  // Visual indicator for selected
}
```

**Action 3.8:** Add persona avatars with emoji icons
- 🙏 Swami Vivekananda (default)
- 🎯 Shri Krishna
- 🕉️ Ramana Maharshi
- 🔱 Abhinavagupta

**Action 3.9:** Implement persona selection state
- Use `onSelect` callback
- Update parent state

**Action 3.10:** Add visual indicator for selected
- Highlight current persona
- Show checkmark or border

**Action 3.11:** Test dropdown functionality
- Verify expand/collapse
- Test persona switching

---

### Task 3.13-3.19: Update Chat Interface Component

**File:** [`shastrarthi/components/chat/ChatInterface.tsx`](shastrarthi/components/chat/ChatInterface.tsx:1)

**Action 3.13:** Import and integrate `NewChatWelcome`
- Show when `messages.length === 0`

**Action 3.14:** Integrate `GuruSelector` in header
- Place in chat header area

**Action 3.15:** Remove Share button
- Remove from action bar

**Action 3.16:** Remove Bookmark button
- Remove from action bar

**Action 3.17:** Remove MoreHorizontal button
- Remove from action bar

**Action 3.18:** Keep Download button
- Ensure it works

**Action 3.19:** Keep Notes toggle
- Connect to NotesPanel

**Action 3.20:** Wrap in split-panel layout
- Use resizable panel pattern
- Left: NotesPanel (toggleable)
- Right: Chat

**Action 3.21:** Test chat interface
- Test with no messages (shows welcome)
- Test with messages (shows chat)
- Test panel toggle

---

### Task 3.22-3.24: Simplify Chat Input Component

**File:** [`shastrarthi/components/chat/ChatInput.tsx`](shastrarthi/components/chat/ChatInput.tsx:1)

**Action 3.22:** Remove `+` button
- Remove from toolbar

**Action 3.23:** Remove `Auto` button
- Remove from toolbar

**Action 3.24:** Remove `Connect Apps` button
- Remove from toolbar

**Action 3.25:** Keep only textarea and send button
- Clean, minimal input

**Action 3.26:** Test input functionality
- Verify typing works
- Verify send works

---

### Task 3.27-3.30: Update Message Bubble Component

**File:** [`shastrarthi/components/chat/MessageBubble.tsx`](shastrarthi/components/chat/MessageBubble.tsx:1)

**Action 3.27:** Add markdown rendering for assistant messages
- Use `react-markdown` or similar
- Apply styling

**Action 3.28:** Add "Save to Notes" action button
- Only on assistant messages
- Connect to notes system

**Action 3.29:** Test markdown rendering
- Verify code blocks render
- Verify lists render
- Verify formatting works

**Action 3.30:** Test notes save action
- Verify content is saved correctly

---

### Task 3.31-3.32: Update App Home Page

**File:** [`shastrarthi/app/(app)/app/page.tsx`](shastrarthi/app/(app)/app/page.tsx:1)

**Action 3.31:** Replace dashboard with ChatInterface
- Import ChatInterface
- Replace existing content

**Action 3.32:** Verify home page loads
- Test navigation to /app
- Verify chat interface renders

---

## Phase 4: Notes System Implementation (16 tasks)

### Task 4.1-4.7: Create Notes Panel Component

**File:** [`shastrarthi/components/chat/NotesPanel.tsx`](shastrarthi/components/chat/NotesPanel.tsx:1) (NEW)

**Action 4.1:** Create component structure
```typescript
export default function NotesPanel({ threadId, isOpen, onClose }: Props) {
  // Left-side split-panel
  // Rich markdown editor
  // Notes list
}
```

**Action 4.2:** Install `@uiw/react-md-editor`
```bash
npm install @uiw/react-md-editor
```

**Action 4.3:** Integrate markdown editor
- Add title input field
- Add content editor

**Action 4.4:** Implement save functionality
- Save to `notebooks` table
- Include `thread_id` association

**Action 4.5:** Add notes list
- List existing notes for current thread
- Show title and preview

**Action 4.6:** Implement toggle functionality
- Show/hide panel
- Animate transitions

**Action 4.7:** Test notes functionality
- Create new note
- Edit existing note
- Save note
- List notes

---

### Task 4.8-4.11: Update Notebooks API

**File:** [`shastrarthi/app/api/notebooks/route.ts`](shastrarthi/app/api/notebooks/route.ts:1)

**Action 4.8:** Add `thread_id` to query params
- Filter notes by thread_id

**File:** [`shastrarthi/app/api/notebooks/[id]/route.ts`](shastrarthi/app/api/notebooks/[id]/route.ts:1)

**Action 4.9:** Support thread association
- Allow updating thread_id
- Return thread_id in response

**Action 4.10:** Test API endpoints
- Test GET with thread_id filter
- Test POST with thread_id
- Test PATCH with thread_id

---

### Task 4.11-4.16: Create Notes Page

**File:** [`shastrarthi/app/(app)/app/notes/page.tsx`](shastrarthi/app/(app)/app/notes/page.tsx:1) (NEW)

**Action 4.11:** Create page structure
```typescript
export default function NotesPage() {
  // List all user notes
  // Search/filter
  // Click to edit
}
```

**Action 4.12:** Implement list view
- Show title
- Show preview
- Show date

**Action 4.13:** Add click-to-open/edit
- Navigate to edit view
- Or open in modal

**Action 4.14:** Add search functionality
- Filter by title/content

**Action 4.15:** Add filter options
- Filter by date
- Filter by thread

**Action 4.16:** Test notes page
- Verify list renders
- Test search
- Test filters
- Test edit navigation

---

## Phase 5: Shastra Discovery Enhancement (4 tasks)

### Task 5.1-5.4: Update Discovery Page

**File:** [`shastrarthi/app/(app)/app/discover/page.tsx`](shastrarthi/app/(app)/app/discover/page.tsx:1)

**Action 5.1:** Rename "Text Discovery" → "Shastra Discovery"
- Update page title

**Action 5.2:** Add topics grid below search bar
- Fetch topics from API
- Display in grid layout

**Action 5.3:** Ensure topics grid displays properly
- Test responsive layout
- Verify styling

**Action 5.4:** Test discovery page
- Test search functionality
- Test topics grid
- Verify no model errors

---

## Phase 6: Testing & Verification (17 tasks)

### Task 6.1-6.7: Update Automated Tests

**Action 6.1:** Update `Sidebar.test.tsx`
- Test new 5-item navigation
- Test account menu

**Action 6.2:** Adapt `gallery-agents.test.tsx` → test `GuruSelector`
- Test persona selection
- Test dropdown

**Action 6.3:** Add tests for `NewChatWelcome`
- Test card rendering
- Test click handlers

**Action 6.4:** Add tests for `NotesPanel`
- Test editor
- Test save functionality

**Action 6.5:** Run full test suite
```bash
cd shastrarthi && npm test
```

---

### Task 6.6-6.22: Manual Browser Verification

**Action 6.6:** Verify sidebar shows 5 nav items
- Home, My Notes, My Library, Shastra Discovery, Ancient History

**Action 6.7:** Verify Chat History section
- Renamed from "Recent Chats"

**Action 6.8:** Verify account menu at bottom
- User avatar, name, email
- Popover with options

**Action 6.9:** Verify TopBar has no bell/user icons
- Only breadcrumb + pricing

**Action 6.10:** Verify home page shows chat
- Script.io-style welcome
- 2×3 cards + clean input

**Action 6.11:** Test chat streaming
- Send message
- Verify streaming response

**Action 6.12:** Test guru selector
- Verify dropdown opens
- Test persona switching
- Verify avatar icons

**Action 6.13:** Verify each guru persona responds in character
- Test each persona
- Check voice/personality

**Action 6.14:** Test notes panel
- Verify opens as left panel
- Test toggle

**Action 6.15:** Test save/list notes
- Create note
- Verify it appears in list

**Action 6.16:** Verify My Notes page
- Lists all notes
- Search works

**Action 6.17:** Verify Shastra Discovery
- Search + topics grid
- No model errors

**Action 6.18:** Verify Ancient History
- Accessible from sidebar
- Renders correctly

---

## Phase 7: Code Cleanup & Documentation (8 tasks)

### Task 7.1-7.2: Remove Unused Routes

**Action 7.1:** Remove from navigation
- `/app/shastras`
- `/app/gallery`
- `/app/writer`
- `/app/simplifier`
- `/app/extract`
- `/app/topics`
- `/app/references`

**Note:** Files can remain, just remove from nav config

**Action 7.2:** Verify removed routes
- Not accessible via sidebar
- Direct URLs still work (optional)

---

### Task 7.3-7.8: Update Documentation

**Action 7.3:** Update navigation structure docs
- Document new 5-item nav

**Action 7.4:** Document guru persona system
- Explain master prompts
- List each persona's characteristics

**Action 7.5:** Document notes panel integration
- Explain split-panel layout
- Document thread association

**Action 7.6:** Document API changes
- Notebooks API with thread_id
- Chat API with masterPrompt injection

---

## Dependencies & Execution Order

### Critical Path (must be done in order):
1. Phase 1 (Core fixes) - Foundation for everything
2. Phase 2 (Navigation) - Before UI changes
3. Phase 3 (Chat) - Core feature
4. Phase 4 (Notes) - Depends on chat structure
5. Phase 5 (Discovery) - Independent
6. Phase 6 (Testing) - After all features
7. Phase 7 (Cleanup) - After verification

### Parallelizable Tasks:
- Tasks within each phase can often be done in parallel
- Phase 5 (Discovery) is independent and can be done anytime after Phase 1
- Tests can be written alongside feature implementation

---

## Agent Execution Guidelines

### For Code Mode Agents:
1. **Read existing files first** - Understand current implementation before modifying
2. **Make surgical changes** - Use apply_diff for targeted edits
3. **Test incrementally** - Verify each change works before moving to next
4. **Follow existing patterns** - Match code style and conventions

### For Debug Mode Agents:
1. **Add logging** - When troubleshooting, add console.log statements
2. **Test edge cases** - Verify behavior with empty states, errors, etc.
3. **Check browser console** - Look for JavaScript errors
4. **Verify network requests** - Check API calls in DevTools

### For Testing:
1. **Run tests after each phase** - Catch issues early
2. **Manual verification checklist** - Go through all verification items
3. **Document issues found** - Create bug reports if needed

---

## Success Criteria

✅ All 85 tasks completed
✅ All automated tests passing
✅ All manual verification items confirmed
✅ No console errors
✅ No model errors in discovery
✅ All personas respond in character
✅ Notes system fully functional
✅ Navigation simplified to 5 items
✅ Chat is central experience on home page
