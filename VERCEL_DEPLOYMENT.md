# Vercel Deployment Guide for site-2024

## 🚀 Quick Setup (Automated)

### Option A: API-Based Setup (Fastest - No Browser Required)

1. Get a Vercel token:
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Copy the token

2. Run the automated setup:
```bash
VERCEL_TOKEN=your_token_here node setup-vercel-api.js
```

This will:
- ✅ Create the Vercel project
- ✅ Set up all environment variables automatically
- ✅ Configure everything for you

3. Link and deploy:
```bash
vercel link
vercel --prod
```

### Option B: Interactive CLI Setup

Run the setup script:
```bash
./setup-vercel.sh
```

This will guide you through:
- Login (opens browser)
- Project linking
- Deployment

## Manual Setup

### Option 1: Vercel CLI (Recommended for first-time setup)

1. Install Vercel CLI (if not already installed):
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

4. Follow the prompts to:
   - Link to an existing project or create a new one
   - Set up your project name (e.g., "site-2024")
   - Configure settings

5. For production deployment:
```bash
vercel --prod
```

### Option 2: Git Integration (Recommended for ongoing deployments)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically detect Next.js and configure the project
4. Set up environment variables (see below)
5. Deploy!

## Environment Variables

You **must** configure these environment variables in the Vercel dashboard:

1. Go to your project settings → Environment Variables
2. Add the following:

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
  - Get this from: Supabase Dashboard → Settings → API → Project URL
  - Current project ID: `qmwfpdwbzmxitclvjsus`

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
  - Get this from: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`

### Setting Environment Variables

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable for all environments (Production, Preview, Development)
3. Redeploy after adding variables

## Project Configuration

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

## Post-Deployment Checklist

- [ ] Environment variables configured in Vercel dashboard
- [ ] Test the deployed site
- [ ] Verify Supabase connection works
- [ ] Check that blog posts render correctly
- [ ] Test comments functionality

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18.x by default)
- Check build logs in Vercel dashboard

### Environment Variables Not Working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/updating variables
- Check variable names match exactly (case-sensitive)

### Supabase Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Review Supabase logs in dashboard

## Continuous Deployment

Once connected via Git:
- Every push to `main` branch → Production deployment
- Every pull request → Preview deployment
- Automatic deployments on every commit

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls
```

