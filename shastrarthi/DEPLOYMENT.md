# Deployment Guide - Shastra Platform

## Overview
This guide covers deploying the Shastra Platform to production.

## Prerequisites

- Node.js 18+ runtime
- Supabase project (free tier or paid)
- Gemini API key (for LearnLM)
- Vercel account (recommended) or alternative hosting

## Environment Variables

Create the following environment variables in your hosting platform:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# LearnLM / Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy the Project URL
5. Copy the anon/public key

### Getting Gemini API Key (for LearnLM)

1. Go to [makersuite.google.com](https://makersuite.google.com) or [ai.google.dev](https://ai.google.dev)
2. Navigate to API Keys
3. Create a new API key
4. Copy the key

## Database Setup

### Run Migrations

```bash
# Apply the initial schema
supabase db push

# Or apply manually via Supabase dashboard
# Go to SQL Editor → Run the migration file
```

### Seed Initial Data

```bash
# Load seed data (optional)
# The seed-data/texts.json contains initial texts
# You can import these via Supabase dashboard or write a script
```

### Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own saved texts" ON user_texts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add saved texts" ON user_texts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved texts" ON user_texts
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add bookmarks" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks" ON bookmarks
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON reading_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON reading_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON reading_progress
    FOR UPDATE USING (auth.uid() = user_id);
```

### Set Up OAuth (Google Sign-In)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect URL: `https://your-domain.com/auth/callback`
4. Save configuration

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment experience for Next.js apps.

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
1. Link to existing project or create new
2. Add environment variables
3. Deploy

#### Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Add environment variables in Netlify dashboard.

### Option 3: Self-Hosted (VPS/Cloud)

```bash
# Build the application
npm run build

# Start production server
npm start
```

Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "shastra-platform" -- start
pm2 save
pm2 startup
```

Configure Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 4: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t shastra-platform .
docker run -p 3000:3000 --env-file .env shastra-platform
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication flow (sign up, sign in, sign out)
- [ ] Test Google OAuth
- [ ] Test text discovery and search
- [ ] Test text reader functionality
- [ ] Test AI chat with streaming
- [ ] Test bookmarks and notes
- [ ] Test library page
- [ ] Verify responsive design on mobile
- [ ] Test dark mode
- [ ] Verify error pages work
- [ ] Check browser console for errors
- [ ] Test with screen reader (accessibility)
- [ ] Verify analytics/tracking (if added)

## Performance Optimization

### Enable Caching

Add caching headers in `next.config.js`:

```javascript
module.exports = {
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|webp)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};
```

### Enable Compression

Vercel and Netlify handle this automatically. For self-hosted, use Nginx compression.

### Image Optimization

Use Next.js Image component for all images:

```jsx
import Image from 'next/image';

<Image
    src="/path/to/image.jpg"
    alt="Description"
    width={800}
    height={600}
    priority
/>
```

## Monitoring

### Set Up Error Tracking

Consider adding Sentry or similar for error tracking:

```bash
npm install @sentry/nextjs
```

### Set Up Analytics

Consider adding Google Analytics or Plausible:

```bash
npm install @next/third-parties
```

## Security

### HTTPS

Always use HTTPS in production. Let's Encrypt provides free SSL certificates.

### Environment Variables

- Never commit `.env.local` to version control
- Rotate API keys periodically
- Use different keys for development and production

### Rate Limiting

Consider implementing rate limiting for API routes:

```javascript
// app/api/chat/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 m"),
});
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart the deployment after adding variables
- Check for typos in variable names

### Supabase Connection Issues

- Verify Supabase project is active
- Check RLS policies are not blocking access
- Verify anon/public key is correct

### LearnLM / Gemini API Errors

- Verify API key is valid
- Check API quota status
- Verify model availability in your region

## Maintenance

### Regular Tasks

1. Monitor API usage (Supabase, Gemini)
2. Review error logs
3. Update dependencies regularly
4. Backup database (Supabase does this automatically)
5. Review and update content (texts, verses)

### Updates

```bash
# Pull latest changes
git pull origin main

# Install updated dependencies
npm install

# Rebuild and restart
npm run build
npm start
```

## Support

For issues or questions:
- Check GitHub Issues
- Review Supabase documentation
- Review Gemini documentation
- Contact support channels
