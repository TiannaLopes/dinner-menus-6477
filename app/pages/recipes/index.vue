<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Recipe Library</h1>
      <NuxtLink to="/recipes/scrape" class="btn btn-primary">
        + Add Recipe from URL
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading recipes...</p>
    </div>

    <div v-else-if="recipes.length === 0" class="card text-center py-12">
      <p class="text-gray-600 mb-4">No recipes yet. Start by adding your first recipe!</p>
      <NuxtLink to="/recipes/scrape" class="btn btn-primary">
        Add Recipe from URL
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RecipeCard 
        v-for="recipe in recipes" 
        :key="recipe.id"
        :recipe="recipe"
        @click="navigateTo(`/recipes/${recipe.id}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/database'

const { fetchRecipes } = useRecipes()
const recipes = ref<Recipe[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    recipes.value = await fetchRecipes()
  } catch (error) {
    console.error('Error loading recipes:', error)
  } finally {
    loading.value = false
  }
})
</script>
