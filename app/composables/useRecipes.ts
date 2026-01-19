import type { Recipe } from '~/types/database'

export const useRecipes = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const fetchRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Recipe[]
  }

  const fetchRecipeById = async (id: string) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Recipe
  }

  const createRecipe = async (recipe: Partial<Recipe>) => {
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        ...recipe,
        created_by: user.value?.id
      })
      .select()
      .single()
    
    if (error) throw error
    return data as Recipe
  }

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    const { data, error } = await supabase
      .from('recipes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Recipe
  }

  const deleteRecipe = async (id: string) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  return {
    fetchRecipes,
    fetchRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
  }
}
