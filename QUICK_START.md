# Quick Start: Deploy to Vercel

## Fastest Method (API - No Browser)

1. **Get Vercel Token** (one-time):
   - Visit: https://vercel.com/account/tokens
   - Click "Create Token"
   - Copy the token

2. **Run automated setup**:
```bash
VERCEL_TOKEN=your_token_here node setup-vercel-api.js
```

3. **Link and deploy**:
```bash
vercel link
vercel --prod
```

Done! 🎉

---

## Alternative: Interactive Setup

```bash
./setup-vercel.sh
```

This opens your browser for authentication and guides you through the process.

---

## What's Already Configured

✅ `vercel.json` - Project configuration  
✅ Environment variables ready (see `vercel-env-vars.txt`)  
✅ Supabase credentials retrieved  
✅ Build configuration set  

You just need to authenticate and deploy!

