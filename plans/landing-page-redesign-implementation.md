# Landing Page Redesign - Implementation Plan

## Overview
This document provides a detailed implementation plan for redesigning the Shastra landing page based on the provided specifications.

## Current Page Structure (Baseline)
```
Hero (headline + search + "Try:" + CTAs)
  ↓
Stats row ("10+ Sacred Texts / AI Explanations / Save & Organize")
  ↓
"What brings you here today?" (4 cards)
  ↓
"Featured Texts" (text-only cards)
  ↓
"How It Works" (4 steps)
```

---

## Section 1: Global Header (Sticky Navigation)

### Files to Create/Modify
- **New**: `shastrarthi/components/header/Navbar.tsx`
- **Modify**: `shastrarthi/app/layout.tsx` (to include Navbar)
- **Modify**: `shastrarthi/app/page.tsx` (adjust spacing for header)

### Implementation Details

#### Navbar Component Structure
```typescript
// components/header/Navbar.tsx
interface NavbarProps {
  // Props for mobile menu state
}

// Features:
- Sticky positioning (sticky top-0, z-50)
- Left: Brand logo + "Shastra" text (Link to "/")
- Center: Nav links (Discover, Reading Lists, Traditions, About)
- Right: Log in (secondary button), Sign up (primary button)
- Mobile: Hamburger menu for center nav, logo + auth CTAs always visible
```

#### Navigation Links
| Label | Route | Type |
|-------|-------|------|
| Discover | `/discover` | Existing |
| Reading Lists | `/lists` | New stub |
| Traditions | `/traditions` | New stub |
| About | `/about` | New stub |
| Log in | `/auth/login` | Existing |
| Sign up | `/auth/signup` | Existing |

#### Styling Requirements
- Background: White with subtle border bottom (sand-200)
- Sticky: `sticky top-0 z-50`
- Backdrop blur for modern feel
- Responsive: Desktop (flex row), Mobile (hamburger menu)
- Dark mode support

---

## Section 2: Hero Section - Search Modes

### Files to Modify
- **Modify**: `shastrarthi/components/landing/Hero.tsx`
- **Modify**: `shastrarthi/components/landing/SearchBar.tsx`

### Implementation Details

#### Hero Copy Changes
```typescript
// Current:
"Ancient Wisdom, Illuminated"
"Explore the timeless wisdom of the Vedas, Upanishads, and Yoga with AI-powered explanations. Ask questions, take notes, and build your personal library."

// New (tightened):
"Ancient Wisdom, Illuminated"
"Verse-cited AI explanations, translations, and commentary comparison for sacred texts."
```

#### Badge Copy Change
```typescript
// Current:
"AI-Powered Ancient Wisdom"

// New:
"Ancient texts with verse-cited AI explanations"
```

#### Search Mode Pills
```typescript
type SearchMode = 'texts' | 'verses' | 'concepts' | 'compare' | 'practice';

const SEARCH_MODES: SearchMode[] = [
  'texts', 'verses', 'concepts', 'compare', 'practice'
];

const MODE_PLACEHOLDERS: Record<SearchMode, string> = {
  texts: "Search texts (e.g., Isha Upanishad)",
  verses: "Find a verse (e.g., Gita 2.47)",
  concepts: "Ask a concept (e.g., Dharma, Atman)",
  compare: "Compare translations/commentaries (e.g., Gita 2.47)",
  practice: "Explore a practice (e.g., pranayama, dhyana)"
};

const MODE_EXAMPLES: Record<SearchMode, string[]> = {
  texts: ["Bhagavad Gita", "Yoga Sutras", "Isha Upanishad"],
  verses: ["Gita 2.47", "Yoga Sutra 1.2", "Isha 1"],
  concepts: ["Dharma", "Atman", "Karma", "Moksha"],
  compare: ["Gita 2.47", "Yoga Sutra 1.2"],
  practice: ["Pranayama", "Dhyana", "Asana", "Mantra"]
};
```

#### SearchBar Component Updates
```typescript
// New features:
- Mode pills above input (horizontal scroll on mobile)
- Selected mode state
- Placeholder updates based on mode
- "Try:" examples update based on mode
- Submit routes to /discover with mode param

// Submit routing:
router.push(`/discover?mode=${selectedMode}&q=${encodeURIComponent(query)}`)
```

#### Layout Structure
```
┌─────────────────────────────────────────────┐
│  [Texts] [Verses] [Concepts] [Compare] [Practice]  ← Mode pills
├─────────────────────────────────────────────┤
│  🔍 [Search input placeholder...] [Search]  ← Search bar
├─────────────────────────────────────────────┤
│  Try: "example1", "example2", "example3"    ← Mode-aware examples
└─────────────────────────────────────────────┘
```

---

## Section 3: Intent Builder (3-Column Grid)

### Files to Create/Modify
- **New**: `shastrarthi/components/landing/IntentBuilder.tsx`
- **Delete**: `shastrarthi/components/landing/QuickIntents.tsx`
- **Modify**: `shastrarthi/app/page.tsx` (import IntentBuilder instead)

### Implementation Details

#### Intent Builder Data Structure
```typescript
interface IntentColumn {
  title: string;
  items: IntentItem[];
}

interface IntentItem {
  id: string;
  label: string;
  value: string;
  isExpanded?: boolean;
  subItems?: IntentItem[];
}

const INTENT_BUILDER: IntentColumn[] = [
  {
    title: "I WANT TO",
    items: [
      { id: "learn-philosophy", label: "Learn a philosophy", value: "learn-philosophy" },
      { id: "find-verse", label: "Find a verse", value: "find-verse" },
      { id: "reading-plan", label: "Start a reading plan", value: "reading-plan" },
      { id: "compare", label: "Compare translations", value: "compare" },
      { id: "deity-tradition", label: "Explore a deity tradition", value: "deity-tradition" },
      { id: "understand-concept", label: "Understand a concept", value: "understand-concept" },
      { id: "show-more-goals", label: "Show more", value: "show-more", isExpanded: true }
    ]
  },
  {
    title: "EXPLORE",
    items: [
      { id: "philosophy", label: "Philosophy (Darshanas)", value: "philosophy" },
      { id: "sampradaya", label: "Sampradaya", value: "sampradaya" },
      { id: "deity", label: "Deity", value: "deity" },
      { id: "era", label: "Era", value: "era" },
      { id: "civilization", label: "Civilization/Region", value: "civilization" },
      { id: "text-type", label: "Text type", value: "text-type" },
      { id: "show-more-lenses", label: "Show more", value: "show-more", isExpanded: true }
    ]
  },
  {
    title: "START WITH",
    items: [
      { id: "beginner", label: "Beginner essentials", value: "beginner" },
      { id: "upanishads", label: "Upanishads starter set", value: "upanishads" },
      { id: "gita", label: "Gita deep-dive", value: "gita" },
      { id: "yoga", label: "Yoga foundations", value: "yoga" },
      { id: "advaita", label: "Advaita starter set", value: "advaita" },
      { id: "bhakti", label: "Bhakti starter set", value: "bhakti" },
      { id: "show-more-starts", label: "Show more", value: "show-more", isExpanded: true }
    ]
  }
];
```

#### Expanded Sub-Items (for "Show more")
```typescript
const EXPANDED_ITEMS: Record<string, IntentItem[]> = {
  "philosophy": [
    { id: "vedanta", label: "Vedanta", value: "vedanta" },
    { id: "samkhya", label: "Samkhya", value: "samkhya" },
    { id: "yoga", label: "Yoga", value: "yoga" },
    { id: "nyaya", label: "Nyaya", value: "nyaya" },
    { id: "vaisheshika", label: "Vaisheshika", value: "vaisheshika" },
    { id: "mimamsa", label: "Mimamsa", value: "mimamsa" }
  ],
  "sampradaya": [
    { id: "advaita", label: "Advaita", value: "advaita" },
    { id: "vishishtadvaita", label: "Vishishtadvaita", value: "vishishtadvaita" },
    { id: "dvaita", label: "Dvaita", value: "dvaita" },
    { id: "shaiva", label: "Shaiva", value: "shaiva" },
    { id: "shakta", label: "Shakta", value: "shakta" },
    { id: "vaishnava", label: "Vaishnava", value: "vaishnava" }
  ],
  "deity": [
    { id: "shiva", label: "Shiva", value: "shiva" },
    { id: "vishnu", label: "Vishnu", value: "vishnu" },
    { id: "devi", label: "Devi", value: "devi" },
    { id: "ganesha", label: "Ganesha", value: "ganesha" }
  ],
  "era": [
    { id: "vedic", label: "Vedic", value: "vedic" },
    { id: "epic", label: "Epic", value: "epic" },
    { id: "classical", label: "Classical", value: "classical" },
    { id: "medieval", label: "Medieval", value: "medieval" }
  ]
};
```

#### Component State
```typescript
interface IntentBuilderState {
  selectedGoal: string | null;
  selectedLens: string | null;
  selectedStart: string | null;
  expandedColumns: {
    goals: boolean;
    lenses: boolean;
    starts: boolean;
  };
}
```

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  What brings you here today?                                    │
│  Pick a goal and a lens. We'll take you to a curated starting point. │
├─────────────────────────────────────────────────────────────────┤
│  I WANT TO          │  EXPLORE           │  START WITH          │
│  ┌──────────────┐   │  ┌──────────────┐  │  ┌──────────────┐   │
│  │ Learn a      │   │  │ Philosophy   │  │  │ Beginner     │   │
│  │ philosophy   │   │  │ (Darshanas)  │  │  │ essentials   │   │
│  ├──────────────┤   │  ├──────────────┤  │  ├──────────────┤   │
│  │ Find a verse │   │  │ Sampradaya   │  │  │ Upanishads   │   │
│  ├──────────────┤   │  ├──────────────┤  │  │ starter set  │   │
│  │ Start a      │   │  │ Deity        │  │  ├──────────────┤   │
│  │ reading plan │   │  ├──────────────┤  │  │ Gita         │   │
│  ├──────────────┤   │  │ Era          │  │  │ deep-dive    │   │
│  │ Compare      │   │  ├──────────────┤  │  ├──────────────┤   │
│  │ translations │   │  │ Civilization │  │  │ Yoga         │   │
│  ├──────────────┤   │  │ /Region      │  │  │ foundations  │   │
│  │ Explore a    │   │  ├──────────────┤  │  ├──────────────┤   │
│  │ deity        │   │  │ Text type    │  │  │ Advaita      │   │
│  │ tradition    │   │  ├──────────────┤  │  │ starter set  │   │
│  ├──────────────┤   │  │ Show more    │  │  ├──────────────┤   │
│  │ Understand   │   │  └──────────────┘  │  │ Bhakti       │   │
│  │ a concept    │   │                   │  │ starter set  │   │
│  ├──────────────┤   │                   │  ├──────────────┤   │
│  │ Show more    │   │                   │  │ Show more    │   │
│  └──────────────┘   │                   │  └──────────────┘   │
└─────────────────────┴───────────────────┴─────────────────────┘
│                     [Continue]                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Continue Button Routing
```typescript
const handleContinue = () => {
  const params = new URLSearchParams();
  if (selectedGoal) params.set('goal', selectedGoal);
  if (selectedLens) params.set('lens', selectedLens);
  if (selectedStart) params.set('start', selectedStart);
  router.push(`/discover?${params.toString()}`);
};
```

---

## Section 4: Featured Texts with Cover Images

### Files to Modify
- **Modify**: `shastrarthi/components/landing/FeaturedTexts.tsx`

### Implementation Details

#### Updated Data Model
```typescript
interface FeaturedText {
  slug: string;
  title_en: string;
  title_sa: string;
  category: string;
  difficulty: string;
  description: string;
  verse_count: number;
  coverImageUrl?: string; // NEW: Add cover image URL
}
```

#### Card Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────┐  Title (English)                    [⋮]  │
│  │          │  Sanskrit Title                           │
│  │  Cover   │  ┌──────────┐ ┌──────────────┐           │
│  │  Image   │  │ Level    │ │ 12 verses    │           │
│  │  (120x   │  └──────────┘ └──────────────┘           │
│  │  160px)  │                                           │
│  │          │  Short description truncated to 2 lines   │
│  └──────────┘                                           │
│                                                        │
│  [Start Reading]  [Save]  [Add to List]                │
└─────────────────────────────────────────────────────────┘
```

#### Cover Image Handling
```typescript
// If coverImageUrl is not provided, generate consistent placeholder
const getCoverImage = (text: FeaturedText): string => {
  if (text.coverImageUrl) return text.coverImageUrl;
  
  // Generate placeholder based on text slug for consistency
  const colors = [
    'from-saffron-400 to-marigold-500',
    'from-ochre-400 to-sand-500',
    'from-sand-400 to-ochre-500'
  ];
  const colorIndex = text.slug.length % colors.length;
  
  // Use gradient with initials
  const initials = text.title_en.split(' ').map(w => w[0]).join('').slice(0, 2);
  return `/api/placeholder?initials=${initials}&colors=${colorIndex}`;
};
```

#### Card Component Structure
```typescript
// Grid: 3 columns on lg, 2 on md, 1 on mobile
// Card: Flex row with left thumbnail, right content
// Thumbnail: Fixed aspect ratio (3:4), ~120x160px
// Content: Flex-1, title, metadata, description, actions
```

---

## Section 5: Domain-Specific Icon System

### Files to Create/Modify
- **New**: `shastrarthi/components/icons/DomainIcons.tsx`
- **Modify**: `shastrarthi/components/landing/Hero.tsx` (stats row)
- **Modify**: `shastrarthi/components/landing/HowItWorks.tsx`

### Implementation Details

#### Icon Mapping
```typescript
// components/icons/DomainIcons.tsx
import { 
  BookOpen, 
  Quote, 
  Columns, 
  Lotus, 
  TreeDeciduous, 
  Temple,
  Scroll,
  MessageSquare,
  Sparkles,
  Bookmark
} from "lucide-react";

// Domain-specific icon set
export const DOMAIN_ICONS = {
  // Texts/Library
  texts: BookOpen,
  library: BookOpen,
  manuscript: Scroll,
  
  // Verse/Citation
  verse: Quote,
  citation: Quote,
  
  // Compare
  compare: Columns,
  translations: Columns,
  
  // Practice
  practice: Lotus,
  meditation: Lotus,
  pranayama: Lotus,
  
  // Sampradaya/Lineage
  sampradaya: TreeDeciduous,
  lineage: TreeDeciduous,
  
  // Deity
  deity: Temple,
  
  // Generic
  ai: Sparkles,
  chat: MessageSquare,
  save: Bookmark
};
```

#### Stats Row Icons Update
```typescript
// Hero.tsx stats row
// Current: Generic colored dots
// New: Domain-specific icons

const STATS = [
  {
    icon: BookOpen, // Texts/Library
    label: "10+ Sacred Texts",
    color: "text-green-600"
  },
  {
    icon: Sparkles, // AI Explanations
    label: "AI Explanations",
    color: "text-blue-600"
  },
  {
    icon: Bookmark, // Save & Organize
    label: "Save & Organize",
    color: "text-purple-600"
  }
];
```

#### How It Works Icons Update
```typescript
// HowItWorks.tsx
// Current: BookOpen, MessageSquare, Sparkles, ArrowRight
// New: Domain-specific, consistent style

const STEPS = [
  {
    icon: BookOpen, // Discover Texts
    title: "Discover Texts",
    description: "Browse our collection of sacred texts from the Vedic tradition."
  },
  {
    icon: Scroll, // Read & Learn (more manuscript-like)
    title: "Read & Learn",
    description: "Access the text reader with Sanskrit, transliteration, and English translations. Read verses sequentially with AI-powered explanations."
  },
  {
    icon: Sparkles, // Ask AI
    title: "Ask AI",
    description: "Get instant answers to your questions about any verse using our AI assistant. Context-aware responses with verse citations."
  },
  {
    icon: Bookmark, // Save & Organize (mention reading lists)
    title: "Save & Organize",
    description: "Bookmark verses, take notes, and build your personal library with reading lists."
  }
];
```

#### Icon Consistency Rules
- All icons use outline style (no mixed filled/outline)
- Consistent size: `h-6 w-6` for standard, `h-5 w-5` for small
- Consistent padding and background circles
- Same color scheme (saffron-600 for primary)

---

## Section 6: Copy Tweaks

### Files to Modify
- **Modify**: `shastrarthi/components/landing/Hero.tsx`
- **Modify**: `shastrarthi/components/landing/HowItWorks.tsx`

### Copy Changes Summary

#### Hero Section
```typescript
// Badge:
"AI-Powered Ancient Wisdom" → "Ancient texts with verse-cited AI explanations"

// Headline:
"Ancient Wisdom, Illuminated" (unchanged)

// Description:
"Explore the timeless wisdom of the Vedas, Upanishads, and Yoga with AI-powered explanations. Ask questions, take notes, and build your personal library."
→
"Verse-cited AI explanations, translations, and commentary comparison for sacred texts."
```

#### How It Works Section
```typescript
// Intro:
"Three simple steps to begin your spiritual journey with ancient wisdom."
→
"Four simple steps to begin your spiritual journey with ancient wisdom."
// (Changed to match 4 steps)

// Step 4 description:
"Bookmark verses, take notes, and build your personal library of spiritual texts."
→
"Bookmark verses, take notes, and build your personal library with reading lists."
// (Added "reading lists" mention)
```

---

## Section 7: Stub Pages for New Routes

### Files to Create
- **New**: `shastrarthi/app/lists/page.tsx`
- **New**: `shastrarthi/app/traditions/page.tsx`
- **New**: `shastrarthi/app/about/page.tsx`

### Stub Page Template
```typescript
// app/lists/page.tsx (example)
export default function ListsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-100 mb-4">
          Reading Lists
        </h1>
        <p className="text-sand-600 dark:text-sand-400 mb-8">
          Create and manage your personalized reading lists of sacred texts.
        </p>
        <div className="bg-white dark:bg-sand-800 rounded-xl p-8 border border-sand-200 dark:border-sand-700">
          <p className="text-sand-500 dark:text-sand-400">
            Coming soon! This feature is under development.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## Section 8: Discover Page Updates

### Files to Modify
- **Modify**: `shastrarthi/app/discover/page.tsx`

### Implementation Details

#### Updated Query Params
```typescript
// Current:
interface DiscoverSearchParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

// New:
interface DiscoverSearchParams {
  category?: string;
  difficulty?: string;
  search?: string;
  mode?: 'texts' | 'verses' | 'concepts' | 'compare' | 'practice';
  goal?: string;
  lens?: string;
  start?: string;
  q?: string; // Alternative to 'search' for mode-based search
}
```

#### Mode-Based Search Handling
```typescript
// Map mode to search behavior
const getSearchQuery = (mode: string, q: string): string => {
  switch (mode) {
    case 'texts':
      return `title_en.ilike.%${q}%,title_sa.ilike.%${q}%`;
    case 'verses':
      return `reference.ilike.%${q}%`; // Requires verse reference field
    case 'concepts':
      return `description.ilike.%${q}%,keywords.ilike.%${q}%`;
    case 'compare':
      return `title_en.ilike.%${q}%`; // Same as texts for now
    case 'practice':
      return `category.ilike.%${q}%,description.ilike.%${q}%`;
    default:
      return `title_en.ilike.%${q}%,title_sa.ilike.%${q}%,description.ilike.%${q}%`;
  }
};
```

---

## Component Architecture Overview

```
app/
├── layout.tsx (includes Navbar)
├── page.tsx (main landing page)
│   ├── Hero
│   │   └── SearchBar (with modes)
│   ├── IntentBuilder (replaces QuickIntents)
│   ├── FeaturedTexts (with cover images)
│   └── HowItWorks (with domain icons)
├── discover/
│   └── page.tsx (updated query params)
├── lists/
│   └── page.tsx (new stub)
├── traditions/
│   └── page.tsx (new stub)
└── about/
    └── page.tsx (new stub)

components/
├── header/
│   └── Navbar.tsx (new)
├── icons/
│   └── DomainIcons.tsx (new)
└── landing/
    ├── Hero.tsx (updated)
    ├── SearchBar.tsx (with modes)
    ├── IntentBuilder.tsx (new, replaces QuickIntents)
    ├── FeaturedTexts.tsx (with cover images)
    └── HowItWorks.tsx (with domain icons)
```

---

## Responsive Design Requirements

### Desktop (lg: 1024px+)
- Navbar: Full navigation visible
- Hero: Centered, full width
- Intent Builder: 3 columns
- Featured Texts: 3 columns grid
- How It Works: 4 columns

### Tablet (md: 768px - 1023px)
- Navbar: Full navigation visible
- Intent Builder: 3 columns (may need horizontal scroll)
- Featured Texts: 2 columns grid
- How It Works: 2 columns

### Mobile (< 768px)
- Navbar: Hamburger menu for center nav, logo + auth always visible
- Hero: Stacked, full width
- Intent Builder: 3 columns stacked vertically
- Featured Texts: 1 column
- How It Works: 1 column

---

## Implementation Order

1. **Create stub pages** (/lists, /traditions, /about) - Quick wins
2. **Create Navbar component** - Foundation for all pages
3. **Update Hero badge and copy** - Quick wins
4. **Update SearchBar with modes** - Core feature
5. **Create IntentBuilder component** - Major feature
6. **Update FeaturedTexts with cover images** - Visual enhancement
7. **Create DomainIcons** - System-wide improvement
8. **Update Hero stats row icons** - Apply new icons
9. **Update HowItWorks with new icons and copy** - Final polish
10. **Update discover page query params** - Backend integration
11. **Test responsive behavior** - Quality assurance
12. **Final verification** - Acceptance testing

---

## Acceptance Criteria Checklist

### Section 1: Global Header
- [ ] Header visible at all scroll positions
- [ ] Brand logo + "Shastra" links to "/"
- [ ] Center nav: Discover, Reading Lists, Traditions, About
- [ ] Right: Log in, Sign up buttons
- [ ] Mobile: Hamburger menu for center nav
- [ ] Logo + auth CTAs always visible on mobile

### Section 2: Hero with Search Modes
- [ ] Hero badge copy updated
- [ ] Hero description tightened
- [ ] Mode pills: Texts, Verses, Concepts, Compare, Practice
- [ ] Placeholder changes by mode
- [ ] "Try:" examples update by mode
- [ ] Query preserved when switching modes
- [ ] Submit routes to /discover with mode param

### Section 3: Intent Builder
- [ ] Title: "What brings you here today?"
- [ ] Subtitle: "Pick a goal and a lens..."
- [ ] 3-column grid: I WANT TO, EXPLORE, START WITH
- [ ] ~6 items per column initially
- [ ] "Show more" reveals deeper taxonomy
- [ ] "Continue" button routes to /discover with params

### Section 4: Featured Texts
- [ ] Cover image thumbnail on left
- [ ] Title (English) and Sanskrit title
- [ ] Metadata chips: Level, Verse count
- [ ] Short description (truncated)
- [ ] Actions: Start Reading, Save, Add to List
- [ ] Consistent card height

### Section 5: Icons
- [ ] Domain-specific icons used
- [ ] Stats row: BookOpen, Sparkles, Bookmark
- [ ] How It Works: BookOpen, Scroll, Sparkles, Bookmark
- [ ] Consistent icon style (no mixed filled/outline)
- [ ] Same size and padding

### Section 6: Copy Tweaks
- [ ] Hero badge: "Ancient texts with verse-cited AI explanations"
- [ ] Hero description tightened
- [ ] How It Works: "Four simple steps..." (not Three)
- [ ] Save & Organize mentions "reading lists"

### Section 7: Stub Pages
- [ ] /lists exists and doesn't 404
- [ ] /traditions exists and doesn't 404
- [ ] /about exists and doesn't 404

### Section 8: Discover Page
- [ ] Handles mode param
- [ ] Handles goal, lens, start params
- [ ] Handles q param (alternative to search)
- [ ] Existing routes preserved (/discover, /auth/signup, /reader/*)

---

## Technical Notes

### State Management
- Use React hooks (useState, useEffect) for client components
- No external state management needed for this scope

### Routing
- Next.js App Router (already in use)
- Query params for discover page
- Client-side navigation with useRouter

### Styling
- Tailwind CSS (already configured)
- Custom colors: sand, saffron, marigold, ochre
- Dark mode support

### Icons
- Lucide React (already in use)
- Consistent outline style
- Custom domain-specific icon mapping

### Images
- Placeholder generation for cover images
- Consistent aspect ratio (3:4)
- Gradient backgrounds with initials

---

## Dependencies

Required packages (already installed):
- `next`: ^14.x
- `react`: ^18.x
- `lucide-react`: ^0.x
- `tailwindcss`: ^3.x

No new dependencies required.

---

## Questions for Implementation

1. **Cover Images**: Should we generate placeholder images on the fly or use CSS gradients with initials? (Plan suggests CSS gradients for now)

2. **Intent Builder Taxonomy**: Are the specific items for "Show more" expansion correct? (Darshanas, Sampradaya, Deity, Era as specified)

3. **Discover Page Backend**: Does the database have fields needed for mode-based search (e.g., `reference` for verses, `keywords` for concepts)?

4. **Mobile Menu**: Should the mobile menu slide in from right or be a dropdown? (Plan suggests slide-in for better UX)

5. **Intent Builder Routing**: Should the "Continue" button require at least one selection, or allow empty selections? (Plan suggests allowing partial selections)
