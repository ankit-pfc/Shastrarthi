# Dashboard V1 Simplification - Agent Quick Start Guide

## Getting Started

### Step 1: Understand Your Assignment

First, identify which phase(s) you're working on:

| Phase | Focus | Tasks | Complexity |
|-------|-------|-------|------------|
| 1 | Core Fixes & Configuration | 7 tasks | Medium |
| 2 | Navigation & Layout | 11 tasks | Low-Medium |
| 3 | Chat Interface | 24 tasks | High |
| 4 | Notes System | 16 tasks | High |
| 5 | Discovery Enhancement | 4 tasks | Low |
| 6 | Testing & Verification | 17 tasks | Medium |
| 7 | Cleanup & Documentation | 8 tasks | Low |

### Step 2: Read the Detailed Breakdown

Open [`dashboard-v1-simplification-breakdown.md`](dashboard-v1-simplification-breakdown.md:1) and find your phase. Each task includes:
- **File path** - What file to modify
- **Action** - What to do
- **Verification** - How to confirm it works

### Step 3: Check Dependencies

Open [`dashboard-v1-dependency-graph.md`](dashboard-v1-dependency-graph.md:1) to see:
- Which tasks must be completed before yours
- Which tasks can be done in parallel with yours

---

## Phase-Specific Quick Starts

### Phase 1: Core Fixes & Configuration

**Files to Read First:**
- [`shastrarthi/lib/learnlm.ts`](shastrarthi/lib/learnlm.ts:1)
- [`shastrarthi/lib/config/prompts.ts`](shastrarthi/lib/config/prompts.ts:1)
- [`shastrarthi/app/api/chat/route.ts`](shastrarthi/app/api/chat/route.ts:1)

**Key Changes:**
1. Update `GEMINI_API_URL` model name
2. Add `masterPrompt` field to `GuruPersona` interface
3. Create master prompts for 4 personas
4. Inject masterPrompt into chat API

**Testing:**
```bash
# Start dev server
cd shastrarthi && npm run dev

# Test chat API with different personas
# Verify no model errors
```

---

### Phase 2: Navigation & Layout

**Files to Read First:**
- [`shastrarthi/lib/config/nav.ts`](shastrarthi/lib/config/nav.ts:1)
- [`shastrarthi/components/app/TopBar.tsx`](shastrarthi/components/app/TopBar.tsx:1)
- [`shastrarthi/components/app/Sidebar.tsx`](shastrarthi/components/app/Sidebar.tsx:1)

**Key Changes:**
1. Reduce nav to 5 items
2. Remove bell/profile icons from TopBar
3. Rename "Recent Chats" → "Chat History"
4. Add expandable account menu

**UI Components Needed:**
- Popover/dropdown for account menu
- Avatar with initials

**Testing:**
```bash
# Verify sidebar shows 5 items
# Test account menu expand/collapse
# Check TopBar has only breadcrumb + pricing
```

---

### Phase 3: Chat Interface

**Files to Read First:**
- [`shastrarthi/components/chat/ChatInterface.tsx`](shastrarthi/components/chat/ChatInterface.tsx:1)
- [`shastrarthi/components/chat/ChatInput.tsx`](shastrarthi/components/chat/ChatInput.tsx:1)
- [`shastrarthi/components/chat/MessageBubble.tsx`](shastrarthi/components/chat/MessageBubble.tsx:1)

**New Components to Create:**
1. `NewChatWelcome.tsx` - Welcome screen with 6 use-case cards
2. `GuruSelector.tsx` - Dropdown with 4 persona options

**Key Changes:**
1. Show welcome when no messages
2. Integrate GuruSelector in header
3. Remove Share/Bookmark/More actions
4. Simplify ChatInput (remove +/Auto/Connect Apps)
5. Add markdown rendering to MessageBubble
6. Add "Save to Notes" action

**Dependencies to Install:**
```bash
cd shastrarthi
npm install react-markdown remark-gfm
```

**Testing:**
```bash
# Test welcome screen renders
# Test persona switching
# Test chat streaming
# Test markdown rendering
```

---

### Phase 4: Notes System

**Files to Read First:**
- [`shastrarthi/app/api/notebooks/route.ts`](shastrarthi/app/api/notebooks/route.ts:1)
- [`shastrarthi/app/api/notebooks/[id]/route.ts`](shastrarthi/app/api/notebooks/[id]/route.ts:1)

**New Components to Create:**
1. `NotesPanel.tsx` - Left-side panel with markdown editor
2. `app/(app)/app/notes/page.tsx` - Standalone notes page

**Dependencies to Install:**
```bash
cd shastrarthi
npm install @uiw/react-md-editor
```

**Key Changes:**
1. Add `thread_id` to notebooks API
2. Create split-panel layout
3. Integrate markdown editor
4. Add notes list for current thread

**Testing:**
```bash
# Test creating a note
# Test saving to notebooks table
# Test notes list
# Test notes page
```

---

### Phase 5: Discovery Enhancement

**Files to Read First:**
- [`shastrarthi/app/(app)/app/discover/page.tsx`](shastrarthi/app/(app)/app/discover/page.tsx:1)

**Key Changes:**
1. Rename "Text Discovery" → "Shastra Discovery"
2. Add topics grid below search bar

**Testing:**
```bash
# Verify page title changed
# Test topics grid displays
# Verify no model errors
```

---

### Phase 6: Testing & Verification

**Files to Read First:**
- `shastrarthi/tests/` directory

**Key Changes:**
1. Update `Sidebar.test.tsx`
2. Adapt `gallery-agents.test.tsx` → test `GuruSelector`
3. Add tests for `NewChatWelcome`
4. Add tests for `NotesPanel`

**Manual Verification Checklist:**
- [ ] Sidebar: 5 nav items + Chat History + account menu
- [ ] TopBar: no bell/user icons, breadcrumb + pricing only
- [ ] Home: chat with Script.io-style welcome
- [ ] Chat: streaming works, guru selector works
- [ ] Guru personas: respond in character
- [ ] Notes panel: opens as left panel, save/list works
- [ ] My Notes page: lists all notes
- [ ] Discovery: search + topics grid, no model errors
- [ ] Ancient History: accessible from sidebar

**Run Tests:**
```bash
cd shastrarthi && npm test
```

---

### Phase 7: Cleanup & Documentation

**Files to Read:**
- [`shastrarthi/lib/config/nav.ts`](shastrarthi/lib/config/nav.ts:1)
- Any existing documentation files

**Key Changes:**
1. Remove unused routes from nav (files stay)
2. Update documentation for:
   - New navigation structure
   - Guru persona system
   - Notes panel integration
   - API changes

**Testing:**
```bash
# Verify removed routes not in sidebar
# Check documentation is accurate
```

---

## Common Patterns & Conventions

### File Structure
```
shastrarthi/
├── components/
│   ├── chat/           # Chat-related components
│   └── app/            # App layout components
├── lib/
│   └── config/         # Configuration files
├── app/
│   ├── api/            # API routes
│   └── (app)/app/      # App pages
```

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Use functional components with hooks
- Prefer `apply_diff` for surgical edits

### State Management
- Use React hooks (useState, useEffect, useCallback)
- For global state, consider existing patterns in the codebase

### Styling
- Use Tailwind CSS
- Follow existing component patterns
- Check existing components for style reference

---

## Troubleshooting

### Common Issues

**Issue:** Component not rendering
**Solution:**
- Check imports are correct
- Verify component is exported
- Check console for errors

**Issue:** API route not working
**Solution:**
- Check route path matches file structure
- Verify Supabase client is initialized
- Check RLS policies in Supabase

**Issue:** TypeScript errors
**Solution:**
- Read existing similar code for type patterns
- Check if interface needs updating
- Verify imports are correct

**Issue:** Styling not applying
**Solution:**
- Check Tailwind class names
- Verify CSS imports
- Check for conflicting styles

---

## Before Submitting Work

### Checklist:
- [ ] All tasks in your phase are complete
- [ ] Code follows existing patterns
- [ ] No console errors
- [ ] Manual testing completed
- [ ] Todo list status updated

### How to Update Todo List:
```markdown
Use the update_todo_list tool to mark completed tasks
```

---

## Need Help?

### If You're Blocked:
1. Check the dependency graph in [`dashboard-v1-dependency-graph.md`](dashboard-v1-dependency-graph.md:1)
2. Review the detailed breakdown in [`dashboard-v1-simplification-breakdown.md`](dashboard-v1-simplification-breakdown.md:1)
3. Ask a clarifying question using `ask_followup_question`

### Information to Include When Asking:
1. Which phase and task you're working on
2. What you've tried so far
3. What error or issue you're encountering
4. Relevant code snippets or error messages

---

## Quick Command Reference

```bash
# Install dependencies
cd shastrarthi && npm install

# Start development server
cd shastrarthi && npm run dev

# Run tests
cd shastrarthi && npm test

# Run specific test file
cd shastrarthi && npm test -- <test-file>

# Build for production
cd shastrarthi && npm run build

# Lint code
cd shastrarthi && npm run lint
```

---

## File Path Quick Reference

### Configuration Files
- [`shastrarthi/lib/learnlm.ts`](shastrarthi/lib/learnlm.ts:1) - Gemini API config
- [`shastrarthi/lib/config/prompts.ts`](shastrarthi/lib/config/prompts.ts:1) - Guru prompts
- [`shastrarthi/lib/config/nav.ts`](shastrarthi/lib/config/nav.ts:1) - Navigation config

### Chat Components
- [`shastrarthi/components/chat/ChatInterface.tsx`](shastrarthi/components/chat/ChatInterface.tsx:1)
- [`shastrarthi/components/chat/ChatInput.tsx`](shastrarthi/components/chat/ChatInput.tsx:1)
- [`shastrarthi/components/chat/MessageBubble.tsx`](shastrarthi/components/chat/MessageBubble.tsx:1)

### App Layout Components
- [`shastrarthi/components/app/Sidebar.tsx`](shastrarthi/components/app/Sidebar.tsx:1)
- [`shastrarthi/components/app/TopBar.tsx`](shastrarthi/components/app/TopBar.tsx:1)

### API Routes
- [`shastrarthi/app/api/chat/route.ts`](shastrarthi/app/api/chat/route.ts:1)
- [`shastrarthi/app/api/notebooks/route.ts`](shastrarthi/app/api/notebooks/route.ts:1)
- [`shastrarthi/app/api/notebooks/[id]/route.ts`](shastrarthi/app/api/notebooks/[id]/route.ts:1)

### Pages
- [`shastrarthi/app/(app)/app/page.tsx`](shastrarthi/app/(app)/app/page.tsx:1) - Home/Chat
- [`shastrarthi/app/(app)/app/discover/page.tsx`](shastrarthi/app/(app)/app/discover/page.tsx:1) - Discovery

---

## Success Criteria

Your work is complete when:
✅ All tasks in your assigned phase(s) are done
✅ Code follows existing patterns and conventions
✅ No console errors appear
✅ Manual verification items pass
✅ Todo list is updated with completed tasks

Good luck! 🚀
