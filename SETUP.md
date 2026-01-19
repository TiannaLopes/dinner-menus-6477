# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase

1. Go to https://supabase.com and create a free account
2. Click "New Project"
3. Name it "dinner-menus" (or anything you like)
4. Set a strong database password
5. Wait 2 minutes for setup to complete

### Step 3: Create Database Tables

1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open the `supabase-schema.sql` file in this project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Step 4: Get Your API Keys

1. In Supabase dashboard, click "Project Settings" (gear icon)
2. Click "API" in the left menu
3. Find these two values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **Project API Key** - use the `anon` `public` key (long string)

### Step 5: Configure Environment

1. Copy the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and add your values:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=your-long-anon-key-here
   ```

### Step 6: Start the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

### Step 7: Create Your Account

1. Click "Sign Up" on the login page
2. Enter your email and password
3. Check your email for confirmation link
4. Click the confirmation link
5. Return to the app and log in

### Step 8: Invite Your Partner

Have your partner:
1. Go to your app URL (or localhost if testing)
2. Sign up with their email
3. Confirm their email
4. Log in

Now you can collaborate on dinner menus!

---

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase project created
- [ ] Database tables created (ran SQL script)
- [ ] `.env` file configured with correct keys
- [ ] App runs on http://localhost:3000
- [ ] You can sign up and log in
- [ ] You can create a weekly menu
- [ ] You can scrape a recipe from a URL
- [ ] You can add a meal to the menu

---

## 🌐 Deploy to Production (Optional)

Want to share your app with your husband and access it anywhere?

**Deploy to GitHub Pages (FREE, auto-updates on every push):**

See `GITHUB-PAGES-SETUP.md` for complete instructions. Quick steps:
1. Push code to GitHub
2. Add Supabase secrets to repository
3. Enable GitHub Pages
4. Auto-deploys on every push!

Your app will be live at: `https://YOUR-USERNAME.github.io/dinner-menus-6477/`

---

## 🆘 Common Issues

### "Cannot connect to Supabase"
- Double-check your `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Make sure there are no quotes around the values
- Restart the dev server after changing `.env`

### "Table does not exist"
- Go back to Supabase SQL Editor
- Run the `supabase-schema.sql` script again
- Check for any error messages

### "Email confirmation not working"
- In Supabase Dashboard → Authentication → Settings
- Under "Email Auth", check "Enable email confirmations"
- In development, you can disable confirmations for testing

### "Recipe scraper not working"
- Some websites block automated scraping
- Try a different recipe URL
- Supported sites: AllRecipes, Food Network, NYTimes Cooking
- You can always enter recipes manually!

---

## 📚 Next Steps

1. **Customize the colors**: Edit `tailwind.config.js`
2. **Deploy to Vercel**: Push to GitHub and connect to Vercel
3. **Set up email notifications**: Add Resend API key (optional)
4. **Explore features**: Try the approval workflow!

---

## 🎓 Learning Resources

- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vue 3 Docs](https://vuejs.org)

---

**Need help? Check the main README.md or open an issue on GitHub!**
