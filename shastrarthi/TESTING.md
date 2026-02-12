# Testing Guide - Shastrarthi

## Overview
This document outlines the testing scenarios and procedures for the Shastrarthi MVP.

## Prerequisites
- Node.js 18+ installed
- Supabase project configured with environment variables
- Gemini API key configured (for AI chat testing with LearnLM)

## Environment Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Set up environment variables in .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## Running Tests

### Development Server
```bash
npm run dev
```

### Build Test
```bash
npm run build
npm run start
```

### Type Checking
```bash
npm run type-check
```

## Test Scenarios

### 1. Authentication Flow

#### Sign Up
- [ ] Navigate to `/auth/signup`
- [ ] Enter valid email and password (6+ characters)
- [ ] Enter name
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Verify redirect to home page
- [ ] Test with invalid email format
- [ ] Test with short password (< 6 characters)
- [ ] Test with already registered email

#### Sign In
- [ ] Navigate to `/auth/login`
- [ ] Enter registered email and password
- [ ] Submit form
- [ ] Verify successful login
- [ ] Test with invalid credentials
- [ ] Test with unverified email
- [ ] Verify redirect behavior

#### Google OAuth
- [ ] Click "Sign in with Google"
- [ ] Complete OAuth flow
- [ ] Verify user is logged in
- [ ] Verify profile is created

#### Sign Out
- [ ] Click sign out button
- [ ] Verify redirect to login
- [ ] Verify session is cleared
- [ ] Verify protected routes redirect to login

### 2. Text Discovery

#### Browse Texts
- [ ] Navigate to `/discover`
- [ ] Verify all texts load
- [ ] Verify text cards display correctly
- [ ] Verify category badges
- [ ] Verify difficulty badges
- [ ] Click on a text card
- [ ] Verify redirect to reader page

#### Search Functionality
- [ ] Type in search bar
- [ ] Verify debouncing works
- [ ] Verify search results update
- [ ] Test with no results
- [ ] Clear search and verify all texts show

#### Filter Functionality
- [ ] Select category filter
- [ ] Verify texts filter by category
- [ ] Select difficulty filter
- [ ] Verify texts filter by difficulty
- [ ] Combine filters
- [ ] Clear all filters
- [ ] Verify all texts show again

### 3. Text Reader

#### View Text
- [ ] Navigate to a text reader page
- [ ] Verify text title displays
- [ ] Verify Sanskrit title displays
- [ ] Verify description displays
- [ ] Verify all verses load

#### Verse Display
- [ ] Verify Sanskrit text displays
- [ ] Verify transliteration displays
- [ ] Verify translation displays
- [ ] Toggle Sanskrit on/off
- [ ] Toggle transliteration on/off
- [ ] Verify toggles persist

#### Reader Controls
- [ ] Test font size increase
- [ ] Test font size decrease
- [ ] Test theme toggle (light/dark)
- [ ] Test back button
- [ ] Verify controls work correctly

#### Progress Bar
- [ ] Verify progress bar displays
- [ ] Verify current verse tracking
- [ ] Verify total verses count

### 4. AI Chat

#### Open Chat Panel
- [ ] Navigate to reader page
- [ ] Verify chat panel is visible
- [ ] Minimize chat panel
- [ ] Maximize chat panel
- [ ] Close chat panel

#### Send Message
- [ ] Type a question
- [ ] Press Enter or click Send
- [ ] Verify user message appears
- [ ] Verify AI response streams
- [ ] Verify response is complete
- [ ] Test with empty input
- [ ] Test with very long input (> 1000 chars)

#### Quick Actions
- [ ] Click quick action button
- [ ] Verify question populates input
- [ ] Verify quick actions hide after first question

#### Error Handling
- [ ] Test without Gemini API key
- [ ] Test with invalid API key
- [ ] Test network error scenario
- [ ] Verify error message displays

### 5. Bookmarks

#### Add Bookmark
- [ ] Click bookmark button on a verse
- [ ] Verify bookmark is added
- [ ] Verify bookmark icon changes

#### Remove Bookmark
- [ ] Navigate to `/library`
- [ ] Go to Bookmarks tab
- [ ] Click remove on a bookmark
- [ ] Verify bookmark is removed

#### View Bookmarks
- [ ] Verify all bookmarks list
- [ ] Verify verse reference
- [ ] Verify text title
- [ ] Verify timestamp

### 6. Notes

#### Add Note
- [ ] Click note button on a verse
- [ ] Verify note modal opens
- [ ] Type note content
- [ ] Save note
- [ ] Verify note is saved

#### Edit Note
- [ ] Click on existing note
- [ ] Verify note modal opens with content
- [ ] Edit note content
- [ ] Save changes
- [ ] Verify note is updated

#### Delete Note
- [ ] Navigate to `/library`
- [ ] Go to Notes tab
- [ ] Click delete on a note
- [ ] Verify note is removed

### 7. My Library

#### Saved Texts
- [ ] Navigate to `/library`
- [ ] Verify Saved Texts tab is active
- [ ] Verify saved texts list
- [ ] Remove a saved text
- [ ] Verify text is removed

#### Tab Navigation
- [ ] Switch between Saved Texts, Bookmarks, Notes
- [ ] Verify active tab styling
- [ ] Verify correct content displays

#### Empty States
- [ ] Test with no saved texts
- [ ] Test with no bookmarks
- [ ] Test with no notes
- [ ] Verify empty state messages

### 8. Responsive Design

#### Mobile (< 768px)
- [ ] Test navigation menu
- [ ] Test text cards layout
- [ ] Test chat panel behavior
- [ ] Test form inputs
- [ ] Verify touch targets are accessible

#### Tablet (768px - 1024px)
- [ ] Test grid layouts
- [ ] Test sidebar behavior
- [ ] Verify proper spacing

#### Desktop (> 1024px)
- [ ] Test full layout
- [ ] Test hover states
- [ ] Verify proper use of screen space

### 9. Accessibility

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Verify focus indicators
- [ ] Test Enter key on buttons
- [ ] Test Escape key to close modals
- [ ] Test arrow keys in dropdowns

#### Screen Reader
- [ ] Test with NVDA/JAWS
- [ ] Verify all images have alt text
- [ ] Verify form labels are announced
- [ ] Verify error messages are announced
- [ ] Test skip to content link

#### Color Contrast
- [ ] Verify text contrast ratios
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify color isn't only indicator

#### Reduced Motion
- [ ] Test with prefers-reduced-motion
- [ ] Verify animations respect preference

### 10. Error Handling

#### Network Errors
- [ ] Disconnect network
- [ ] Try to load a page
- [ ] Verify error message displays
- [ ] Test retry functionality

#### 404 Errors
- [ ] Navigate to non-existent page
- [ ] Verify 404 page displays
- [ ] Test back to home link

#### Server Errors
- [ ] Simulate server error
- [ ] Verify error boundary catches error
- [ ] Test error recovery

## Performance Testing

### Load Time
- [ ] Measure initial page load (< 3s)
- [ ] Measure navigation between pages (< 1s)
- [ ] Measure API response times

### Bundle Size
- [ ] Run build and check bundle size
- [ ] Verify no unnecessary dependencies
- [ ] Check for code splitting opportunities

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Known Issues

Document any known issues found during testing:

1. 
2. 
3. 

## Test Results

| Feature | Status | Notes |
|----------|--------|-------|
| Authentication | ⬜ | |
| Text Discovery | ⬜ | |
| Text Reader | ⬜ | |
| AI Chat | ⬜ | |
| Bookmarks | ⬜ | |
| Notes | ⬜ | |
| My Library | ⬜ | |
| Responsive Design | ⬜ | |
| Accessibility | ⬜ | |
| Error Handling | ⬜ | |

## Sign-off

Tested by: _________________
Date: _________________
Version: _________________
