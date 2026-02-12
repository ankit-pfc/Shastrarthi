# Vercel Deployment Fix Plan

## Problem Analysis

The 404 NOT_FOUND error when deploying to Vercel is caused by Vercel not correctly identifying the Next.js application structure. Even though the build succeeds, the deployed application returns 404 on the main domain.

### Root Cause
Vercel may have linked the project incorrectly or needs explicit configuration to properly detect the Next.js framework and build output directory.

## Solution

### 1. Create `vercel.json` Configuration File

Create a `vercel.json` file in the `shastrarthi/` directory with the following configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

This explicitly tells Vercel:
- This is a Next.js project
- How to build the application
- Where the build output is located
- How to install dependencies

### 2. Verify Environment Variables

Ensure the following environment variables are set in the Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `GEMINI_API_KEY` - Your Gemini API key for LearnLM

### 3. Clean Redeploy

After adding the configuration file:

```bash
# From shastrarthi directory
vercel --prod
```

Or if using the Vercel dashboard:
1. Push the vercel.json to your repository
2. Trigger a new deployment from Vercel dashboard

### 4. Alternative: Reset Project Link

If the above doesn't work, the project may need to be relinked:

```bash
# Unlink the current project
vercel unlink

# Redeploy fresh
vercel --prod
```

## Verification Steps

1. Check that build succeeds in Vercel dashboard
2. Access the main domain (e.g., https://your-project.vercel.app)
3. Verify the homepage loads correctly
4. Test navigation to other routes (e.g., /auth/login, /discover)

## Additional Notes

- The project structure is correct with `app/page.tsx` at the root
- The `next.config.js` is properly configured
- The `package.json` has correct build scripts
- No framework detection issues should exist with the vercel.json in place
