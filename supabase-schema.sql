-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_url TEXT,
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  instructions TEXT[] NOT NULL DEFAULT '{}',
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Anyone can read recipes
CREATE POLICY "Anyone can read recipes" ON public.recipes
  FOR SELECT USING (true);

-- Authenticated users can create recipes
CREATE POLICY "Authenticated users can create recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update their own recipes
CREATE POLICY "Users can update own recipes" ON public.recipes
  FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own recipes
CREATE POLICY "Users can delete own recipes" ON public.recipes
  FOR DELETE USING (auth.uid() = created_by);

-- Weekly menus table
CREATE TABLE IF NOT EXISTS public.weekly_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'needs_changes')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.weekly_menus ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read menus
CREATE POLICY "Authenticated users can read menus" ON public.weekly_menus
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create menus
CREATE POLICY "Authenticated users can create menus" ON public.weekly_menus
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update their own menus
CREATE POLICY "Users can update own menus" ON public.weekly_menus
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Menu items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES public.weekly_menus(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type TEXT NOT NULL DEFAULT 'dinner',
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  custom_meal_name TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read menu items
CREATE POLICY "Authenticated users can read menu items" ON public.menu_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create menu items
CREATE POLICY "Authenticated users can create menu items" ON public.menu_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update menu items
CREATE POLICY "Authenticated users can update menu items" ON public.menu_items
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete menu items
CREATE POLICY "Authenticated users can delete menu items" ON public.menu_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Menu comments table
CREATE TABLE IF NOT EXISTS public.menu_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.menu_comments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read comments
CREATE POLICY "Authenticated users can read comments" ON public.menu_comments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON public.menu_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Menu status log table
CREATE TABLE IF NOT EXISTS public.menu_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES public.weekly_menus(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  comment TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.menu_status_log ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read status logs
CREATE POLICY "Authenticated users can read status logs" ON public.menu_status_log
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create status logs
CREATE POLICY "Authenticated users can create status logs" ON public.menu_status_log
  FOR INSERT WITH CHECK (auth.uid() = changed_by);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_created_by ON public.recipes(created_by);
CREATE INDEX IF NOT EXISTS idx_weekly_menus_week_start ON public.weekly_menus(week_start_date);
CREATE INDEX IF NOT EXISTS idx_weekly_menus_created_by ON public.weekly_menus(created_by);
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON public.menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_recipe_id ON public.menu_items(recipe_id);
CREATE INDEX IF NOT EXISTS idx_menu_comments_menu_item_id ON public.menu_comments(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_status_log_menu_id ON public.menu_status_log(menu_id);
