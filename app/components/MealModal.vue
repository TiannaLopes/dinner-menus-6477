<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-2xl font-bold">{{ menuItem ? 'Edit Meal' : 'Add Meal' }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
      </div>

      <form @submit.prevent="saveMeal" class="space-y-4">
        <!-- Recipe Selection -->
        <div>
          <label class="label">Choose from Recipe Library</label>
          <select v-model="selectedRecipeId" class="input">
            <option :value="null">-- Select a recipe --</option>
            <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">
              {{ recipe.title }}
            </option>
          </select>
        </div>

        <div class="text-center text-gray-500 text-sm">OR</div>

        <!-- Custom Meal Name -->
        <div>
          <label class="label">Custom Meal Name</label>
          <input v-model="customMealName" type="text" class="input" placeholder="e.g., Pizza Night" />
        </div>

        <!-- Ingredients -->
        <div>
          <label class="label">Ingredients</label>
          <div class="space-y-2">
            <div v-for="(ingredient, index) in ingredients" :key="index" class="flex gap-2">
              <input 
                v-model="ingredients[index]" 
                type="text" 
                class="input flex-1" 
                placeholder="e.g., 2 cups flour"
              />
              <button 
                type="button" 
                @click="removeIngredient(index)" 
                class="btn btn-secondary px-3"
              >
                ×
              </button>
            </div>
            <button 
              type="button" 
              @click="addIngredient" 
              class="btn btn-secondary text-sm"
            >
              + Add Ingredient
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="label">Notes</label>
          <textarea v-model="notes" class="input" rows="3" placeholder="Any special notes or modifications..."></textarea>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 pt-4">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Meal' }}
          </button>
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem, Recipe } from '~/types/database'

const props = defineProps<{
  menuId?: string
  dayOfWeek: number
  menuItem?: MenuItem | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { fetchRecipes } = useRecipes()
const { addMenuItem, updateMenuItem } = useMenus()

const recipes = ref<Recipe[]>([])
const selectedRecipeId = ref<string | null>(props.menuItem?.recipe_id || null)
const customMealName = ref(props.menuItem?.custom_meal_name || '')
const ingredients = ref<string[]>(props.menuItem?.ingredients || [''])
const notes = ref(props.menuItem?.notes || '')
const saving = ref(false)

onMounted(async () => {
  try {
    recipes.value = await fetchRecipes()
    // If a recipe is selected, populate ingredients from it
    if (selectedRecipeId.value) {
      loadRecipeIngredients()
    }
  } catch (error) {
    console.error('Error loading recipes:', error)
  }
})

// Watch for recipe selection changes
watch(selectedRecipeId, (newRecipeId) => {
  if (newRecipeId) {
    loadRecipeIngredients()
  }
})

const loadRecipeIngredients = () => {
  const recipe = recipes.value.find(r => r.id === selectedRecipeId.value)
  if (recipe && recipe.ingredients.length > 0) {
    ingredients.value = [...recipe.ingredients]
  }
}

const addIngredient = () => {
  ingredients.value.push('')
}

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1)
  if (ingredients.value.length === 0) {
    ingredients.value.push('')
  }
}

const saveMeal = async () => {
  if (!selectedRecipeId.value && !customMealName.value) {
    alert('Please select a recipe or enter a custom meal name')
    return
  }

  saving.value = true
  try {
    // Filter out empty ingredients
    const filteredIngredients = ingredients.value.filter(ing => ing.trim() !== '')
    
    const mealData = {
      menu_id: props.menuId,
      day_of_week: props.dayOfWeek,
      meal_type: 'dinner' as const,
      recipe_id: selectedRecipeId.value,
      custom_meal_name: customMealName.value || null,
      ingredients: filteredIngredients,
      notes: notes.value || null,
      assigned_to: null
    }

    if (props.menuItem) {
      await updateMenuItem(props.menuItem.id, mealData)
    } else {
      await addMenuItem(mealData)
    }

    emit('saved')
  } catch (error: any) {
    alert('Error saving meal: ' + error.message)
  } finally {
    saving.value = false
  }
}
</script>
