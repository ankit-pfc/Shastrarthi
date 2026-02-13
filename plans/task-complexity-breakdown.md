# Dashboard V2 - Task Complexity Breakdown

## Overview
This document categorizes all not started tasks from `dashboard-v2-execution-checklist.md` into three complexity levels: **Easy**, **Clear**, and **Complex**.

---

## 🟢 Easy Tasks
*Straightforward removals, simple updates, minimal dependencies*

### F2 - Remove Reference Generator
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Primarily deletion work (files, routes, references)
- No new functionality to implement
- Simple link validation

**Acceptance Criteria:**
- [ ] `app/(app)/app/references/page.tsx` removed
- [ ] Nav, breadcrumb, and task config references to "Reference Generator" removed
- [ ] `mode === "reference"` tool handler removed or explicitly deprecated
- [ ] No broken links to `/app/references`

**Estimated Work Items:**
1. Delete references page file
2. Search and remove all references from nav config
3. Update breadcrumb config
4. Remove or deprecate tool handler in `app/api/tools/route.ts`
5. Run link checker or manual verification for broken links

---

### F12 - Dashboard Home V2
**Status:** `[ ]` Not Started

**Complexity Factors:**
- UI-focused updates only
- No backend changes required
- Content refresh

**Acceptance Criteria:**
- [ ] Popular tasks updated for new IA (remove stale references)
- [ ] Continue Reading + Recent ShastraBooks sections functional
- [ ] TaskInput placeholder actions removed/replaced
- [ ] Public landing includes history spotlight

**Estimated Work Items:**
1. Review and update popular tasks config
2. Implement Continue Reading section (fetch from reading progress)
3. Implement Recent ShastraBooks section
4. Update TaskInput placeholder text/actions
5. Add history spotlight section to public landing

---

## 🟡 Clear Tasks
*Well-defined scope, moderate complexity, clear acceptance criteria*

### F3 - Guru Gallery V2
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Agent selection logic changes
- Prompt config integration
- QA testing required across multiple prompts

**Acceptance Criteria:**
- [ ] Gallery includes: Advaita, Yoga, Etymology, Tantra, Sanatan
- [ ] Comparative Traditions and Practice Advisor removed
- [ ] Agent-specific prompt config selected by `agent` key in chat route
- [ ] Agent behavior differs measurably by prompt (manual QA across 3 prompts)

**Estimated Work Items:**
1. Update gallery config to include new agents
2. Remove Comparative Traditions and Practice Advisor from gallery
3. Modify `app/api/chat/route.ts` to select prompt config by `agent` key
4. Create prompt configs for each agent in `lib/config/prompts.ts`
5. Manual QA testing across 3 different agent prompts

---

### F5 - Study Shastras Improvements
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Editor component upgrade
- Auto-save logic implementation
- New API endpoint creation

**Acceptance Criteria:**
- [ ] Markdown editor replaces plain textarea with preview
- [ ] Auto-save (debounced) works every 30s equivalent idle window
- [ ] "Save to ShastraBook" in `AIAnswer` appends content via API
- [ ] Sidebar search filters by title/content
- [ ] New append endpoint includes ownership and input validation

**Estimated Work Items:**
1. Integrate markdown editor component with preview
2. Implement debounced auto-save logic (30s idle window)
3. Create `POST /api/shastrabooks/[id]/append` endpoint
4. Add ownership validation to append endpoint
5. Update sidebar search to filter by title AND content
6. Add "Save to ShastraBook" button in AIAnswer component

---

### F6 - Chat Improvements
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Multiple API endpoints (PATCH, DELETE)
- File download functionality
- Sharing feature requires decision and implementation

**Acceptance Criteria:**
- [ ] Rename/delete thread actions present in sidebar and functional
- [ ] `PATCH` and `DELETE /api/chat/threads/[id]` secured and tested
- [ ] Download chat as markdown works on active thread
- [ ] Share decision finalized (`is_public` flag or `shared_threads` table) and implemented
- [ ] Bookmark behavior defined (save/tag) and shipped

**Estimated Work Items:**
1. Add rename/delete actions to chat sidebar UI
2. Implement `PATCH /api/chat/threads/[id]` endpoint
3. Implement `DELETE /api/chat/threads/[id]` endpoint
4. Add RLS/security tests for thread endpoints
5. Implement markdown download functionality for active thread
6. **Decision Point:** Choose between `is_public` flag or `shared_threads` table
7. Implement sharing feature based on decision
8. Define and implement bookmark behavior (save/tag)

---

### F9 - Explore Topics V2
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Database migration required
- Seed data preparation
- SEO/structured data integration

**Acceptance Criteria:**
- [ ] Curated `topics` table migration + seed data complete
- [ ] App topics page consumes curated topics with descriptions/icons/counts
- [ ] Public `/topics/[slug]` page includes related texts/subtopics and structured data
- [ ] Sitemap includes topic routes

**Estimated Work Items:**
1. Create `topics` table migration
2. Prepare and import curated seed data
3. Update app topics page to fetch and display topics
4. Create public `/topics/[slug]` route
5. Add related texts and subtopics to topic detail page
6. Implement structured data (JSON-LD) for topic pages
7. Update sitemap generator to include topic routes

---

## 🔴 Complex Tasks
*Multiple dependencies, cross-cutting concerns, significant schema changes*

### F4 - Simplify + Translate + pSEO Explore Pages
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Multiple features combined (simplify, translate, pSEO)
- Database migration required
- SEO infrastructure integration
- Cross-cutting with F11 (pSEO Infrastructure)

**Acceptance Criteria:**
- [ ] Simplifier page supports mode toggle (`simplify` / `translate`)
- [ ] Language selector + simplification level implemented
- [ ] Copy action includes attribution block and canonical URL
- [ ] `public_pages` migration applied and table writes succeed
- [ ] Public route `/explore/[slug]` serves indexable content with metadata + JSON-LD
- [ ] Sitemap and robots include `/explore` content

**Estimated Work Items:**
1. Implement mode toggle in simplifier page (`simplify` / `translate`)
2. Add language selector component
3. Add simplification level selector
4. Update copy action to include attribution block
5. Apply `public_pages` migration (migration file already exists: `005_create_public_pages.sql`)
6. Test table writes to `public_pages`
7. Create public `/explore/[slug]` route
8. Add metadata (title, description, canonical URL) to explore pages
9. Implement JSON-LD structured data for explore pages
10. Update sitemap generator to query `public_pages` table
11. Update robots.txt to allow `/explore` content

**Dependencies:**
- F11 (pSEO Infrastructure) should be considered together

---

### F8 - Extract Insights V2
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Data extraction logic changes
- File parsing (CSV/JSON) with error handling
- Database migration and CRUD operations
- Linking to reader routes requires data relationships

**Acceptance Criteria:**
- [ ] Extraction uses grounded verse/text data instead of synthetic "Source 1"
- [ ] Upload supports CSV/JSON with robust parse errors
- [ ] `extract_datasets` migration applied and CRUD endpoint secured
- [ ] Output rows link to real reader routes/sources

**Estimated Work Items:**
1. Refactor extraction logic to use grounded verse/text data
2. Remove synthetic "Source 1" references
3. Implement CSV upload with robust parsing and error handling
4. Implement JSON upload with validation and error handling
5. Apply `extract_datasets` migration (migration file already exists: `006_create_extract_datasets.sql`)
6. Create CRUD endpoints for extract datasets
7. Add RLS policies for extract datasets
8. Update output to link to real reader routes/sources
9. Test extraction with actual verse/text data

---

### F10 - History Section (+ Paths & Lineages)
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Multiple table migrations (entities, relations, timelines)
- Complex data relationships
- Seed data pipeline
- Interactive features (paths, lineages)
- Multiple public routes

**Acceptance Criteria:**
- [ ] History schema migrations (`history_entities`, `history_relations`, `history_timelines`) applied
- [ ] Public routes for landing/listing/detail/timelines built with published-only gating
- [ ] Seed/enrichment pipeline scripts produce reviewable content
- [ ] `/paths` and `/paths/[slug]` shipped with responsive fallback
- [ ] 24-path seed dataset represented and link graph is navigable

**Estimated Work Items:**
1. Apply history schema migrations (migration file already exists: `008_create_history_tables.sql`)
2. Create public history landing route `/history`
3. Create public history listing route `/history/[type]`
4. Create public history detail route `/history/[type]/[slug]`
5. Create public history timelines route `/history/timelines`
6. Create public history timeline detail route `/history/timelines/[slug]`
7. Implement published-only gating for all history routes
8. Create seed/enrichment pipeline scripts
9. Generate reviewable content from pipeline
10. Create `/paths` route
11. Create `/paths/[slug]` route
12. Implement responsive fallback for paths routes
13. Prepare 24-path seed dataset
14. Build navigable link graph for paths

**Scope Cuts (from checklist):**
- **Cut A:** Defer data ingestion automation (Wikidata/Wikipedia/Archive scripts) and launch with curated seed subset
- **Cut B:** Defer `/paths` interactive graph animations; ship static list/cards first

---

### F11 - pSEO Infrastructure (Cross-Cutting)
**Status:** `[ ]` Not Started

**Complexity Factors:**
- Cross-cutting concern affecting multiple features
- Dynamic sitemap generation from multiple tables
- Quality thresholds and noindex logic
- Must coordinate with F4, F9, F10, F6

**Acceptance Criteria:**
- [ ] Shared SEO component and structured-data helpers in use across pSEO routes
- [ ] Dynamic sitemap queries all publishable tables
- [ ] Canonical, OG, and JSON-LD present for each page type
- [ ] Quality thresholds and `noindex` logic for thin content implemented

**Estimated Work Items:**
1. Create shared SEO component (PageSEO)
2. Create structured-data helpers (already exists: `lib/seo/structured-data.ts`)
3. Integrate SEO component across all pSEO routes
4. Update sitemap generator to dynamically query all publishable tables
5. Add canonical URL generation for each page type
6. Add Open Graph (OG) tags for each page type
7. Ensure JSON-LD is present for each page type
8. Define quality thresholds for content
9. Implement `noindex` logic for thin content
10. Test SEO implementation across F4, F9, F10, F6 routes

**Dependencies:**
- Should be implemented alongside or after F4, F9, F10, F6
- These routes provide the content that pSEO infrastructure needs to index

**Scope Cuts (from checklist):**
- **Cut E:** Defer advanced pSEO (`hreflang`, FAQ schema) until core route correctness and content quality gates are stable

---

## Summary Table

| Task | Complexity | Key Dependencies | Scope Cuts |
|------|------------|------------------|------------|
| F2 - Remove Reference Generator | 🟢 Easy | None | None |
| F12 - Dashboard Home V2 | 🟢 Easy | F1 (nomenclature) | None |
| F3 - Guru Gallery V2 | 🟡 Clear | F0 (prompts) | None |
| F5 - Study Shastras Improvements | 🟡 Clear | F1 (nomenclature) | None |
| F6 - Chat Improvements | 🟡 Clear | None | Cut C: Defer shareable public threads |
| F9 - Explore Topics V2 | 🟡 Clear | None | None |
| F4 - Simplify + Translate + pSEO | 🔴 Complex | F11 (pSEO) | None |
| F8 - Extract Insights V2 | 🔴 Complex | None | Cut D: Defer external APIs |
| F10 - History Section (+ Paths) | 🔴 Complex | None | Cut A: Defer data ingestion automation<br>Cut B: Defer graph animations |
| F11 - pSEO Infrastructure | 🔴 Complex | F4, F9, F10, F6 | Cut E: Defer hreflang, FAQ schema |

---

## Recommended Execution Order

Based on complexity and dependencies:

**Phase 1: Quick Wins (Easy Tasks)**
1. F2 - Remove Reference Generator
2. F12 - Dashboard Home V2

**Phase 2: Core Features (Clear Tasks)**
3. F3 - Guru Gallery V2
4. F5 - Study Shastras Improvements
5. F6 - Chat Improvements (without sharing initially)
6. F9 - Explore Topics V2

**Phase 3: Complex Features**
7. F11 - pSEO Infrastructure (foundation for other complex tasks)
8. F4 - Simplify + Translate + pSEO Explore Pages
9. F8 - Extract Insights V2
10. F10 - History Section (+ Paths & Lineages)

---

## Notes

- Migration files `005_create_public_pages.sql`, `006_create_extract_datasets.sql`, and `008_create_history_tables.sql` already exist in `shastrarthi/supabase/migrations/`
- History routes already partially exist in `app/(public)/history/`
- Some components like `PageSEO` and `structured-data.ts` already exist
- Consider implementing scope cuts to reduce initial delivery time
