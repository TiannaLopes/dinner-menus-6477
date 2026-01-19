<template>
  <div class="card cursor-pointer hover:shadow-lg transition-shadow">
    <div v-if="recipe.image_url" class="mb-4">
      <img :src="recipe.image_url" :alt="recipe.title" class="w-full h-48 object-cover rounded-lg" />
    </div>
    
    <h3 class="font-bold text-lg mb-2">{{ recipe.title }}</h3>
    
    <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
      <span v-if="recipe.prep_time">⏱️ Prep: {{ recipe.prep_time }}min</span>
      <span v-if="recipe.cook_time">🔥 Cook: {{ recipe.cook_time }}min</span>
      <span v-if="recipe.servings">🍽️ Serves: {{ recipe.servings }}</span>
    </div>

    <p class="text-sm text-gray-600 line-clamp-2">
      {{ recipe.ingredients.slice(0, 3).join(', ') }}{{ recipe.ingredients.length > 3 ? '...' : '' }}
    </p>

    <div v-if="recipe.source_url" class="mt-3 pt-3 border-t">
      <a :href="recipe.source_url" target="_blank" class="text-xs text-primary-600 hover:text-primary-700">
        View Original Recipe →
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/database'

defineProps<{
  recipe: Recipe
}>()
</script>
