# 🚀 GitHub Pages Deployment Setup

## Automatic Deployment on Every Push!

Your app is configured to automatically deploy to GitHub Pages whenever you push to the `main` branch.

---

## 📋 Setup Checklist (5 Minutes)

### Step 1: Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Dinner Menu Planner"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/dinner-menus-6477.git

# Push to GitHub
git push -u origin main
```

### Step 2: Add Supabase Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions** (in left sidebar)
4. Click **New repository secret**
5. Add your first secret:
   - **Name**: `SUPABASE_URL`
   - **Secret**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Click **Add secret**
6. Add your second secret:
   - **Name**: `SUPABASE_KEY`
   - **Secret**: Your Supabase anon/public key
   - Click **Add secret**

### Step 3: Enable GitHub Pages

1. In your repository, click **Settings**
2. Click **Pages** (in left sidebar)
3. Under **Source**, select: **GitHub Actions**
4. Click **Save**

### Step 4: Deploy!

**That's it!** The GitHub Action will automatically:
- Run on every push to `main`
- Build your Nuxt app
- Deploy to GitHub Pages

**Check deployment progress:**
- Go to the **Actions** tab in your repository
- Watch the "Deploy to GitHub Pages" workflow run
- First deployment takes ~2-3 minutes

### Step 5: Access Your Live App

Once deployed, your app will be available at:

```
https://YOUR-USERNAME.github.io/dinner-menus-6477/
```

Replace `YOUR-USERNAME` with your GitHub username.

### Step 6: Update Supabase with Your Live URL

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your GitHub Pages URL to **Site URL**:
   ```
   https://YOUR-USERNAME.github.io/dinner-menus-6477
   ```
5. Add the same URL to **Redirect URLs**
6. Click **Save**

---

## 🔄 How Auto-Deployment Works

Every time you push changes to the `main` branch:

```bash
git add .
git commit -m "Updated recipe scraper"
git push origin main
```

The GitHub Action automatically:
1. ✅ Checks out your code
2. ✅ Installs dependencies
3. ✅ Builds your app (with Supabase secrets)
4. ✅ Deploys to GitHub Pages
5. ✅ Your live site updates in ~2-3 minutes!

**No manual deployment needed!**

---

## 📁 What Was Added

### `.github/workflows/deploy.yml`
This GitHub Action workflow file contains the automation that:
- Triggers on every push to `main`
- Builds your Nuxt app
- Deploys to GitHub Pages

### `nuxt.config.ts` Updates
Added GitHub Pages support:
- `baseURL` configured for GitHub Pages
- Works with your repository name

### `public/.nojekyll`
Tells GitHub Pages not to use Jekyll processing

---

## 🛠️ Troubleshooting

### Build Fails
**Check the Actions tab for error details:**
- Go to **Actions** tab
- Click on the failed workflow
- Review the error logs

**Common issues:**
- Missing secrets (add `SUPABASE_URL` and `SUPABASE_KEY`)
- Wrong Node.js version (workflow uses Node 18)
- Build errors (test locally with `npm run generate`)

### 404 on Deployment
**Make sure GitHub Pages is enabled:**
- Settings → Pages → Source: "GitHub Actions"

**Check baseURL:**
- Verify `nuxt.config.ts` has correct `baseURL`

### Authentication Issues
**Update Supabase URLs:**
- Add your GitHub Pages URL to Supabase Auth settings
- Check redirect URLs include your live URL

### Pages Not Updating
**Clear GitHub cache:**
- Make a new commit
- Push to trigger fresh deployment
- Check Actions tab for build progress

---

## 🎯 Testing Locally Before Push

Always test your build locally before pushing:

```bash
# Generate static site
npm run generate

# Preview the generated site
npm run preview
```

If it works locally, it will work on GitHub Pages!

---

## 📊 Monitoring Deployments

### View Deployment History
- Go to **Actions** tab
- See all past deployments
- Click any workflow to see logs

### View Live Logs
While deployment is running:
- Actions tab → Click running workflow
- Watch live build output
- See exactly what's happening

### Deployment Status Badge
Add this to your README to show deployment status:

```markdown
[![Deploy to GitHub Pages](https://github.com/YOUR-USERNAME/dinner-menus-6477/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR-USERNAME/dinner-menus-6477/actions/workflows/deploy.yml)
```

---

## 🌐 Custom Domain (Optional)

Want to use your own domain?

### Step 1: Add CNAME File
Create `public/CNAME`:
```
yourdomain.com
```

### Step 2: Update Nuxt Config
In `nuxt.config.ts`, change `baseURL`:
```ts
baseURL: process.env.NODE_ENV === 'production' ? '/' : '/',
```

### Step 3: Configure DNS
Add these DNS records with your domain provider:
- **A Record**: Point to GitHub Pages IP addresses
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **CNAME Record**: `www` → `YOUR-USERNAME.github.io`

### Step 4: Enable in GitHub
- Settings → Pages → Custom domain
- Enter your domain
- Click Save

---

## 💰 Cost

**Completely FREE!**
- GitHub Pages: Free for public repositories
- GitHub Actions: 2,000 minutes/month free
- Each deployment: ~2-3 minutes
- **~600 deployments per month for free!**

---

## 🚀 Next Steps

1. ✅ Push your code to GitHub
2. ✅ Add Supabase secrets
3. ✅ Enable GitHub Pages
4. ✅ Watch your first deployment in Actions tab
5. ✅ Visit your live app!
6. ✅ Share the URL with your husband

**Every future push to `main` will automatically deploy!**

---

## 🎉 Benefits of GitHub Pages

- ✅ **Free hosting** forever
- ✅ **Auto-deployment** on every push
- ✅ **Fast CDN** delivery worldwide
- ✅ **HTTPS** included automatically
- ✅ **Version control** - rollback anytime
- ✅ **No configuration** needed after setup

---

**Your app will be live at: `https://YOUR-USERNAME.github.io/dinner-menus-6477/`**

Enjoy automatic deployments! 🎊
