<template>
  <div>
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading recipe...</p>
    </div>

    <div v-else-if="recipe" class="max-w-4xl">
      <NuxtLink to="/recipes" class="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        ← Back to Recipes
      </NuxtLink>

      <div class="card">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ recipe.title }}</h1>
          
          <div class="flex items-center space-x-6 text-gray-600">
            <span v-if="recipe.prep_time">⏱️ Prep: {{ recipe.prep_time }} min</span>
            <span v-if="recipe.cook_time">🔥 Cook: {{ recipe.cook_time }} min</span>
            <span v-if="recipe.servings">🍽️ Serves: {{ recipe.servings }}</span>
          </div>
        </div>

        <img v-if="recipe.image_url" :src="recipe.image_url" :alt="recipe.title" class="w-full max-w-2xl rounded-lg mb-6" />

        <div class="mb-6">
          <h2 class="text-xl font-bold mb-3">Ingredients</h2>
          <ul class="space-y-2">
            <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx" class="flex items-start">
              <span class="text-primary-600 mr-2">•</span>
              <span>{{ ingredient }}</span>
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-bold mb-3">Instructions</h2>
          <ol class="space-y-3">
            <li v-for="(instruction, idx) in recipe.instructions" :key="idx" class="flex">
              <span class="font-bold text-primary-600 mr-3">{{ idx + 1 }}.</span>
              <span>{{ instruction }}</span>
            </li>
          </ol>
        </div>

        <div v-if="recipe.source_url" class="pt-6 border-t">
          <a :href="recipe.source_url" target="_blank" class="text-primary-600 hover:text-primary-700">
            View Original Recipe →
          </a>
        </div>

        <div class="mt-6 pt-6 border-t flex space-x-3">
          <button @click="deleteRecipeConfirm" class="btn btn-danger">
            Delete Recipe
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/database'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { fetchRecipeById, deleteRecipe } = useRecipes()

const recipe = ref<Recipe | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    recipe.value = await fetchRecipeById(route.params.id as string)
  } catch (error) {
    console.error('Error loading recipe:', error)
    router.push('/recipes')
  } finally {
    loading.value = false
  }
})

const deleteRecipeConfirm = async () => {
  if (!recipe.value) return
  
  if (!confirm(`Are you sure you want to delete "${recipe.value.title}"?`)) return
  
  try {
    await deleteRecipe(recipe.value.id)
    router.push('/recipes')
  } catch (error: any) {
    alert('Error deleting recipe: ' + error.message)
  }
}
</script>
