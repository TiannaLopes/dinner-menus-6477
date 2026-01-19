# 🚀 Deployment Guide

## Deploy to GitHub Pages (Easiest - FREE & Automatic!)

GitHub Pages offers completely free hosting with automatic deployments via GitHub Actions.

### Prerequisites
- GitHub account
- Your code pushed to GitHub

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - Dinner Menu Planner MVP"
   git push origin main
   ```

2. **Add Secrets to GitHub Repository**
   - Go to your GitHub repository
   - Click "Settings" → "Secrets and variables" → "Actions"
   - Click "New repository secret"
   - Add two secrets:
     - Name: `SUPABASE_URL`, Value: `your-supabase-url`
     - Name: `SUPABASE_KEY`, Value: `your-supabase-anon-key`

3. **Enable GitHub Pages**
   - In repository Settings → Pages
   - Source: "GitHub Actions"
   - Click "Save"

4. **Deploy Automatically**
   - The GitHub Action runs automatically on every push to main
   - Check progress in "Actions" tab
   - Wait 2-3 minutes for build to complete
   - Your app is live at: `https://your-username.github.io/dinner-menus-6477/` 🎉

5. **Update Supabase URL Settings**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Add your GitHub Pages URL: `https://your-username.github.io/dinner-menus-6477`
   - Save changes

### Auto-Deploy on Every Push
The GitHub Action (`.github/workflows/deploy.yml`) automatically:
- Builds your app on every push to main
- Deploys to GitHub Pages
- No manual steps needed!

### Custom Domain (Optional)
- Add a `CNAME` file to `/public/` directory
- Configure DNS with your domain provider
- Update baseURL in `nuxt.config.ts`

---

## Deploy to Vercel (Also Easy!)

Vercel offers the best experience for Nuxt 3 apps with zero configuration.

### Prerequisites
- GitHub account
- Vercel account (free)
- Your code pushed to GitHub

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - Dinner Menu Planner MVP"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Nuxt 3 (no config needed!)

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:
     ```
     SUPABASE_URL = your-supabase-url
     SUPABASE_KEY = your-supabase-anon-key
     ```
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

5. **Update Supabase URL Settings**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL: `https://your-app.vercel.app`
   - Save changes

### Custom Domain (Optional)
- In Vercel project settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

---

## Deploy to Netlify

### Steps

1. **Push to GitHub** (same as above)

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.output/public`
   - (Netlify should auto-detect these)

4. **Add Environment Variables**
   - In Site settings → Environment variables
   - Add:
     ```
     SUPABASE_URL = your-supabase-url
     SUPABASE_KEY = your-supabase-anon-key
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your app is live! 🎉

6. **Update Supabase** (same as Vercel step 5)

---

## Deploy Using Docker (Self-Hosted)

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
    restart: unless-stopped
```

### Deploy
```bash
docker-compose up -d
```

---

## Deploy to DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean → Apps
   - Click "Create App"
   - Connect GitHub repository

2. **Configure**
   - Build Command: `npm run build`
   - Run Command: `node .output/server/index.mjs`

3. **Add Environment Variables**
   - Add SUPABASE_URL and SUPABASE_KEY

4. **Deploy**
   - Click "Create Resources"
   - Wait for deployment

---

## Post-Deployment Checklist

- [ ] App is accessible at your URL
- [ ] You can sign up for a new account
- [ ] Email confirmation works (check Supabase settings)
- [ ] You can log in successfully
- [ ] You can create a weekly menu
- [ ] Recipe scraper works
- [ ] You can add meals to menus
- [ ] Approval workflow functions correctly
- [ ] All pages load without errors
- [ ] Check browser console for any errors

---

## SSL/HTTPS

All mentioned platforms (Vercel, Netlify, DigitalOcean) provide free SSL certificates automatically.

---

## Performance Optimization

### Enable Caching
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/recipes/**': { swr: 3600 }, // Cache for 1 hour
    '/api/**': { cors: true }
  }
})
```

### Image Optimization
Consider using Cloudinary or similar for recipe images:
- Free tier: 25GB storage
- Automatic image optimization
- CDN delivery

---

## Monitoring & Analytics

### Add Vercel Analytics
```bash
npm install @vercel/analytics
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vercel/analytics/nuxt']
})
```

### Add Error Tracking (Sentry)
```bash
npm install @sentry/nuxt
```

Configure in `nuxt.config.ts`

---

## Backup Strategy

### Database Backups
- Supabase automatically backs up your database daily (free tier)
- For manual backups:
  - Supabase Dashboard → Database → Backups
  - Download SQL dump

### Code Backups
- Your code is on GitHub (already backed up!)
- Consider enabling GitHub automatic backups

---

## Scaling Considerations

### Current Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month
- **Supabase**: 500MB database, 2GB bandwidth
- **Sufficient for**: 100+ family users easily

### When to Upgrade
- You'll know when you need to (traffic alerts)
- Supabase Pro: $25/month (8GB database)
- Vercel Pro: $20/month (unlimited bandwidth)

---

## CI/CD (Automatic Deployments)

Both Vercel and Netlify automatically deploy when you push to GitHub:

1. Make changes locally
2. `git push origin main`
3. Automatic deployment starts
4. Live in 2-3 minutes

### Preview Deployments
- Create a branch for new features
- Push branch to GitHub
- Get a preview URL automatically
- Merge to main when ready

---

## Environment-Specific Settings

### Development
```env
SUPABASE_URL=your-dev-supabase-url
SUPABASE_KEY=your-dev-key
```

### Production
Set in deployment platform (Vercel/Netlify)

### Staging (Optional)
Create a separate Supabase project for staging:
- Test new features safely
- Separate from production data

---

## Troubleshooting Deployment Issues

### Build Failures
- Check build logs in deployment platform
- Verify all dependencies in package.json
- Test `npm run build` locally first

### Runtime Errors
- Check function logs in deployment platform
- Verify environment variables are set
- Check Supabase connection

### 404 Errors
- Ensure `.output/public` is published (Netlify)
- Check routing configuration
- Verify all pages are in `pages/` directory

---

## Update Procedure

1. Make changes locally
2. Test locally: `npm run dev`
3. Test build: `npm run build && npm run preview`
4. Commit: `git commit -m "description"`
5. Push: `git push origin main`
6. Automatic deployment happens
7. Test production site

---

## Cost Estimate (Monthly)

**Free Forever Option:**
- Vercel: Free
- Supabase: Free (500MB database)
- Domain (optional): $10-15/year
- **Total: $0/month** (or ~$1/month with domain)

**If You Outgrow Free Tier:**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Domain: $10-15/year
- **Total: ~$45/month**

For a family app, free tier is more than sufficient!

---

## Support & Maintenance

- **Nuxt 3**: Actively maintained, great community
- **Supabase**: Excellent docs and support
- **Your app**: Set it and forget it! Very low maintenance

---

**Ready to deploy? Start with Vercel - it's the easiest! 🚀**
