export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'viewer'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      recipes: {
        Row: {
          id: string
          title: string
          source_url: string | null
          ingredients: string[]
          instructions: string[]
          prep_time: number | null
          cook_time: number | null
          servings: number | null
          image_url: string | null
          tags: string[]
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['recipes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['recipes']['Insert']>
      }
      weekly_menus: {
        Row: {
          id: string
          week_start_date: string
          created_by: string
          status: 'draft' | 'pending_approval' | 'approved' | 'needs_changes'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['weekly_menus']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['weekly_menus']['Insert']>
      }
      menu_items: {
        Row: {
          id: string
          menu_id: string
          day_of_week: number
          meal_type: 'dinner'
          recipe_id: string | null
          custom_meal_name: string | null
          ingredients: string[]
          notes: string | null
          assigned_to: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>
      }
      menu_comments: {
        Row: {
          id: string
          menu_item_id: string
          user_id: string
          comment: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['menu_comments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menu_comments']['Insert']>
      }
      menu_status_log: {
        Row: {
          id: string
          menu_id: string
          status: string
          changed_by: string
          comment: string | null
          changed_at: string
        }
        Insert: Omit<Database['public']['Tables']['menu_status_log']['Row'], 'id' | 'changed_at'>
        Update: Partial<Database['public']['Tables']['menu_status_log']['Insert']>
      }
    }
  }
}

export type Recipe = Database['public']['Tables']['recipes']['Row']
export type WeeklyMenu = Database['public']['Tables']['weekly_menus']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type MenuComment = Database['public']['Tables']['menu_comments']['Row']
export type MenuStatus = 'draft' | 'pending_approval' | 'approved' | 'needs_changes'

export interface ScrapedRecipe {
  title: string
  ingredients: string[]
  instructions: string[]
  prepTime?: number
  cookTime?: number
  servings?: number
  imageUrl?: string
  sourceUrl: string
}
