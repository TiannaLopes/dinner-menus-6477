# 📁 Project Structure

```
dinner-menus-6477/
│
├── 📄 Configuration Files
│   ├── .env.example              # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   ├── nuxt.config.ts           # Nuxt 3 configuration
│   ├── package.json             # Dependencies & scripts
│   ├── tailwind.config.js       # Tailwind CSS theme
│   ├── tsconfig.json            # TypeScript configuration
│   └── supabase-schema.sql      # Database schema (run in Supabase)
│
├── 📚 Documentation
│   ├── README.md                # Main documentation
│   ├── SETUP.md                 # Quick start guide
│   ├── IMPLEMENTATION.md        # Implementation summary
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── STRUCTURE.md             # This file!
│
├── 🎨 Assets
│   └── css/
│       └── main.css            # Global styles & Tailwind imports
│
├── 🧩 Components (Reusable UI)
│   ├── DayCard.vue             # Single day card in weekly view
│   ├── MealModal.vue           # Add/edit meal modal dialog
│   ├── RecipeCard.vue          # Recipe card in library
│   └── StatusBadge.vue         # Status indicator badge
│
├── 🔧 Composables (Reusable Logic)
│   ├── useDateHelpers.ts       # Date formatting utilities
│   ├── useMenus.ts             # Menu CRUD operations
│   └── useRecipes.ts           # Recipe CRUD operations
│
├── 📐 Layouts
│   └── default.vue             # Main app layout with navigation
│
├── 🛡️ Middleware
│   └── auth.ts                 # Route authentication guard
│
├── 📄 Pages (Routes)
│   ├── index.vue               # Home: Weekly menu view
│   ├── login.vue               # Authentication page
│   │
│   ├── menus/
│   │   └── index.vue           # All menus history
│   │
│   └── recipes/
│       ├── index.vue           # Recipe library
│       ├── scrape.vue          # Recipe scraper from URL
│       └── [id].vue            # Individual recipe details
│
├── 🔌 Server (API Routes)
│   └── api/
│       └── scrape-recipe.post.ts  # Recipe scraping endpoint
│
├── 📦 Types
│   └── database.ts             # TypeScript type definitions
│
├── 📱 App
│   └── app.vue                 # Root application component
│
└── 🗂️ Generated/Dependencies
    ├── .nuxt/                  # Generated files (gitignored)
    ├── node_modules/           # NPM packages (gitignored)
    └── .output/                # Build output (gitignored)
```

## 📊 File Breakdown by Type

### Vue Components (10 files)
- `app.vue` - Root app
- `default.vue` - Layout
- `index.vue` - Home page
- `login.vue` - Auth page
- `menus/index.vue` - Menus list
- `recipes/index.vue` - Recipe library
- `recipes/scrape.vue` - Recipe scraper
- `recipes/[id].vue` - Recipe detail
- `DayCard.vue`, `MealModal.vue`, `RecipeCard.vue`, `StatusBadge.vue` - Components

### TypeScript Files (5 files)
- `nuxt.config.ts` - Config
- `useDateHelpers.ts` - Date utils
- `useMenus.ts` - Menu logic
- `useRecipes.ts` - Recipe logic
- `auth.ts` - Auth middleware
- `scrape-recipe.post.ts` - API endpoint
- `database.ts` - Type definitions

### Configuration (4 files)
- `package.json` - Dependencies
- `tailwind.config.js` - Styling
- `tsconfig.json` - TypeScript
- `.env.example` - Environment template

### Database (1 file)
- `supabase-schema.sql` - Complete database schema

### Documentation (5 files)
- `README.md` - Main docs
- `SETUP.md` - Setup guide
- `IMPLEMENTATION.md` - Implementation details
- `DEPLOYMENT.md` - Deployment guide
- `STRUCTURE.md` - This file

## 🎯 Key File Purposes

### Must Configure Before Running
1. `.env` - Copy from `.env.example` and add your Supabase credentials
2. Supabase - Run `supabase-schema.sql` in Supabase SQL Editor

### Entry Points
1. `app.vue` - Application root
2. `nuxt.config.ts` - Configuration entry
3. `pages/index.vue` - Default route (home page)

### Data Flow
```
User Action
    ↓
Vue Component (pages/*)
    ↓
Composable (composables/*)
    ↓
Supabase Client
    ↓
Database (via API)
```

### Routing
```
URL                     → File                      → Purpose
/                       → pages/index.vue          → Weekly menu
/login                  → pages/login.vue          → Authentication
/recipes                → pages/recipes/index.vue  → Recipe library
/recipes/scrape         → pages/recipes/scrape.vue → Scrape recipe
/recipes/123            → pages/recipes/[id].vue   → Recipe detail
/menus                  → pages/menus/index.vue    → All menus
```

## 🔄 Development Workflow

1. **Make changes** to Vue files
2. **Hot reload** happens automatically
3. **Test** in browser at localhost:3000
4. **Commit** when satisfied
5. **Push** to GitHub
6. **Auto-deploy** to Vercel/Netlify

## 📈 Lines of Code

Approximate breakdown:
- Vue Templates: ~800 lines
- TypeScript/Logic: ~600 lines
- Styles (CSS): ~100 lines
- SQL Schema: ~200 lines
- Documentation: ~1500 lines
- **Total: ~3,200 lines**

## 🧱 Architecture Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Components, Pages, Layouts)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Business Logic Layer        │
│        (Composables, Utils)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          API Layer                  │
│    (Server Routes, Supabase)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Data Layer                  │
│      (PostgreSQL Database)          │
└─────────────────────────────────────┘
```

## 🎨 Component Hierarchy

```
app.vue
└── NuxtLayout (default.vue)
    ├── Navigation Bar
    └── NuxtPage
        ├── index.vue (Weekly Menu)
        │   ├── StatusBadge
        │   ├── DayCard (×7)
        │   └── MealModal
        │
        ├── recipes/index.vue (Library)
        │   └── RecipeCard (×N)
        │
        ├── recipes/scrape.vue (Scraper)
        │   └── Form + Preview
        │
        └── login.vue (Auth)
            └── Form
```

## 🗄️ Database Tables

1. **users** - User accounts
2. **recipes** - Recipe storage
3. **weekly_menus** - Menu containers
4. **menu_items** - Individual meals
5. **menu_comments** - Feedback/comments
6. **menu_status_log** - Audit trail

**Total: 6 tables, fully normalized**

## 🔒 Security Files

- `middleware/auth.ts` - Route protection
- `supabase-schema.sql` - RLS policies
- `.env` - Credentials (gitignored)

---

**This structure is designed for:**
- ✅ Easy navigation
- ✅ Clear separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Developer-friendly
