# Free Tool Strategy: Yoga Path Finder

## Core Concept
**Tool Name:** Yoga Path Finder
**Hook:** "Discover your natural spiritual path (marga) based on your personality and tendencies."
**Value Prop:** Helps beginners navigate the overwhelming number of practices by narrowing down to their primary inclination (Karma, Bhakti, Jnana, Raja).

## Logic (Simple Scoring)
The quiz will have 5-7 questions. Each answer maps to one of the 4 paths.
- **Karma Yoga** (Action/Service)
- **Bhakti Yoga** (Devotion/Emotion)
- **Jnana Yoga** (Intellect/Inquiry)
- **Raja Yoga** (Meditation/Discipline)

### Sample Questions
1. **Motivation**: What drives you most?
   - Understanding the truth (Jnana)
   - Feeling connected to the Divine (Bhakti)
   - Making a tangible difference (Karma)
   - Mastering your own mind (Raja)

2. **Stress Response**: When stressed, you...
   - Analyze the root cause (Jnana)
   - Pray or seek comfort (Bhakti)
   - Keep busy with work (Karma)
   - Take deep breaths/meditate (Raja)

## User Flow
1. **Landing Page**: Hook + "Start Quiz" button.
2. **Quiz Interface**: One question at a time (smooth transition).
3. **Results Calculation**: Tally scores.
4. **Gate (Optional)**: "Enter email to save results and get a reading list" (Skip option available).
5. **Results Page**: 
   - Primary Path Description.
   - Recommended Shastra (e.g., "Read Bhagavad Gita Ch 3 for Karma Yoga").
   - CTA: "Ask the Yoga Guru about this path" (Links to Shastrarthi Chat).

## Technical Implementation
- **Route**: `/tools/yoga-path-quiz`
- **Components**: `QuizContainer`, `QuestionCard`, `ResultsView`.
- **State**: Simple local state (React `useState`).

## SEO Strategy
- **Keywords**: "What yoga path is right for me", "Karma vs Bhakti vs Jnana", "Spiritual personality test".
- **Meta**: "Take this 2-minute quiz to discover your ideal yoga path according to the Bhagavad Gita."
