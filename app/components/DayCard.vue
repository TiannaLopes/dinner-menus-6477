<template>
  <div class="card hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <h3 class="font-bold text-lg text-evergreen-900">{{ day.dayName }}</h3>
      <span class="text-sm text-evergreen-600">{{ day.formatted }}</span>
    </div>

    <div v-if="menuItem">
      <h4 class="font-medium text-evergreen-900 mb-2">
        {{ menuItem.recipe?.title || menuItem.custom_meal_name }}
      </h4>
      
      <p v-if="menuItem.notes" class="text-sm text-evergreen-600 mb-2">
        {{ menuItem.notes }}
      </p>

      <div v-if="menuItem.ingredients?.length" class="mb-3">
        <p class="text-xs text-slate-500 mb-1">Ingredients:</p>
        <ul class="text-xs text-evergreen-600 space-y-0.5">
          <li v-for="(ingredient, idx) in menuItem.ingredients.slice(0, 3)" :key="idx">
            • {{ ingredient }}
          </li>
          <li v-if="menuItem.ingredients.length > 3" class="text-slate-400 italic">
            + {{ menuItem.ingredients.length - 3 }} more...
          </li>
        </ul>
      </div>

      <div class="flex space-x-2">
        <button @click="$emit('edit', menuItem)" class="text-sm text-primary-600 hover:text-primary-700">
          Edit
        </button>
        <button @click="$emit('delete', menuItem.id)" class="text-sm text-brown-600 hover:text-brown-700">
          Delete
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-slate-400 mb-3">No meal planned</p>
      <button @click="$emit('add')" class="btn btn-secondary text-sm">
        + Add Meal
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/database'

defineProps<{
  day: {
    dayName: string
    formatted: string
    dayOfWeek: number
  }
  menuItem: (MenuItem & { recipe?: any }) | null
}>()

defineEmits<{
  add: []
  edit: [item: MenuItem]
  delete: [id: string]
}>()
</script>
