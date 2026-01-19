# Supabase Setup Guide

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. **No credit card required** for free tier

## Step 2: Create Your Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: dinner-menus (or anything you like)
   - **Database Password**: Generate a strong password (save it somewhere!)
   - **Region**: Choose closest to you (e.g., US East, US West, Europe)
   - **Pricing Plan**: Free tier (selected by default)
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

## Step 3: Get Your Credentials

1. Once project is ready, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 4: Add Credentials to Your App

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

## Step 5: Run the Database Schema

1. In Supabase dashboard, click **SQL Editor** in sidebar
2. Click **New query**
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL Editor
5. Click **Run** button
6. You should see "Success. No rows returned"

## Step 6: Test Your App

1. Restart your development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`
3. Try creating a menu - it should now save to the database!

## What the Free Tier Includes

- ✅ 500 MB database storage (enough for thousands of recipes and menus)
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ Automatic backups for 7 days
- ✅ No time limit - free forever!

## Troubleshooting

### "Missing supabase url" warning
- Make sure `.env` file is in the project root (same folder as `nuxt.config.ts`)
- Restart the dev server after adding credentials

### "Row Level Security" errors
- The schema already sets up public access policies
- No authentication is required - anyone can use your app

### Data not saving
- Check browser console for errors
- Verify your SUPABASE_URL and SUPABASE_KEY are correct
- Make sure you ran the SQL schema

## Optional: Deploy to Production

When deploying to GitHub Pages (or any hosting):

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_KEY`: Your anon key
3. Your GitHub Actions workflow will use these automatically

## Need Help?

- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Check the SQL Editor for any schema errors
- Verify credentials are copy-pasted correctly (no extra spaces!)
