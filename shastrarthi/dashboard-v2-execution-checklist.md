# Shastrarthi Dashboard V2 - Execution Checklist

This is the execution tracker for `shastrarthi_dashboard_v2_32ab3bde.plan.md`.

## Status Legend

- `[x]` Done
- `[~]` In progress
- `[ ]` Not started
- `Blocked` Waiting on dependency or decision

## Delivery Order and Acceptance Criteria

### F0 - LLM System Prompt Configuration (Foundation)
- **Status:** `[x]`
- **Scope**
  - [x] Add centralized prompt registry in `lib/config/prompts.ts`
  - [x] Refactor `lib/learnlm.ts` to accept `PromptConfig`
  - [x] Add `resolvePrompt(configId, variables)` helper with placeholder substitution
  - [x] Wire prompt configs in `app/api/chat/route.ts`, `app/api/tools/route.ts`, `app/api/synthesize/route.ts`
- **Acceptance criteria**
  - [x] No hardcoded system prompts remain in route handlers
  - [x] Prompt boundaries are appended into system instruction before LLM call
  - [x] Missing prompt config returns controlled error (`invalid_prompt_config`)
  - [x] Existing chat/synthesis/tool flows still return successful responses

### F1 - Nomenclature Cleanup
- **Status:** `[x]`
- **Acceptance criteria**
  - [x] All user-facing labels use "Shastra"/"ShastraBook" terminology
  - [x] All target routes and API paths are updated or redirected
  - [x] `lib/supabase.ts` type alias updated to `ShastraBook` while DB table remains `notebooks`
  - [x] Integration tests updated and passing (`api-protected-routes`, `routing`)

### F2 - Remove Reference Generator
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] `app/(app)/app/references/page.tsx` removed
  - [ ] Nav, breadcrumb, and task config references to "Reference Generator" removed
  - [ ] `mode === "reference"` tool handler removed or explicitly deprecated
  - [ ] No broken links to `/app/references`

### F3 - Guru Gallery V2
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Gallery includes: Advaita, Yoga, Etymology, Tantra, Sanatan
  - [ ] Comparative Traditions and Practice Advisor removed
  - [ ] Agent-specific prompt config selected by `agent` key in chat route
  - [ ] Agent behavior differs measurably by prompt (manual QA across 3 prompts)

### F4 - Simplify + Translate + pSEO Explore Pages
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Simplifier page supports mode toggle (`simplify` / `translate`)
  - [ ] Language selector + simplification level implemented
  - [ ] Copy action includes attribution block and canonical URL
  - [ ] `public_pages` migration applied and table writes succeed
  - [ ] Public route `/explore/[slug]` serves indexable content with metadata + JSON-LD
  - [ ] Sitemap and robots include `/explore` content

### F5 - Study Shastras Improvements
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Markdown editor replaces plain textarea with preview
  - [ ] Auto-save (debounced) works every 30s equivalent idle window
  - [ ] "Save to ShastraBook" in `AIAnswer` appends content via API
  - [ ] Sidebar search filters by title/content
  - [ ] New append endpoint includes ownership and input validation

### F6 - Chat Improvements
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Rename/delete thread actions present in sidebar and functional
  - [ ] `PATCH` and `DELETE /api/chat/threads/[id]` secured and tested
  - [ ] Download chat as markdown works on active thread
  - [ ] Share decision finalized (`is_public` flag or `shared_threads` table) and implemented
  - [ ] Bookmark behavior defined (save/tag) and shipped

### F7 - Reader Fixes
- **Status:** `[x]`
- **Acceptance criteria**
  - [x] GET reading progress endpoint implemented and used on mount
  - [x] Existing notes load in batch and show verse indicators
  - [x] Note modal supports edit flow (`PUT /api/notes`)
  - [x] Keyboard shortcuts: left/right, `b`, `n`
  - [x] Jump-to-verse UI works for long texts

### F8 - Extract Insights V2
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Extraction uses grounded verse/text data instead of synthetic "Source 1"
  - [ ] Upload supports CSV/JSON with robust parse errors
  - [ ] `extract_datasets` migration applied and CRUD endpoint secured
  - [ ] Output rows link to real reader routes/sources

### F9 - Explore Topics V2
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Curated `topics` table migration + seed data complete
  - [ ] App topics page consumes curated topics with descriptions/icons/counts
  - [ ] Public `/topics/[slug]` page includes related texts/subtopics and structured data
  - [ ] Sitemap includes topic routes

### F10 - History Section (+ Paths & Lineages)
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] History schema migrations (`history_entities`, `history_relations`, `history_timelines`) applied
  - [ ] Public routes for landing/listing/detail/timelines built with published-only gating
  - [ ] Seed/enrichment pipeline scripts produce reviewable content
  - [ ] `/paths` and `/paths/[slug]` shipped with responsive fallback
  - [ ] 24-path seed dataset represented and link graph is navigable

### F11 - pSEO Infrastructure (Cross-Cutting)
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Shared SEO component and structured-data helpers in use across pSEO routes
  - [ ] Dynamic sitemap queries all publishable tables
  - [ ] Canonical, OG, and JSON-LD present for each page type
  - [ ] Quality thresholds and `noindex` logic for thin content implemented

### F12 - Dashboard Home V2
- **Status:** `[ ]`
- **Acceptance criteria**
  - [ ] Popular tasks updated for new IA (remove stale references)
  - [ ] Continue Reading + Recent ShastraBooks sections functional
  - [ ] TaskInput placeholder actions removed/replaced
  - [ ] Public landing includes history spotlight

## Feasibility and Risk Review

## Scope Cuts (recommended to ship faster)
- **Cut A (high impact):** Defer F10 data ingestion automation (Wikidata/Wikipedia/Archive scripts) and launch history with curated seed subset.
- **Cut B:** Defer F10 `/paths` interactive graph animations; ship static list/cards first and add graph in phase 2.
- **Cut C:** Defer F6 shareable public threads; ship rename/delete/download first.
- **Cut D:** Defer F8 external APIs (Indica/LINGUINDIC/Rigveda API); ship CSV/JSON upload only.
- **Cut E:** Defer advanced pSEO (`hreflang`, FAQ schema) until core route correctness and content quality gates are stable.

## Key Dependencies
- **AI foundation dependency:** F0 must stay stable before F3/F4/F8/F11.
- **Naming dependency:** F1 before F5 and F12 to avoid duplicate rename churn.
- **Schema dependency:** F4/F8/F9/F10/F11 each require migration sequencing and rollback plans.
- **Cross-route SEO dependency:** F11 depends on route outputs from F4/F9/F10/F6.

## DB Migration Risks
- **Risk: migration ordering conflicts**
  - Mitigation: use timestamped migration files and apply in CI against clean DB snapshot.
- **Risk: expensive queries on pSEO routes**
  - Mitigation: add indexes for slug lookups and publish flags (`slug`, `is_published`, `created_at` as needed).
- **Risk: RLS/data leakage on new user tables**
  - Mitigation: define explicit RLS policies before exposing endpoints (`public_pages`, `extract_datasets`, chat share fields).
- **Risk: content bloat in JSON/text columns**
  - Mitigation: enforce payload size limits and summarize oversized content before persistence.
- **Risk: irreversible rename confusion**
  - Mitigation: keep DB table names stable where possible, use app-level aliases and tested redirects.

## Operational Risks
- **Prompt drift risk:** multiple teams editing prompt configs may regress behavior.
  - Mitigation: lock prompt IDs, add snapshot tests for prompt resolution.
- **SEO quality risk:** low-value pages may get indexed.
  - Mitigation: minimum content thresholds + `noindex` for thin pages.
- **UX risk from broad scope:** many features change at once.
  - Mitigation: release behind feature flags per module (`history`, `paths`, `explore`).

## Suggested Milestones
- **M1 (now):** F0 complete and verified.
- **M2:** F1 + F2 + F3 (IA and assistant behavior pass).
- **M3:** F4 + F5 + F6 (core product workflows upgraded).
- **M4:** F7 + F8 + F9 (reader and research depth).
- **M5:** F10 + F11 + F12 (public growth and polish).
