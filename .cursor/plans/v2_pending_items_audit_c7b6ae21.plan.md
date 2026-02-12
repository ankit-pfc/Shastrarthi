---
name: V2 Pending Items Audit
overview: Audit of all pending work from the Dashboard V2 Execution Checklist and the state of the marketing plan, identifying what's done, what's partially done, and what hasn't been started.
todos:
  - id: f2-remove-reference
    content: "F2: Delete references/page.tsx redirect stub and verify no broken links"
    status: pending
  - id: f3-guru-gallery-qa
    content: "F3: Verify agent prompt wiring in chat route + manual QA across 3 agents"
    status: pending
  - id: f6-share-bookmark
    content: "F6: Design decision for share (is_public vs shared_threads) and bookmark (save/tag), then implement both"
    status: pending
  - id: f9-topics-index
    content: "F9: Create public /topics index page to match sitemap entry"
    status: pending
  - id: f11-seo-consistency
    content: "F11: Consolidate JSON-LD (PageSEO everywhere, fix explore BreadcrumbList, absolute URLs, add getExploreStructuredData helper)"
    status: pending
  - id: f11-thin-content
    content: "F11: Add runtime noindex for thin published content + optional feature flags"
    status: pending
  - id: f12-dashboard-sections
    content: "F12: Add Continue Reading and Recent ShastraBooks sections to dashboard home"
    status: pending
  - id: f12-landing-spotlight
    content: "F12: Add history spotlight to public landing page"
    status: pending
  - id: landing-missing-sections
    content: "Landing: Build CategoryCards, QuickChatWidget, DifficultyCards, and dedicated CTA section"
    status: pending
  - id: marketing-launch-plan
    content: "Marketing: Create a launch strategy / go-to-market plan using the launch-strategy skill"
    status: pending
  - id: marketing-content-seo
    content: "Marketing: Create content strategy and SEO keyword plan"
    status: pending
  - id: marketing-analytics
    content: "Marketing: Plan analytics tracking implementation (events, funnels, GA4)"
    status: pending
isProject: false
---

# V2 Pending Items and Marketing Plan Audit

## V2 Dashboard Execution Checklist Status

The checklist lives in `[shastrarthi/dashboard-v2-execution-checklist.md](shastrarthi/dashboard-v2-execution-checklist.md)` and tracks features F0 through F12 across 5 milestones.

---

### COMPLETED Features (no remaining work)

- **F0 - LLM System Prompt Configuration** -- All prompts centralized, route handlers refactored, acceptance criteria met.
- **F1 - Nomenclature Cleanup** -- All user-facing labels use ShastraBook terminology, routes and types updated.
- **F4 - Simplify + Translate + pSEO Explore Pages** -- Simplifier page with mode toggle, language selector, `public_pages` migration, `/explore/[slug]` route with metadata and JSON-LD all implemented.
- **F5 - Study Shastras Improvements** -- Markdown editor (`@uiw/react-md-editor`), 30s debounced auto-save, "Save to ShastraBook" from AI answers, sidebar search all working.
- **F7 - Reader Fixes** -- Reading progress endpoint, batch note loading, note edit flow, keyboard shortcuts, jump-to-verse all done.
- **F8 - Extract Insights V2** -- Grounded extraction, CSV/JSON upload, `extract_datasets` migration and CRUD endpoint all implemented.
- **F10 - History Section** -- Schema migrations, public routes (landing/listing/detail/timelines), entity/relation/timeline components, and `lib/services/history.ts` all built.

---

### PARTIALLY DONE Features (gaps remain)

#### F2 - Remove Reference Generator

- **Done:** Nav config and tool handler references to "Reference Generator" are already removed.
- **Pending:**
  - `app/(app)/app/references/page.tsx` still exists (currently a redirect stub to `/app/chat?agent=etymology`). Needs to be deleted.
  - Verify no broken links remain pointing to `/app/references`.

#### F3 - Guru Gallery V2

- **Done:** Five agent prompts exist in `lib/config/prompts.ts` (Advaita, Yoga, Etymology, Tantra, Sanatan). "Comparative Traditions" and "Practice Advisor" are already absent.
- **Pending:**
  - Verify agent-specific prompt config is actually selected by `agent` key in the chat route (wiring verification).
  - Manual QA across at least 3 agent prompts to confirm behavior differs measurably.

#### F6 - Chat Improvements

- **Done:** Rename/delete thread actions implemented in Sidebar. Download chat as markdown works. PATCH/DELETE endpoints exist.
- **Pending:**
  - **Share feature** -- currently a stub ("Share - coming soon"). Need to finalize decision (`is_public` flag vs `shared_threads` table) and implement.
  - **Bookmark feature** -- currently a stub ("Bookmark - coming soon"). Need to define behavior (save/tag) and implement.

#### F9 - Explore Topics V2

- **Done:** `topics` table migration exists, seed script with hierarchy exists, app topics page consumes curated topics, public `/topics/[slug]` detail page with structured data exists.
- **Pending:**
  - **Public `/topics` index page** is missing -- sitemap references it but no route exists at `app/(public)/topics/page.tsx` (only the `[slug]` detail exists).
  - Verify sitemap includes topic routes correctly (it does query the topics table).

#### F11 - pSEO Infrastructure (Cross-Cutting)

- **Done:** `PageSEO` component and `lib/seo/structured-data.ts` helpers exist. Dynamic sitemap queries texts, public_pages, topics, and history tables. Most pages have canonical, OG, and JSON-LD.
- **Pending:**
  - Topics detail page uses inline `<script>` for JSON-LD instead of the shared `PageSEO` component -- should be consolidated.
  - Explore pages use inline JSON-LD instead of structured-data helpers -- no `getExploreStructuredData` helper exists.
  - Explore `[slug]` page has BreadcrumbList nested inside Article schema (should be separate top-level object).
  - Explore landing ItemList uses relative URLs (absolute preferred for structured data).
  - No runtime `noindex` logic for thin content on already-published pages (only publish-time threshold of 300 chars).
  - No feature flags for history/paths/explore modules (mentioned in operational risks but not implemented).

#### F12 - Dashboard Home V2

- **Done:** Dashboard has Hero with TaskInput, IntentBuilder, and PopularTasks.
- **Pending:**
  - **"Continue Reading" section** -- not implemented. Needs to pull from reading progress data.
  - **"Recent ShastraBooks" section** -- not implemented. Needs to show recently edited ShastraBooks.
  - TaskInput placeholder actions need to be reviewed and updated for the new IA.
  - Public landing should include a "history spotlight" section.

---

### Landing Page (from `[plans/landing-page-redesign.md](plans/landing-page-redesign.md)`)

The landing page redesign spec calls for 8 sections. Current state:


| Section                     | Status                                                                    |
| --------------------------- | ------------------------------------------------------------------------- |
| Hero (enhanced with search) | Partial -- Hero exists with SearchInput inline, but no "Verse of the Day" |
| Quick Intents / User Goals  | Partial -- IntentBuilder covers similar behavior                          |
| Featured Texts Showcase     | Done -- `FeaturedTexts` component exists                                  |
| Browse by Category          | Missing -- No dedicated `CategoryCards` component                         |
| Quick AI Chat Widget        | Missing -- No `QuickChatWidget` component                                 |
| How It Works (enhanced)     | Existing -- `HowItWorks` component exists but lacks action buttons/links  |
| Difficulty Levels           | Missing -- No `DifficultyCards` component                                 |
| CTA / Sign Up Section       | Partial -- Hero has CTA buttons but no dedicated bottom CTA section       |


---

### Summary of ALL Pending V2 Work

**Quick wins (small effort):**

1. Delete `app/(app)/app/references/page.tsx` (F2)
2. Create public `/topics` index page (F9)
3. Consolidate JSON-LD to use `PageSEO` consistently (F11)

**Medium effort:**
4. Continue Reading + Recent ShastraBooks on dashboard (F12)
5. History spotlight on public landing (F12)
6. Fix explore structured data (BreadcrumbList separation, absolute URLs) (F11)
7. Manual QA of Guru Gallery agent behavior (F3)

**Larger effort:**
8. Chat share feature -- design decision + implementation (F6)
9. Chat bookmark feature -- design decision + implementation (F6)
10. Landing page: CategoryCards, QuickChatWidget, DifficultyCards, enhanced CTA section
11. Feature flags for public modules (F11)
12. Runtime noindex for thin content (F11)

---

## Marketing Plan Status

There is **no dedicated marketing plan or launch strategy document** in the repository. What exists:

- `[/.claude/product-marketing-context.md](.claude/product-marketing-context.md)` -- Product marketing context (positioning, audience, differentiation, brand voice, objections). This is a reference doc, not an execution plan.
- `[plans/landing-page-redesign.md](plans/landing-page-redesign.md)` -- Landing page redesign spec (UX/content, partially implemented).
- **25+ marketing skill templates** in `.claude/skills/` (launch-strategy, content-strategy, paid-ads, SEO audit, email sequences, etc.) -- these are reusable frameworks, not Shastrarthi-specific plans.

**What's missing from a marketing perspective:**

- No **launch strategy / go-to-market plan** (channels, timeline, milestones)
- No **content calendar** or content strategy execution plan
- No **SEO keyword strategy** beyond pSEO infrastructure
- No **email/nurture sequences** planned
- No **social media plan** or distribution strategy
- No **analytics/tracking implementation** plan (GA4, events, conversion funnels)
- No **pricing page** implementation (component exists but is commented out)
- Product marketing context says "Pre-launch / early stage" with no launch date or milestone targets

The marketing skills (launch-strategy, content-strategy, paid-ads, etc.) could be used to generate these plans but none have been executed yet.