# ZedTunes - Production Deployment Guide for Vercel

## 🚀 Quick Start Deployment

### Step 1: Prepare Local Environment

```bash
# Install dependencies
npm ci

# Build and test locally
npm run build

# Run development server
npm run dev

# Visit http://localhost:3000
```

### Step 2: Set Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update with your actual Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SITE_URL=https://zedtunez.vercel.app
```

### Step 3: Deploy to Vercel

#### Option A: Via GitHub (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Vercel auto-detects Next.js
6. Add Environment Variables (see Step 4)
7. Click "Deploy"

#### Option B: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and set environment variables
```

### Step 4: Configure Environment Variables in Vercel

1. Go to **Settings → Environment Variables**
2. Add each variable from `.env.local.example`
3. Set for: **Production**, **Preview**, **Development**
4. Redeploy after adding variables

### Step 5: Custom Domain (Optional)

1. In Vercel: **Settings → Domains**
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)
4. Update `NEXT_PUBLIC_SITE_URL` in environment variables

### Step 6: Post-Deployment Verification

#### ✅ Test Core Functionality

```bash
# Home page
curl https://zedtunez.vercel.app

# Sitemap
curl https://zedtunez.vercel.app/sitemap.xml

# Robots
curl https://zedtunez.vercel.app/robots.txt

# 404 page
curl https://zedtunez.vercel.app/nonexistent

# Dynamic routes (should not 404)
curl https://zedtunez.vercel.app/song/test-song
curl https://zedtunez.vercel.app/album/test-album
curl https://zedtunez.vercel.app/artist/test-artist
```

#### ✅ SEO Verification

1. **Google Search Console**
   - Add property: https://zedtunez.vercel.app
   - Verify with: `_04GK_zgHd1ozBiScxbR6ddB9hzSbdFIGb70TwMGTWo`
   - Submit sitemap: `/sitemap.xml`
   - Request indexing for homepage

2. **Meta Tags Inspector**
   - Visit: https://metatags.io/?url=https://zedtunez.vercel.app
   - Verify Open Graph tags appear
   - Check Twitter Card format

3. **Lighthouse Audit**
   - Chrome DevTools → Lighthouse
   - Run audit (target: 90+ scores)
   - Check: Performance, Accessibility, Best Practices, SEO

4. **Mobile Friendly Test**
   - Visit: https://search.google.com/test/mobile-friendly
   - URL: https://zedtunez.vercel.app

#### ✅ Performance Check

- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

### Step 7: Monitoring & Analytics

#### Enable Vercel Analytics

1. Dashboard → **Analytics**
2. Install `@vercel/analytics`
   ```bash
   npm install @vercel/analytics
   ```
3. Add to `app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

#### Enable Google Analytics

1. Create Google Analytics property
2. Get Measurement ID (G-XXXXX)
3. Add to `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` env var
4. Install gtag:
   ```bash
   npm install @react-google-analytics/core
   ```

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables set locally and on Vercel
- [ ] `npm run build` succeeds without errors
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Tested locally: `npm run dev` at http://localhost:3000
- [ ] 404 page renders correctly
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible
- [ ] Dynamic routes don't 404 on refresh
- [ ] Images load correctly
- [ ] Firebase connection works
- [ ] Security headers present

---

## 🔧 Production Troubleshooting

### Issue: 404 errors on page refresh

**Cause**: Vercel not configured for SPA routing

**Fix**: 
- Ensure `vercel.json` exists in root
- Restart deployment: Push empty commit
- Check Vercel build logs for errors

### Issue: Sitemap returns 404

**Cause**: Rewrite rule not working

**Fix**:
```bash
# Check if app/api/sitemap.ts exists
# Verify rewrite in vercel.json:
"rewrites": [
  { "source": "/sitemap.xml", "destination": "/api/sitemap" }
]
```

### Issue: Images not loading

**Cause**: Outdated cache or image format issues

**Fix**:
- Clear Vercel cache: Redeploy project
- Check `next.config.mjs` image config
- Ensure Firebase image URLs are accessible

### Issue: Environment variables not working

**Cause**: Variables only affect builds after added

**Fix**:
- Add variables to Vercel environment
- Redeploy after adding (don't restart, rebuild!)
- Verify with: `console.log(process.env.NEXT_PUBLIC_SITE_URL)`

### Issue: Firebase quota exceeded

**Cause**: Development reads using production quota

**Fix**:
- Use separate Firebase projects for dev/prod
- Set `.env.local` for development project
- Add quota alerts in Firebase Console

---

## 🔐 Security Checklist

- [ ] `vercel.json` headers configured
- [ ] Security headers in place (CSP, X-Frame-Options, etc.)
- [ ] HTTPS/SSL enabled (automatic on Vercel)
- [ ] API keys are NEXT_PUBLIC_ (safe for client)
- [ ] Sensitive keys use private env vars
- [ ] robots.txt blocks admin routes
- [ ] Firebase security rules configured
- [ ] CORS headers properly set

---

## 📊 Performance Optimization

### Image Optimization

- ✅ Images served as WebP (auto-converted)
- ✅ Responsive images with `sizes` attribute
- ✅ Lazy loading by default
- ✅ LQIP (Low Quality Image Placeholder) possible with Next.js Image

### Code Splitting

- ✅ Firebase library in separate chunk
- ✅ vendor chunk for dependencies
- ✅ Automatic route code splitting

### Caching

- ✅ ISR (Incremental Static Regeneration) on `app/page.tsx` (3600s)
- ✅ API responses cached (3600s)
- ✅ Images cached 1 year
- ✅ Stale-while-revalidate enabled

### Bundle Analysis

```bash
npm run analyze
# Generates bundle analysis in .next/analyze
```

---

## 🎯 Scaling Recommendations

### Phase 1: Current
- Single Vercel region
- Firebase Realtime Database
- Static assets on Vercel CDN

### Phase 2: Regional
- Vercel Edge Functions
- Cloudflare for global distribution
- Redis cache layer

### Phase 3: Enterprise
- Multiple regions
- BigQuery analytics
- ML recommendations
- Premium features (Stripe)

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Vercel Support**: https://vercel.com/support
- **Status Page**: https://vercel-status.com

---

## 🎉 Deployment Success!

Your ZedTunes application is now production-ready on Vercel. Monitor performance, stay updated with Next.js releases, and scale as needed.

**Enjoy! 🎵**