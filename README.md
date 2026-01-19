# 🍽️ Dinner Menu Planner

A modern, collaborative weekly dinner menu planning application built with Nuxt 3. Manage your family's dinner menus, scrape recipes from the web, and collaborate with your partner through an approval workflow.

## ✨ Features

### 📅 Weekly Menu Management
- **Interactive Calendar View**: Plan meals for the entire week at a glance
- **Add/Edit/Delete Meals**: Easily manage meals for each day
- **Flexible Meal Options**: Choose from your recipe library or add custom meal names
- **Notes & Comments**: Add special instructions or modifications per meal
- **Navigation**: Browse previous and upcoming weeks

### 🌐 Recipe Scraper
- **Automatic Extraction**: Paste any recipe URL and extract ingredients, instructions, images, and more
- **Supported Sites**: Works with AllRecipes, Food Network, NYTimes Cooking, and most sites with structured recipe data (JSON-LD)
- **Manual Entry Fallback**: Edit scraped data or enter recipes manually
- **Recipe Library**: Save and organize all your favorite recipes

### ✅ Approval Workflow
- **Status Tracking**: Draft → Pending Approval → Approved/Needs Changes
- **Collaborative Planning**: Submit menus for review by your partner
- **Feedback System**: Request changes with comments
- **Status History**: Track all menu status changes

### 💾 Free Data Storage
- **Supabase Backend**: Free PostgreSQL database (500MB, plenty for recipes)
- **Secure Authentication**: Built-in Supabase Auth
- **Row-Level Security**: Your data is private and secure

## 🚀 Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Web Scraping**: Cheerio + Axios
- **State Management**: Pinia
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd dinner-menus-6477
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and secure password

2. **Run Database Schema**
   - In Supabase Dashboard, go to SQL Editor
   - Copy the contents of `supabase-schema.sql`
   - Paste and run the SQL to create all tables

3. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon/public` key

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   SUPABASE_URL=your-project-url
   SUPABASE_KEY=your-anon-key
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🎯 Usage Guide

### First Time Setup

1. **Sign Up**: Navigate to `/login` and create your account
2. **Add Your Partner**: Have your partner sign up using their email
3. **Start Planning**: Create your first weekly menu!

### Creating a Weekly Menu

1. Go to the home page (weekly menu view)
2. Click "Create Menu for This Week" if none exists
3. For each day:
   - Click "Add Meal"
   - Choose an existing recipe OR enter a custom meal name
   - Add any notes or modifications
   - Save

### Scraping Recipes

1. Navigate to **Recipes** → **Add Recipe from URL**
2. Paste a recipe URL (e.g., from AllRecipes, Food Network)
3. Click "Scrape Recipe"
4. Review and edit the extracted data
5. Click "Save Recipe"

**Supported Recipe Sites:**
- AllRecipes
- Food Network
- NYTimes Cooking
- Bon Appétit
- Serious Eats
- Any site with JSON-LD structured data

### Approval Workflow

**As the Menu Creator:**
1. Create and populate your weekly menu
2. Click "Submit for Approval"
3. Wait for feedback from your partner

**As the Reviewer:**
1. View the pending menu
2. Review each meal
3. Click "Approve Menu" OR "Request Changes"
4. Add comments if requesting changes

### Managing Recipes

- **View All Recipes**: Navigate to `/recipes`
- **View Recipe Details**: Click any recipe card
- **Delete Recipe**: Open recipe details, click "Delete Recipe"
- **Use in Menu**: Add meals to menu and select from recipe library

## 📁 Project Structure

```
dinner-menus-6477/
├── assets/
│   └── css/
│       └── main.css          # Global styles & Tailwind
├── components/
│   ├── DayCard.vue           # Individual day card in weekly view
│   ├── MealModal.vue         # Add/edit meal modal
│   ├── RecipeCard.vue        # Recipe library card
│   └── StatusBadge.vue       # Menu status indicator
├── composables/
│   ├── useDateHelpers.ts     # Date formatting utilities
│   ├── useMenus.ts           # Menu CRUD operations
│   └── useRecipes.ts         # Recipe CRUD operations
├── layouts/
│   └── default.vue           # Main app layout with nav
├── middleware/
│   └── auth.ts               # Authentication guard
├── pages/
│   ├── index.vue             # Weekly menu view
│   ├── login.vue             # Authentication page
│   ├── menus/
│   │   └── index.vue         # All menus list
│   └── recipes/
│       ├── index.vue         # Recipe library
│       ├── scrape.vue        # Recipe scraper
│       └── [id].vue          # Recipe details
├── server/
│   └── api/
│       └── scrape-recipe.post.ts  # Recipe scraping endpoint
├── types/
│   └── database.ts           # TypeScript types
├── supabase-schema.sql       # Database schema
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json              # Dependencies
```

## 🗄️ Database Schema

### Tables

- **users**: User profiles (extends Supabase auth)
- **recipes**: Recipe library with ingredients, instructions, images
- **weekly_menus**: Weekly menu containers with status
- **menu_items**: Individual meals per day
- **menu_comments**: Feedback and comments on meals
- **menu_status_log**: Audit log of status changes

### Key Relationships

- Menus have many menu items (1:N)
- Menu items reference recipes (N:1, optional)
- Menu items have many comments (1:N)
- All tables use Row-Level Security (RLS)

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
        500: '#your-color',
        600: '#your-color',
        // ...
      }
    }
  }
}
```

### Adding Meal Types

Currently supports dinner only. To add breakfast/lunch:

1. Update `meal_type` column constraint in `supabase-schema.sql`
2. Modify components to handle multiple meal types
3. Update UI to display multiple meals per day

## 🚀 Deployment

### Deploy to GitHub Pages (Recommended - FREE & Automatic!)

**Auto-deploys on every push to main!**

1. Push your code to GitHub
2. Add repository secrets (Settings → Secrets):
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
3. Enable GitHub Pages (Settings → Pages → Source: "GitHub Actions")
4. Push to `main` branch
5. Your app is live at: `https://YOUR-USERNAME.github.io/dinner-menus-6477/`

**See `GITHUB-PAGES-SETUP.md` for detailed instructions.**

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `.output/public`
6. Add environment variables
7. Deploy!

## 🔒 Security

- All API routes require authentication
- Row-Level Security policies on all tables
- Users can only see/edit their own data
- Passwords are hashed by Supabase Auth
- HTTPS enforced in production

## 🐛 Troubleshooting

### "Failed to scrape recipe"
- Some sites block automated scraping
- Try a different recipe URL
- Use manual entry as fallback

### Database Connection Issues
- Verify your Supabase credentials in `.env`
- Check if database tables are created
- Ensure RLS policies are enabled

### Authentication Problems
- Clear browser cookies and localStorage
- Check Supabase auth settings
- Verify email confirmation settings

## 📝 Future Enhancements

- [ ] Email notifications for approval requests
- [ ] Shopping list generation from weekly menu
- [ ] Recipe ratings and favorites
- [ ] Meal prep notes and timings
- [ ] Export menu to PDF
- [ ] Mobile app (React Native)
- [ ] Recipe tags and search
- [ ] Nutrition information
- [ ] Cost tracking per meal

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own family dinners!

## 💖 Acknowledgments

- Built with [Nuxt 3](https://nuxt.com)
- Database by [Supabase](https://supabase.com)
- Icons: Emoji (built-in)
- Inspired by the need for better family meal planning

---

**Made with ❤️ for home-cooked dinners**
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
