<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/recipes" class="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        ← Back to Recipes
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Add Recipe from URL</h1>
      <p class="text-gray-600 mt-1">Paste a recipe URL and we'll extract the details automatically</p>
    </div>

    <div class="card max-w-4xl">
      <!-- URL Input -->
      <div class="mb-6">
        <label class="label">Recipe URL</label>
        <div class="flex space-x-3">
          <input 
            v-model="url" 
            type="url" 
            class="input flex-1"
            placeholder="https://www.allrecipes.com/recipe/..."
            @keyup.enter="scrapeRecipe"
          />
          <button 
            @click="scrapeRecipe" 
            class="btn btn-primary"
            :disabled="scraping || !url"
          >
            {{ scraping ? 'Scraping...' : 'Scrape Recipe' }}
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Supported sites: AllRecipes, Food Network, NYTimes Cooking, and most sites with structured recipe data
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Scraped Recipe Preview -->
      <div v-if="scrapedRecipe" class="space-y-6">
        <div class="border-t pt-6">
          <h2 class="text-xl font-bold mb-4">Recipe Preview</h2>
          
          <div class="space-y-4">
            <div>
              <label class="label">Title</label>
              <input v-model="scrapedRecipe.title" type="text" class="input" />
            </div>

            <div v-if="scrapedRecipe.imageUrl">
              <label class="label">Image</label>
              <img :src="scrapedRecipe.imageUrl" class="w-full max-w-md rounded-lg" alt="Recipe" />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="label">Prep Time (min)</label>
                <input v-model.number="scrapedRecipe.prepTime" type="number" class="input" />
              </div>
              <div>
                <label class="label">Cook Time (min)</label>
                <input v-model.number="scrapedRecipe.cookTime" type="number" class="input" />
              </div>
              <div>
                <label class="label">Servings</label>
                <input v-model.number="scrapedRecipe.servings" type="number" class="input" />
              </div>
            </div>

            <div>
              <label class="label">Ingredients</label>
              <div class="space-y-2">
                <div v-for="(ingredient, idx) in scrapedRecipe.ingredients" :key="idx" class="flex space-x-2">
                  <input v-model="scrapedRecipe.ingredients[idx]" type="text" class="input flex-1" />
                  <button @click="removeIngredient(idx)" class="btn btn-danger">×</button>
                </div>
                <button @click="addIngredient" class="btn btn-secondary">+ Add Ingredient</button>
              </div>
            </div>

            <div>
              <label class="label">Instructions</label>
              <div class="space-y-2">
                <div v-for="(instruction, idx) in scrapedRecipe.instructions" :key="idx" class="flex space-x-2">
                  <textarea v-model="scrapedRecipe.instructions[idx]" class="input flex-1" rows="2"></textarea>
                  <button @click="removeInstruction(idx)" class="btn btn-danger">×</button>
                </div>
                <button @click="addInstruction" class="btn btn-secondary">+ Add Step</button>
              </div>
            </div>

            <div class="flex space-x-3 pt-4">
              <button @click="saveRecipe" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save Recipe' }}
              </button>
              <button @click="resetForm" class="btn btn-secondary">
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ScrapedRecipe } from '~/types/database'

const router = useRouter()
const { createRecipe } = useRecipes()

const url = ref('')
const scrapedRecipe = ref<ScrapedRecipe | null>(null)
const scraping = ref(false)
const saving = ref(false)
const error = ref('')

const scrapeRecipe = async () => {
  if (!url.value) return
  
  scraping.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/scrape-recipe', {
      method: 'POST',
      body: { url: url.value }
    })
    scrapedRecipe.value = response as ScrapedRecipe
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to scrape recipe. Try manual entry instead.'
  } finally {
    scraping.value = false
  }
}

const addIngredient = () => {
  scrapedRecipe.value?.ingredients.push('')
}

const removeIngredient = (index: number) => {
  scrapedRecipe.value?.ingredients.splice(index, 1)
}

const addInstruction = () => {
  scrapedRecipe.value?.instructions.push('')
}

const removeInstruction = (index: number) => {
  scrapedRecipe.value?.instructions.splice(index, 1)
}

const saveRecipe = async () => {
  if (!scrapedRecipe.value) return
  
  saving.value = true
  try {
    const recipe = await createRecipe({
      title: scrapedRecipe.value.title,
      source_url: scrapedRecipe.value.sourceUrl,
      ingredients: scrapedRecipe.value.ingredients.filter(i => i.trim()),
      instructions: scrapedRecipe.value.instructions.filter(i => i.trim()),
      prep_time: scrapedRecipe.value.prepTime || null,
      cook_time: scrapedRecipe.value.cookTime || null,
      servings: scrapedRecipe.value.servings || null,
      image_url: scrapedRecipe.value.imageUrl || null,
      tags: []
    })
    
    router.push(`/recipes/${recipe.id}`)
  } catch (err: any) {
    error.value = err.message || 'Failed to save recipe'
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  url.value = ''
  scrapedRecipe.value = null
  error.value = ''
}
</script>
