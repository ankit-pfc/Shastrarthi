# Shastrarthi - Phase 1 MVP Implementation Plan

**Version:** 1.0
**Date:** 2026-02-10

---

## Executive Summary

This plan outlines implementation of Shastrarthi MVP - a research platform for ancient Sanskrit texts with AI-powered explanations. The MVP focuses on core reading experience, AI chat functionality, basic authentication, and personal library features.

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Framework | Next.js 14 (App Router) | Server components, optimal performance, built-in API routes |
| Language | TypeScript | Type safety, better developer experience |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development, accessible components |
| Database | Supabase (PostgreSQL) | Managed Postgres, built-in auth, real-time capabilities |
| AI/LLM | OpenAI GPT-4/GPT-4o | Industry-leading reasoning, streaming support |
| State Management | React Context + hooks | MVP doesn't need complex state |
| Deployment | Vercel | Native Next.js hosting, zero-config deployment |

### Design Philosophy

**Clean, Content-First Reading Experience**
- Typography-optimized for long-form reading
- Subtle spiritual aesthetic (warm earthy tones)
- Minimal distractions
- Dark/light mode support
- Mobile-responsive design

---

## System Architecture

```mermaid
graph TB
    subgraph Client
        LP[Landing Page]
        AUTH[Auth Pages]
        DIS[Text Discovery]
        READ[Text Reader]
        LIB[My Library]
        CHAT[AI Chat Panel]
    end

    subgraph Next.js API
        API1[/api/chat]
        API2[/api/texts]
        API3[/api/auth/callback]
    end

    subgraph Supabase
        SB_AUTH[Supabase Auth]
        SB_DB[(PostgreSQL)]
        SB_RLS[Row Level Security]
    end

    subgraph External
        OAI[OpenAI API]
    end

    LP --> DIS
    AUTH --> LIB
    DIS --> READ
    LIB --> READ
    READ --> CHAT

    CHAT --> API1
    DIS --> API2
    AUTH --> API3

    API1 --> OAI
    API1 --> SB_DB
    API2 --> SB_DB
    API3 --> SB_AUTH

    SB_AUTH --> SB_DB
    SB_DB --> SB_RLS
```

---

## Database Schema

### Core Tables

```sql
-- Texts (pre-loaded content)
CREATE TABLE texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_sa TEXT,
    category TEXT NOT NULL CHECK (category IN ('Veda', 'Upanishad', 'Tantra', 'Yoga', 'Itihasa', 'Purana')),
    tradition TEXT CHECK (tradition IN ('Advaita', 'Vishishtadvaita', 'Dvaita', 'Shakta', 'Shaiva', 'Buddhist', 'Jain')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'scholar')),
    description TEXT,
    verse_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

-- Verses (atomic content units)
CREATE TABLE verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
    ref TEXT NOT NULL, -- e.g., '2.47', '1.2', '1.1.3'
    order_index INT NOT NULL,
    sanskrit TEXT,
    transliteration TEXT,
    translation_en TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_verses_text_id ON verses(text_id);
CREATE INDEX idx_verses_order ON verses(text_id, order_index);

-- Users (managed by Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    preferences JSONB DEFAULT '{
        "theme": "light",
        "fontSize": "medium",
        "showSanskrit": true,
        "showTransliteration": true
    }'::jsonb,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Saved texts (My Library)
CREATE TABLE user_texts (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, text_id)
);

-- Bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    verse_id UUID REFERENCES verses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, verse_id)
);

-- Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    verse_id UUID REFERENCES verses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Reading progress (optional for MVP)
CREATE TABLE reading_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
    last_verse_index INT DEFAULT 0,
    completed_at TIMESTAMP,
    PRIMARY KEY (user_id, text_id)
);
```

---

## Implementation Plan

### Phase 1: Project Setup & Database

**Tasks:**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS with custom theme
- [ ] Set up shadcn/ui components
- [ ] Create Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Create seed data for 10 initial texts
- [ ] Test database connectivity

**Deliverables:**
```
shastrarthi/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── app/
│   ├── layout.tsx
│   ├── page.tsx (landing)
│   └── globals.css
├── components/
│   └── ui/ (shadcn components)
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── types/
    └── index.ts
```

---

### Phase 2: Text Reader (Core Feature)

**Tasks:**
- [ ] Create /reader/[slug] route with server component
- [ ] Build VerseDisplay component
- [ ] Implement Sanskrit toggle
- [ ] Implement transliteration toggle
- [ ] Add verse numbering
- [ ] Create ReaderControls (font size, theme, back button)
- [ ] Add progress bar
- [ ] Implement bookmark button (frontend state)
- [ ] Add note button (opens modal)

**Components to Build:**
- `components/reader/VerseDisplay.tsx` - Single verse with toggles
- `components/reader/ReaderControls.tsx` - Top bar controls
- `components/reader/ProgressBar.tsx` - Reading progress
- `components/reader/BookmarkButton.tsx` - Bookmark action
- `components/reader/NoteButton.tsx` - Note action
- `components/reader/NoteModal.tsx` - Note editor

---

### Phase 3: Authentication

**Tasks:**
- [ ] Set up Supabase Auth
- [ ] Create /auth/login page
- [ ] Create /auth/signup page
- [ ] Implement Google OAuth
- [ ] Implement email/password auth
- [ ] Create auth context provider
- [ ] Add protected route middleware
- [ ] Create profile creation trigger

**Pages to Build:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `components/auth/AuthForm.tsx`
- `lib/auth.ts` - Auth utilities
- `app/middleware.ts` - Route protection

---

### Phase 4: Text Discovery

**Tasks:**
- [ ] Create /discover page
- [ ] Build TextCard component
- [ ] Implement category filters
- [ ] Implement difficulty filters
- [ ] Add search functionality (client-side)
- [ ] Create text detail preview modal

**Components to Build:**
- `app/discover/page.tsx`
- `components/discover/TextCard.tsx`
- `components/discover/FilterBar.tsx`
- `components/discover/SearchBar.tsx`

---

### Phase 5: AI Chat (Critical Feature)

**Tasks:**
- [ ] Create /api/chat route
- [ ] Implement RAG: fetch verse + neighbors
- [ ] Build system prompt template
- [ ] Integrate OpenAI API with streaming
- [ ] Create ChatPanel component
- [ ] Add quick action buttons
- [ ] Implement conversation history
- [ ] Add verse citation in responses

**Components to Build:**
- `app/api/chat/route.ts` - Chat API endpoint
- `components/reader/ChatPanel.tsx` - Chat interface
- `components/reader/ChatMessage.tsx` - Individual message
- `components/reader/QuickActions.tsx` - Quick prompts
- `lib/openai.ts` - OpenAI client

**AI System Prompt:**
```
You are a learned Sanskrit scholar helping students understand ancient texts.

Context:
- Current text: {text_name}
- Current verse: {verse_ref}
- Verse content: {sanskrit} | {transliteration} | {translation}
- Neighboring verses: {context_verses}

Guidelines:
1. Always cite specific verses when making claims (e.g., "BG 2.47")
2. Explain Sanskrit terms with transliteration and root meanings
3. Use simple, clear language
4. Connect to practical application when appropriate
5. Never fabricate information - only use provided context
6. If uncertain, say so clearly

User's question: {user_query}
```

---

### Phase 6: My Library

**Tasks:**
- [ ] Create /library page
- [ ] Build SavedTexts section
- [ ] Build Bookmarks section
- [ ] Build Notes section
- [ ] Implement recently viewed
- [ ] Add folder organization (basic)

**Components to Build:**
- `app/library/page.tsx`
- `components/library/SavedTexts.tsx`
- `components/library/BookmarkList.tsx`
- `components/library/NotesList.tsx`
- `components/library/RecentViewed.tsx`

---

### Phase 7: Notes Feature

**Tasks:**
- [ ] Complete NoteModal component
- [ ] Implement rich text editor (basic: bold, italic, lists)
- [ ] Save notes to database
- [ ] Display notes in Library
- [ ] Link notes to verses

**Components to Build:**
- `components/reader/NoteModal.tsx` - Note editor
- `components/reader/RichTextEditor.tsx` - Basic rich text
- `app/api/notes/route.ts` - Notes CRUD API

---

### Phase 8: Landing Page

**Tasks:**
- [ ] Design hero section with value prop
- [ ] Create "How It Works" section
- [ ] Build sample texts preview
- [ ] Add pricing section (Free + Premium)
- [ ] Create FAQ section
- [ ] Build footer (About, Contact, Terms)
- [ ] Add CTA buttons

**Components to Build:**
- `app/page.tsx` - Landing page
- `components/landing/Hero.tsx`
- `components/landing/HowItWorks.tsx`
- `components/landing/TextPreview.tsx`
- `components/landing/Pricing.tsx`
- `components/landing/FAQ.tsx`
- `components/landing/Footer.tsx`

---

### Phase 9: Polish & Testing

**Tasks:**
- [ ] Implement dark/light theme toggle
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Mobile responsive testing
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Performance optimization

**Tasks:**
- Add theme provider
- Implement loading skeletons
- Add toast notifications
- Fix responsive issues
- Test on mobile devices
- Verify accessibility (ARIA labels, keyboard nav)

---

### Phase 10: Final Testing & Deployment

**Tasks:**
- [ ] Load all 10 texts to production DB
- [ ] Test full user flow:
  - Signup → Browse → Read → Chat → Bookmark → Note
- [ ] Verify AI responses are accurate
- [ ] Test auth flows (signup, login, logout)
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Set up monitoring (Sentry)
- [ ] Beta test with 3-5 users

---

## Content Requirements

### Initial 10 Texts to Load

| # | Text | Category | Tradition | Difficulty | Verses |
|---|------|----------|-----------|------------|--------|
| 1 | Bhagavad Gita | Itihasa | Advaita | Beginner | Chapter 2 (72 verses) |
| 2 | Yoga Sutras | Yoga | Classical | Intermediate | ~196 verses |
| 3 | Mandukya Upanishad | Upanishad | Advaita | Advanced | 12 verses |
| 4 | Kena Upanishad | Upanishad | Advaita | Intermediate | 4 sections |
| 5 | Isha Upanishad | Upanishad | Advaita | Beginner | 18 verses |
| 6 | Katha Upanishad | Upanishad | Advaita | Intermediate | 6 chapters |
| 7 | Hatha Yoga Pradipika | Yoga | Classical | Intermediate | Chapters 1-2 |
| 8 | Vivekachudamani | Vedanta | Advaita | Advanced | Select verses (50-100) |
| 9 | Ashtavakra Gita | Vedanta | Advaita | Advanced | ~300 verses |
| 10 | Vijnana Bhairava Tantra | Tantra | Kashmir Shaivism | Advanced | 112 verses |

---

## API Endpoints

### /api/chat
**Method:** POST
**Body:** `{ textId, verseRef, query, conversationHistory }`
**Response:** Streaming text with verse citations

### /api/texts
**Method:** GET
**Query:** `?category=&difficulty=&search=`
**Response:** List of texts with metadata

### /api/texts/[slug]
**Method:** GET
**Response:** Text with all verses

### /api/bookmarks
**Methods:** GET, POST, DELETE
**Auth:** Required

### /api/notes
**Methods:** GET, POST, PUT, DELETE
**Auth:** Required

### /api/library
**Methods:** GET, POST
**Auth:** Required

---

## Acceptance Criteria

### Must Work Before Shipping:

- [ ] User can sign up with email or Google
- [ ] User can browse 10+ texts
- [ ] User can open a text and read verses sequentially
- [ ] Sanskrit, transliteration, English all display correctly
- [ ] User can bookmark a verse → appears in Library/Bookmarks
- [ ] User can ask AI a question → gets contextual response within 5 seconds
- [ ] AI response cites verse references correctly
- [ ] User can add a simple note to a verse
- [ ] Mobile responsive (tested on phone)
- [ ] No critical bugs (30 min continuous testing)

---

## Engineering Standards

| Preference | Implementation Approach |
|------------|------------------------|
| **DRY** | Create reusable components, shared utilities, custom hooks |
| **Testing** | Unit tests for utilities, integration tests for API routes, E2E for critical flows |
| **Right-sized** | MVP features only, no premature abstraction, keep it simple |
| **Edge cases** | Handle empty states, loading states, error states, offline scenarios |
| **Explicit over clever** | Clear variable names, descriptive comments, straightforward logic |

---

## File Structure (Final)

```
shastrarthi/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── discover/
│   │   │   └── page.tsx
│   │   ├── reader/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── library/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   ├── texts/
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   │       └── route.ts
│   │   ├── bookmarks/
│   │   │   └── route.ts
│   │   ├── notes/
│   │   │   └── route.ts
│   │   └── library/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx
│   ├── discover/
│   │   ├── TextCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── SearchBar.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TextPreview.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   └── Footer.tsx
│   ├── library/
│   │   ├── SavedTexts.tsx
│   │   ├── BookmarkList.tsx
│   │   ├── NotesList.tsx
│   │   └── RecentViewed.tsx
│   ├── reader/
│   │   ├── VerseDisplay.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── ReaderControls.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── BookmarkButton.tsx
│   │   ├── NoteButton.tsx
│   │   ├── NoteModal.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── QuickActions.tsx
│   └── ui/
│       └── (shadcn components)
├── lib/
│   ├── supabase.ts
│   ├── openai.ts
│   ├── auth.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── seed-data/
│   └── texts.json
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Quality Metrics

| Metric | Target |
|--------|--------|
| Beta users signed up | 20+ |
| Users trying AI chat | 50%+ |
| Day 2 retention | 30%+ |
| Average session duration | > 10 minutes |
| Positive feedback | 5+ users |
| Page load time | < 3 seconds |
| AI response time | < 5 seconds |

---

## Deferred to Phase 2+

- Multiple translations per verse
- Commentary layers (bhashyas)
- Multi-text comparison
- Lineage interpretation toggle
- Learning paths
- Guru Spaces (collaboration)
- PDF upload
- Advanced semantic search
- Concept graph visualization
- Audio features
- Voice input for chat

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Cost Estimates (MVP)

| Service | Cost |
|---------|------|
| Supabase | Free tier |
| Vercel | Free tier (Hobby) |
| OpenAI API | ~$50-200 (depending on usage) |
| Domain | ~$12/year |
| **Total** | **<$300 for MVP** |

---

## Implementation Checklist

### Setup Phase
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS with custom theme
- [ ] Set up shadcn/ui components
- [ ] Create Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Create seed data for 10 initial texts
- [ ] Test database connectivity

### Database Phase
- [ ] Create texts table
- [ ] Create verses table
- [ ] Create profiles table
- [ ] Create user_texts table
- [ ] Create bookmarks table
- [ ] Create notes table
- [ ] Create reading_progress table
- [ ] Add indexes for performance
- [ ] Set up Row Level Security policies

### Text Reader Phase
- [ ] Create /reader/[slug] route with server component
- [ ] Build VerseDisplay component
- [ ] Implement Sanskrit toggle
- [ ] Implement transliteration toggle
- [ ] Add verse numbering
- [ ] Create ReaderControls (font size, theme, back button)
- [ ] Add progress bar
- [ ] Implement bookmark button
- [ ] Add note button
- [ ] Create note modal

### Authentication Phase
- [ ] Set up Supabase Auth
- [ ] Create /auth/login page
- [ ] Create /auth/signup page
- [ ] Implement Google OAuth
- [ ] Implement email/password auth
- [ ] Create auth context provider
- [ ] Add protected route middleware
- [ ] Create profile creation trigger

### Text Discovery Phase
- [ ] Create /discover page
- [ ] Build TextCard component
- [ ] Implement category filters
- [ ] Implement difficulty filters
- [ ] Add search functionality
- [ ] Create text detail preview modal

### AI Chat Phase
- [ ] Create /api/chat route
- [ ] Implement RAG: fetch verse + neighbors
- [ ] Build system prompt template
- [ ] Integrate OpenAI API with streaming
- [ ] Create ChatPanel component
- [ ] Add quick action buttons
- [ ] Implement conversation history
- [ ] Add verse citation in responses

### My Library Phase
- [ ] Create /library page
- [ ] Build SavedTexts section
- [ ] Build Bookmarks section
- [ ] Build Notes section
- [ ] Implement recently viewed
- [ ] Add folder organization

### Notes Feature Phase
- [ ] Complete NoteModal component
- [ ] Implement rich text editor (basic)
- [ ] Save notes to database
- [ ] Display notes in Library
- [ ] Link notes to verses

### Landing Page Phase
- [ ] Design hero section with value prop
- [ ] Create "How It Works" section
- [ ] Build sample texts preview
- [ ] Add pricing section
- [ ] Create FAQ section
- [ ] Build footer
- [ ] Add CTA buttons

### Polish & Testing Phase
- [ ] Implement dark/light theme toggle
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Mobile responsive testing
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Performance optimization

### Deployment Phase
- [ ] Load all 10 texts to production DB
- [ ] Test full user flow
- [ ] Verify AI responses are accurate
- [ ] Test auth flows
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Set up monitoring
- [ ] Beta test with users
