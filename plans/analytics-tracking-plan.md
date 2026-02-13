# Analytics Tracking Plan

## Configuration
- **Tool**: Google Analytics 4 (GA4)
- **Measurement ID**: `G-PLACEHOLDER` (Update when provided)
- **Library**: `next-third-parties` (recommended for Next.js 14+)

## Core Events

### 1. Engagement (Chat)
| Event Name | Trigger | Properties |
|------------|---------|------------|
| `chat_started` | User sends first message in a new thread | `persona_id` (e.g., 'advaita', 'yoga') |
| `message_sent` | User sends a message | `thread_id` |
| `guru_changed` | User switches guru persona | `new_persona_id`, `previous_persona_id` |

### 2. Tools (Yoga Quiz)
| Event Name | Trigger | Properties |
|------------|---------|------------|
| `tool_quiz_started` | User clicks 'Start Quiz' | - |
| `tool_quiz_completed` | User reaches results page | `result_path` (e.g., 'bhakti', 'karma') |
| `tool_quiz_lead_captured` | User submits email | - |

### 3. Conversion / Funnel
| Event Name | Trigger | Properties |
|------------|---------|------------|
| `signup_completed` | User creates account | `method` (email, google) |
| `upgrade_viewed` | User views pricing/upgrade modal | `source` (e.g., 'chat_limit', 'nav') |

## Implementation Steps
1. **Install**: `npm install @next/third-parties`
2. **Configure**: Add `<GoogleAnalytics gaId="G-..." />` to root layout.
3. **Utility**: Create `lib/analytics.ts` for type-safe event firing.
4. **Instrument**: Add `sendEvent` calls to key components (`ChatInput`, `QuizResults`, etc.).

## Privacy
- IP Anonymization enabled by default in GA4.
- No PII (Personal Identifiable Information) in event properties (e.g., don't track message content).
