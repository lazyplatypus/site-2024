#!/bin/bash

# Vercel Deployment Setup Script for site-2024
# This script will help you set up and deploy to Vercel

set -e

echo "🚀 Setting up Vercel deployment for site-2024..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "   Install it with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found: $(vercel --version)"
echo ""

# Check if already logged in
if vercel whoami &> /dev/null; then
    echo "✅ Already logged in as: $(vercel whoami)"
else
    echo "🔐 Please log in to Vercel..."
    echo "   This will open your browser for authentication."
    vercel login
fi

echo ""
echo "📦 Linking project to Vercel..."
echo "   When prompted:"
echo "   - Select team: daniel's projects"
echo "   - Create new project or link to existing"
echo "   - Project name: site-2024"
echo ""

# Link the project (non-interactive if possible)
vercel link --yes 2>&1 || vercel link

echo ""
echo "✅ Project linked!"
echo ""
echo "📝 Next steps:"
echo "   1. Add environment variables in Vercel Dashboard:"
echo "      - NEXT_PUBLIC_SUPABASE_URL"
echo "      - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   2. See vercel-env-vars.txt for the values"
echo "   3. Deploy with: vercel --prod"
echo ""
echo "🌐 Or deploy now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "🚀 Deploying to production..."
    vercel --prod
    echo ""
    echo "✅ Deployment complete!"
else
    echo ""
    echo "💡 To deploy later, run: vercel --prod"
fi

