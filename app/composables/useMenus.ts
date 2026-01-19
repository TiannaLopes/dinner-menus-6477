import type { WeeklyMenu, MenuItem, MenuStatus } from '~/types/database'

export const useMenus = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        menu_items (
          *,
          recipe:recipes (*)
        )
      `)
      .order('week_start_date', { ascending: false })
    
    if (error) throw error
    return data
  }

  const fetchMenuById = async (id: string) => {
    const { data, error } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        menu_items (
          *,
          recipe:recipes (*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  const fetchMenuByWeek = async (weekStart: string) => {
    const { data, error } = await supabase
      .from('weekly_menus')
      .select(`
        *,
        menu_items (
          *,
          recipe:recipes (*)
        )
      `)
      .eq('week_start_date', weekStart)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  const createMenu = async (weekStart: string) => {
    const { data, error } = await supabase
      .from('weekly_menus')
      .insert({
        week_start_date: weekStart,
        created_by: user.value?.id,
        status: 'draft'
      })
      .select()
      .single()
    
    if (error) throw error
    return data as WeeklyMenu
  }

  const updateMenuStatus = async (menuId: string, status: MenuStatus, comment?: string) => {
    const { data, error } = await supabase
      .from('weekly_menus')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', menuId)
      .select()
      .single()
    
    if (error) throw error

    // Log status change
    await supabase.from('menu_status_log').insert({
      menu_id: menuId,
      status,
      changed_by: user.value?.id,
      comment
    })
    
    return data as WeeklyMenu
  }

  const addMenuItem = async (menuItem: Partial<MenuItem>) => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(menuItem)
      .select()
      .single()
    
    if (error) throw error
    return data as MenuItem
  }

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as MenuItem
  }

  const deleteMenuItem = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  const addComment = async (menuItemId: string, comment: string) => {
    const { data, error } = await supabase
      .from('menu_comments')
      .insert({
        menu_item_id: menuItemId,
        user_id: user.value?.id,
        comment
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  const fetchComments = async (menuItemId: string) => {
    const { data, error } = await supabase
      .from('menu_comments')
      .select(`
        *,
        user:users (name, email)
      `)
      .eq('menu_item_id', menuItemId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  }

  return {
    fetchMenus,
    fetchMenuById,
    fetchMenuByWeek,
    createMenu,
    updateMenuStatus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addComment,
    fetchComments
  }
}
