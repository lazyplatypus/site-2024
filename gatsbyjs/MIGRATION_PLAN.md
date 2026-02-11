# Migration Plan: Next.js to GatsbyJS

## Document Info
- **Created**: February 10, 2026
- **Source**: Next.js 15.1.7
- **Target**: GatsbyJS 5.14.1
- **Path**: `/gatsbyjs`

---

## Current Tech Stack Analysis

### Framework
- **Next.js** 15.1.7 (App Router)
  - Server Components by default
  - File-based routing (`app/` directory)
  - Built-in API routes
  - Server-side rendering (SSR)
  - View transitions support via `next-view-transitions`

- **Target**: **Gatsby** 5.14.1
  - Client-side rendering with SSR at build time
  - File-based routing (`src/pages/` directory)
  - Static Site Generation (SSG) focus
  - GraphQL data layer
  - Plugin ecosystem

### Core Dependencies

| Dependency | Next.js Version | Gatsby Equivalent |
|------------|-----------------|-------------------|
| React | 19.0.0 | 18.3.1 (downgrade) |
| MDX | @mdx-js/react 3.0.1, @next/mdx 15.1.7 | gatsby-plugin-mdx 5.14.0 |
| Tailwind | 4.0.0-alpha.23 | Same |
| PostCSS | 8.4.x + @tailwindcss/postcss | Same |
| TypeScript | 5.x | Same |
| Supabase | @supabase/supabase-js 2.84.0 | Same (client-side only) |
| Analytics | @vercel/analytics 1.3.1 | Same |
| Syntax Highlighting | sugar-high 0.7.0 | Same |
| Utilities | date-fns 3.6.0 | Same |

### Styling
- **Tailwind CSS** 4.0.0-alpha.23
- Custom CSS with view transition animations
- Theme-based color variables
- Responsive design with mobile sidebar

---

## Pages to Migrate

### 1. Homepage (`/`)
- **Source**: `app/page.tsx`
- **Features**:
  - Dynamic blog post listing from filesystem
  - Animated name component
  - Profile image from CDN
  - Links to Cerebras and New Relic
- **Gatsby Strategy**: Use GraphQL query to fetch MDX files and display sorted by date

### 2. Blog Post: "How is Cerebras so Fast?" (`/blog/how-is-cerebras-so-fast`)
- **Source**: `app/blog/how-is-cerebras-so-fast/page.mdx`
- **Metadata**:
  - Title: "Why is Cerebras Fast?"
  - Date: 2024-08-03
- **Content**:
  - MDX with embedded components
  - Multiple images from CDN (utfs.io)
  - Comments component
  - Cerebras-specific technical content

### 3. Blog Post: "Reflecting on 25" (`/blog/reflecting-on-25`)
- **Source**: `app/blog/reflecting-on-25/page.mdx`
- **Metadata**:
  - Title: "Reflecting on 25"
  - Date: 2024-10-13
- **Content**:
  - Personal reflection post
  - MDX formatting
  - Comments component

### 4. Blog Post: "The War on Slop" (`/blog/the-war-on-slop`)
- **Source**: `app/blog/the-war-on-slop/page.mdx`
- **Metadata**:
  - Title: "The War on Slop"
  - Date: [not specified]
- **Content**:
  - Conference recap
  - Multiple images from CDN
  - Comments component

### 5. Blog Post: "Cerebras Code Offsite Postmortem" (`/blog/offsite`)
- **Source**: `app/blog/offsite/page.mdx`
- **Metadata**:
  - Title: "Cerebras Code Offsite Postmortem"
  - Date: 2026-02-08
- **Content**:
  - Complex post with multiple components
  - OffsitePageTitle, OffsiteHero components
  - ImageGallery, HoverImageSequence components
  - Comments component

---

## Components to Migrate

### Core Components

#### 1. `AnimatedName`
- **Source**: `app/animated-name.tsx`
- **Purpose**: Links back to homepage with styled text
- **Migration Notes**: Simple link component, needs Gatsby `<Link>` replacement

#### 2. `BlogLayout`
- **Source**: `app/components/BlogLayout.tsx`
- **Purpose**: Wrapper for blog posts with heading extraction for sidebar
- **Client-side**: Yes ('use client')
- **Migration Notes**: Uses `useEffect` to extract headings from DOM. Will need similar approach in Gatsby

#### 3. `SidebarNav`
- **Source**: `app/components/SidebarNav.tsx`
- **Purpose**: Fixed sidebar navigation with scroll observation
- **Features**:
  - IntersectionObserver for active heading tracking
  - Mobile responsive (horizontal scroll on mobile)
  - CSS animations
- **Migration Notes**: Client-side component, minimal changes needed

#### 4. `TableOfContents`
- **Source**: `app/components/TableOfContents.tsx`
- **Purpose**: Alternative TOC (appears unused in current implementation)
- **Migration Notes**: Can be used or removed based on preference

#### 5. `Comments`
- **Source**: `/app/components/Comments.tsx`
- **Purpose**: Supabase-powered comments display
- **Features**:
  - Fetch via API
  - Copy curl command for adding comments
  - Formatted date display
- **Migration Notes**: API endpoint needs migration to Gatsby Functions or external service

#### 6. `TextHighlighting`
- **Source**: `app/components/TextHighlighting.tsx`
- **Purpose**: Allow users to highlight text with a floating button
- **Features**:
  - Text selection detection
  - Span wrapping for highlights
  - Undo/clear functionality
- **Migration Notes**: Client-side only, should work as-is

#### 7. `OffsitePageTitle`
- **Source**: `app/components/OffsitePageTitle.tsx`
- **Purpose**: Styled page header for offsite post
- **Features**: Text splitting by periods for line breaks
- **Migration Notes**: Can migrate as-is

#### 8. `OffsiteHero`
- **Source**: `app/components/OffsiteHero.tsx`
- **Purpose**: Hero section with image and text
- **Features**: Responsive layout, optional title/subtitle
- **Migration Notes**: Replace Next.js `<Image>` with `<img>` or Gatsby image optimization

#### 9. `ImageGallery`
- **Source**: `app/components/ImageGallery.tsx`
- **Purpose**: Grid gallery with lightbox modal
- **Features**:
  - Grid layout
  - Click to expand
  - Close button
- **Migration Notes**: Client-side component, minimal changes

#### 10. `HoverImageSequence`
- **Source**: `app/components/HoverImageSequence.tsx`
- **Purpose**: Animated image sequence on hover
- **Features**:
  - Frame-based animation (DSC00882-DSC00906)
  - 10ms frame timing
  - Preloading所有帧
- **Migration Notes**: Client-side only, should work as-is

### Configuration Files

#### `mdx-components.tsx`
- **Source**: `mdx-components.tsx`
- **Purpose**: Custom MDX component mappings
- **Components**: h1-h4, p, ul, ol, li, a, code, Table, blockquote, img, em, strong
- **Migration Notes**: Configure in Gatsby MDX plugin or use `wrapRootElement`
- **Special**: Uses `Link` from next-view-transitions, needs replacement
- **Syntax Highlighting**: Uses `sugar-high` library

---

## API Routes Migration

### `/api/comments` (GET/POST)
- **Source**: `app/api/comments/route.ts`
- **Purpose**: Supabase comments CRUD operations
- **Next.js**: Built-in App Router API routes
- **Gatsby Options**:
  1. **Gatsby Functions** (if hosting on Netlify/Vercel)
  2. **Serverless function** (AWS Lambda, Cloudflare Workers)
  3. **Vercel Functions** (if hosting on Vercel)
  4. **External API** (Supabase Edge Functions)
- **Recommendation**: Use Vercel Functions or serverless-compatible solution

---

## Configuration Migration

### Root Configuration

| File | Next.js Path | Gatsby Path | Notes |
|------|-------------|-------------|-------|
| Package Manager | `package.json` | `gatsbyjs/package.json` | ✓ Already created |
| TypeScript | `tsconfig.json` | `gatsbyjs/tsconfig.json` | ✓ Already created |
| PostCSS | `postcss.config.mjs` | `gatsbyjs/postcss.config.js` | ✓ Already created |
| Tailwind | Not separate | `gatsbyjs/tailwind.config.js` | ✓ Already created |

### Next.js-Specific Configs

#### `next.config.*` → `gatsby-config.js`
No explicit Next.js config found, but need to ensure:
- Site metadata迁移
- Plugin configuration

### `app/layout.tsx` → Gatsby Root Wrappers

**Next.js Root Layout Components**:
- Metadata (title, description)
- Google font imports (Inter)
- View transitions wrapper
- Analytics (Vercel + GA)
- Footer component
- Scripts

**Gatsby Equivalent**:
```
gatsby-browser.js: wrapRootElement (client-side)
gatsby-ssr.js: wrapRootElement (server-side)
src/components/layout.tsx: Main layout wrapper
```

---

## Environment Variables

### Required Variables
```bash
NEXT_PUBLIC_SUPABASE_URL → GATSBY_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY → GATSBY_SUPABASE_ANON_KEY
```

### Migration Notes
- Change `NEXT_PUBLIC_` prefix to `GATSBY_`
- Add to `.env.production` and `.env.development`
- Ensure Gatsby processes these at build time

---

## Styling Migration

### Global CSS (`app/globals.css`)
- **Source**: 425 lines of custom CSS
- **Features**:
  - Tailwind imports
  - Theme variables
  - Code block styling
  - View transition animations
  - Sidebar navigation styles
  - Responsive breakpoints
  - Scrollbar styling
- **Migration**: Copy to `gatsbyjs/src/styles/globals.css`

### Key CSS Adjustments Needed
1. **View Transitions**: Replace with CSS animations or keep browser-compatible version
2. **Font Loading**: Ensure Inter font loads correctly in Gatsby
3. **CSS Variables**: Verify all Tailwind variables work with v4 alpha

---

## Deployment Considerations

### From Next.js (Vercel) to Gatsby

#### Option 1: Vercel
- **Support**: Native Gatsby support
- **Functions**: Can use Vercel Functions for API routes
- **Pros**: Same platform, easier migration
- **Cons**: Requires function configuration

#### Option 2: Netlify
- **Support**: Native Gatsby support
- **Functions**: Built-in serverless functions
- **Pros**: Optimized for Gatsby
- **Cons**: New platform to learn

#### Option 3: Cloudflare Pages
- **Support**: Gatsby support
- **Functions**: Cloudflare Workers
- **Pros**: Fast global CDN
- **Cons**: API route migration complexity

### Build & Deploy
```bash
# Next.js
npm run build

# Gatsby
cd gatsbyjs
npm run build
npm run serve  # Preview
```

---

## Migration Steps

### Phase 1: Setup & Configuration ✓ (Already Done)
- [x] Initialize Gatsby project
- [x] Install dependencies
- [x] Configure Tailwind CSS
- [x] Configure MDX plugin
- [x] Set up filesystem sources
- [x] Create basic gatsby-node.js

### Phase 2: Layout & Core Components
- [ ] Migrate root layout to Gatsby wrappers
- [ ] Create `src/components/layout.tsx`
- [ ] Migrate `<Footer>` component
- [ ] Set up font loading (Inter)
- [ ] Configure site metadata
- [ ] Copy `globals.css`
- [ ] Test view transition behavior

### Phase 3: Homepage
- [ ] Create `src/pages/index.tsx`
- [ ] Implement blog listing via GraphQL
- [ ] Migrate `AnimatedName` component
- [ ] Add profile image
- [ ] Test homepage rendering

### Phase 4: Blog System
- [ ] Create `src/templates/blog-post.tsx`
- [ ] Implement GraphQL query for MDX data
- [ ] Migrate `BlogLayout` component
- [ ] Migrate `SidebarNav` component
- [ ] Implement heading extraction
- [ ] Test all blog posts render correctly
- [ ] Add frontmatter configuration

### Phase 5: MDX Component Configuration
- [ ] Configure MDX components plugin
- [ ] Migrate `mdx-components.tsx`
- [ ] Replace `next-view-transitions` Link with Gatsby `<Link>`
- [ ] Test syntax highlighting (sugar-high)
- [ ] Verify all MDX features work

### Phase 6: Component Migration
- [ ] Migrate `TextHighlighting`
- [ ] Migrate `Comments` (UI only)
- [ ] Migrate `OffsitePageTitle`
- [ ] Migrate `OffsiteHero`
- [ ] Migrate `ImageGallery`
- [ ] Migrate `HoverImageSequence`
- [ ] Test all client-side components

### Phase 7: API Routes & Backend
- [ ] Deploy API route for comments
  - Option: Vercel Functions / Netlify Functions / Supabase Edge
- [ ] Update `Comments` component API endpoint
- [ ] Test Supabase connectivity
- [ ] Verify comment posting works

### Phase 8: Analytics & Scripts
- [ ] Add Vercel Analytics
- [ ] Add Google Analytics
- [ ] Add Simple Analytics
- [ ] Configure site metadata
- [ ] Test analytics tracking

### Phase 9: Content Migration
- [ ] Copy blog MDX files to `src/content/blog-flattened/`
- [ ] Format frontmatter consistently
- [ ] Update image paths if needed
- [ ] Test all blog posts
- [ ] Verify links work

### Phase 10: Testing & Polish
- [ ] Run `gatsby build` - check for errors
- [ ] Test all pages locally
- [ ] Test responsive design (mobile, tablet)
- [ ] Test animations and transitions
- [ ] Check console for errors
- [ ] Verify deployment configuration
- [ ] Deploy to production
- [ ] Run smoke tests on live site

### Phase 11: Cleanup & Documentation
- [ ] Remove unused dependencies
- [ ] Document any custom scripts
- [ ] Update README
- [ ] Archive Next.js code if desired
- [ ] Update DNS/domains

---

## Known Challenges & Solutions

### Challenge 1: View Transitions
**Issue**: `next-view-transitions` is Next.js-specific
**Solution**: Use CSS animations or Gatsby's page transition libraries

### Challenge 2: Server Components
**Issue**: Next.js 15 uses Server Components by default
**Solution**: Gatsby is client-side focused, all components should use `use client` where needed

### Challenge 3: Dynamic Filesystem Reading
**Issue**: Next.js can read filesystem at runtime/SSR time
**Solution**: Gatsby reads filesystem at build time via GraphQL and gatsby-node.js

### Challenge 4: API Routes
**Issue**: Next.js has built-in API routes
**Solution**: Use serverless functions (Vercel/Netlify) or external API

### Challenge 5: MDX Metadata
**Issue**: Next.js uses `export const metadata` in MDX
**Solution**: Gatsby uses frontmatter (YAML) in MDX
**Migration**:
```markdown
---
title: "Blog Title"
date: "2024-08-03"
---
```

### Challenge 6: Link Components
**Issue**: `Link` from `next-view-transitions` throughout codebase
**Solution**: Replace with Gatsby's `<Link>` from `gatsby`

### Challenge 7: Image Optimization
**Issue**: Next.js `<Image>` component with automatic optimization
**Solution**: Gatsby Image plugins (`gatsby-plugin-sharp`, `gatsby-transformer-sharp`)
**Note**: External CDNs can keep using regular `<img>` tags

### Challenge 8: Font Loading
**Issue**: Next.js `next/font/google` for optimized fonts
**Solution**: Gatsby doesn't optimize fonts natively
**Options**:
1. Use Google Fonts via CSS/HTML
2. Use `gatsby-plugin-google-fonts`
3. Use `gatsby-plugin-web-font-loader`

### Challenge 9: React Version Downgrade
**Issue**: Next.js uses React 19, Gatsby uses React 18
**Solution**:
- React 19 features not widely used in current codebase
- Verify no React 19-specific APIs are used
- Test all components after downgrade

### Challenge 10: Environment Variables
**Issue**: Variables must use `GATSBY_` prefix for client-side access
**Solution**: Update all environment variable references

---

## File Mapping

| Next.js Path → | Gatsby Path |
|---------------|-------------|
| `app/layout.tsx` | `gatsby-browser.js`, `gatsby-ssr.js`, `src/components/layout.tsx` |
| `app/page.tsx` | `gatsbyjs/src/pages/index.tsx` |
| `app/globals.css` | `gatsbyjs/src/styles/globals.css` |
| `app/animated-name.tsx` | `gatsbyjs/src/components/animated-name.tsx` |
| `app/components/*.tsx` | `gatsbyjs/src/components/*.tsx` |
| `app/blog/*/page.mdx` | `gatsbyjs/src/content/blog-flattened/*.mdx` |
| `mdx-components.tsx` | Configure via MDX plugin or wrapRootElement |
| `lib/supabase.ts` | `gatsbyjs/src/lib/supabase.ts` |
| `app/api/comments/route.ts` | Vercel Functions / serverless |

---

## Testing Checklist

### Functional Tests
- [ ] Homepage loads correctly
- [ ] All blog posts accessible
- [ ] MDX content renders properly
- [ ] Images load from CDN
- [ ] Comments display (read-only)
- [ ] Navigation links work
- [ ] Footer links open correctly

### Responsive Tests
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Sidebar nav on mobile
- [ ] Image galleries responsive

### Component Tests
- [ ] Sidebar navigation tracks scroll
- [ ] Text highlighting works
- [ ] Image gallery lightbox functions
- [ ] Hover image animation plays
- [ ] Offsite components render correctly

### Performance Tests
- [ ] Lighthouse score > 90
- [ ] Build time reasonable
- [ ] First Contentful Paint < 1s
- [ ] Time to Interactive < 2s

---

## Post-Migration Maintenance

### Regular Updates
- Keep Gatsby plugins updated
- Monitor React ecosystem for version compatibility
- Update Tailwind when stable
- Monitor Supabase client updates

### Potential Future Enhancements
- Add Gatsby Image plugin for local images
- Implement Gatsby Head API for SEO
- Add structured data (JSON-LD)
- Consider migrating to Gatsby Script component for analytics
- Explore Gatsby Cloud for CI/CD

---

## Resources

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [Gatsby MDX Plugin](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/)
- [Migrating from Next.js to Gatsby](https://www.gatsbyjs.com/docs/migrating-from-nextjs/)
- [Gatsby + Tailwind CSS](https://www.gatsbyjs.com/docs/how-to/styling/tailwind-css/)
- [Gatsby Functions](https://www.gatsbyjs.com/docs/reference/functions/)