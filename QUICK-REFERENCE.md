# 🚀 Quick Reference Card

## ⚡ Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Default URLs

- **Local Dev**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Weekly Menu**: http://localhost:3000
- **Recipes**: http://localhost:3000/recipes
- **Recipe Scraper**: http://localhost:3000/recipes/scrape

## 📋 Environment Variables

Required in `.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key-here
```

## 🗄️ Database Tables

1. `users` - User accounts
2. `recipes` - Recipe library
3. `weekly_menus` - Menu containers (with status)
4. `menu_items` - Daily meals
5. `menu_comments` - Feedback/comments
6. `menu_status_log` - Status history

## 🎯 Key Features

### Weekly Menu
- View current week's menu
- Navigate weeks (previous/next/current)
- Add/edit/delete meals per day
- Submit for approval
- Approve or request changes

### Recipe Management
- Scrape recipes from URLs
- Save to library
- Edit/delete recipes
- Use in weekly menus

### Approval Workflow
- **Draft** → Initial state
- **Pending Approval** → Submitted for review
- **Approved** → Accepted by partner
- **Needs Changes** → Requires modifications

## 📁 Important Files

### Configuration
- `nuxt.config.ts` - Nuxt settings
- `tailwind.config.js` - Styling theme
- `.env` - Your credentials
- `supabase-schema.sql` - Database structure

### Core Logic
- `composables/useMenus.ts` - Menu operations
- `composables/useRecipes.ts` - Recipe operations
- `composables/useDateHelpers.ts` - Date utils
- `server/api/scrape-recipe.post.ts` - Web scraper

### Main Pages
- `pages/index.vue` - Weekly menu dashboard
- `pages/login.vue` - Authentication
- `pages/recipes/scrape.vue` - Recipe scraper
- `pages/recipes/index.vue` - Recipe library

## 🔧 Common Tasks

### Add a New Page
1. Create file in `pages/` directory
2. Use `definePageMeta()` for auth
3. Automatic routing!

### Create a Component
1. Create file in `components/`
2. Use PascalCase naming
3. Auto-imported everywhere!

### Add API Endpoint
1. Create in `server/api/`
2. Export `defineEventHandler()`
3. Access at `/api/your-endpoint`

### Update Database
1. Modify `supabase-schema.sql`
2. Run in Supabase SQL Editor
3. Update `types/database.ts`

## 🎨 Styling

### Tailwind Classes
```html
<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-danger">Danger</button>

<!-- Cards -->
<div class="card">Content here</div>

<!-- Forms -->
<label class="label">Label</label>
<input class="input" />
```

### Custom Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#22c55e', // Change these
    600: '#16a34a',
  }
}
```

## 🔐 Authentication

### Protected Route
```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Get Current User
```vue
<script setup>
const user = useSupabaseUser()
// user.value.email, user.value.id
</script>
```

### Sign Out
```ts
const supabase = useSupabaseClient()
await supabase.auth.signOut()
```

## 📡 API Calls

### Fetch Data
```ts
const { data } = await supabase
  .from('recipes')
  .select('*')
  .order('created_at', { ascending: false })
```

### Insert Data
```ts
const { data } = await supabase
  .from('recipes')
  .insert({ title: 'New Recipe' })
  .select()
  .single()
```

### Update Data
```ts
const { data } = await supabase
  .from('recipes')
  .update({ title: 'Updated' })
  .eq('id', recipeId)
```

### Delete Data
```ts
await supabase
  .from('recipes')
  .delete()
  .eq('id', recipeId)
```

## 🐛 Debugging

### Check Logs
```bash
# Browser console for frontend errors
# Terminal for server errors
```

### Common Issues

**"Cannot connect to Supabase"**
- Check `.env` credentials
- Restart dev server

**"Table does not exist"**
- Run `supabase-schema.sql`

**"Recipe scraper fails"**
- Some sites block scraping
- Try different URL
- Use manual entry

## 📦 Package Management

### Add New Package
```bash
npm install package-name
```

### Remove Package
```bash
npm uninstall package-name
```

### Update Packages
```bash
npm update
```

## 🚀 Deployment

### Vercel (Easiest)
```bash
git push origin main
# Auto-deploys!
```

### Manual Build
```bash
npm run build
# Upload .output/ folder
```

## 📊 Status Codes

- **draft** - Being created
- **pending_approval** - Waiting for review
- **approved** - Accepted ✓
- **needs_changes** - Needs work

## 🎯 User Roles

- **admin** - Menu creator (you)
- **viewer** - Reviewer (partner)

Currently both have same permissions. Customize in RLS policies if needed.

## 🔗 Useful Links

- [Nuxt Docs](https://nuxt.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Vue 3 Docs](https://vuejs.org)

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **TypeScript**: Get autocomplete everywhere
3. **Components**: Auto-imported, no imports needed
4. **Composables**: Reusable logic, also auto-imported
5. **Middleware**: `auth.ts` protects routes
6. **Layouts**: `default.vue` wraps all pages

## 🆘 Need Help?

1. Check the `README.md` for detailed docs
2. Read `SETUP.md` for setup issues
3. See `DEPLOYMENT.md` for deployment help
4. View `IMPLEMENTATION.md` for technical details

---

**Print this and keep it handy! 📄**
