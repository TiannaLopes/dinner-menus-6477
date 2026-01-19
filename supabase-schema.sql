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
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (but allow public access)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Public access to recipes
CREATE POLICY "Public can read recipes" ON public.recipes
  FOR SELECT USING (true);

CREATE POLICY "Public can create recipes" ON public.recipes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update recipes" ON public.recipes
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete recipes" ON public.recipes
  FOR DELETE USING (true);

-- Weekly menus table
CREATE TABLE IF NOT EXISTS public.weekly_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL,
  created_by TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'needs_changes')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (but allow public access)
ALTER TABLE public.weekly_menus ENABLE ROW LEVEL SECURITY;

-- Public access to menus
CREATE POLICY "Public can read menus" ON public.weekly_menus
  FOR SELECT USING (true);

CREATE POLICY "Public can create menus" ON public.weekly_menus
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update menus" ON public.weekly_menus
  FOR UPDATE USING (true);

-- Menu items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES public.weekly_menus(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type TEXT NOT NULL DEFAULT 'dinner',
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  custom_meal_name TEXT,
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (but allow public access)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public access to menu items
CREATE POLICY "Public can read menu items" ON public.menu_items
  FOR SELECT USING (true);

CREATE POLICY "Public can create menu items" ON public.menu_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update menu items" ON public.menu_items
  FOR UPDATE USING (true);

CREATE POLICY "Public can delete menu items" ON public.menu_items
  FOR DELETE USING (true);

-- Menu comments table
CREATE TABLE IF NOT EXISTS public.menu_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  user_id TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (but allow public access)
ALTER TABLE public.menu_comments ENABLE ROW LEVEL SECURITY;

-- Public access to comments
CREATE POLICY "Public can read comments" ON public.menu_comments
  FOR SELECT USING (true);

CREATE POLICY "Public can create comments" ON public.menu_comments
  FOR INSERT WITH CHECK (true);

-- Menu status log table
CREATE TABLE IF NOT EXISTS public.menu_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES public.weekly_menus(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by TEXT,
  comment TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (but allow public access)
ALTER TABLE public.menu_status_log ENABLE ROW LEVEL SECURITY;

-- Public access to status logs
CREATE POLICY "Public can read status logs" ON public.menu_status_log
  FOR SELECT USING (true);

CREATE POLICY "Public can create status logs" ON public.menu_status_log
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_menus_week_start ON public.weekly_menus(week_start_date);
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON public.menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_recipe_id ON public.menu_items(recipe_id);
CREATE INDEX IF NOT EXISTS idx_menu_comments_menu_item_id ON public.menu_comments(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_status_log_menu_id ON public.menu_status_log(menu_id);
