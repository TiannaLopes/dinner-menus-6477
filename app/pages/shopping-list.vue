<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-evergreen-900">Shopping List</h1>
        <p class="text-evergreen-600 mt-1">{{ weekRange }}</p>
      </div>
      <div class="flex space-x-3">
        <button @click="navigateWeek(-1)" class="btn btn-secondary">
          ← Previous
        </button>
        <button @click="goToCurrentWeek" class="btn btn-secondary">
          This Week
        </button>
        <button @click="navigateWeek(1)" class="btn btn-secondary">
          Next →
        </button>
        <button @click="exportList" class="btn btn-primary">
          Export List
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-evergreen-600">Loading shopping list...</p>
    </div>

    <div v-else-if="!menu" class="card text-center py-12">
      <p class="text-evergreen-600 mb-4">No menu exists for this week yet.</p>
      <NuxtLink to="/" class="btn btn-primary">
        Create Weekly Menu
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Shopping List by Day -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div 
          v-for="day in daysWithMeals" 
          :key="day.dayOfWeek"
          class="card"
        >
          <h3 class="font-bold text-lg text-evergreen-900 mb-4">
            {{ day.dayName }} - {{ day.formatted }}
          </h3>
          <div v-if="day.menuItem">
            <h4 class="font-medium text-evergreen-800 mb-2">
              {{ day.menuItem.recipe?.title || day.menuItem.custom_meal_name }}
            </h4>
            <ul v-if="day.menuItem.ingredients?.length" class="space-y-1">
              <li 
                v-for="(ingredient, idx) in day.menuItem.ingredients" 
                :key="idx"
                class="text-sm text-evergreen-700 flex items-start"
              >
                <span class="mr-2">•</span>
                <span>{{ ingredient }}</span>
              </li>
            </ul>
            <p v-else class="text-sm text-slate-500 italic">No ingredients listed</p>
          </div>
        </div>
      </div>

      <!-- Consolidated Shopping List -->
      <div class="card">
        <h2 class="text-2xl font-bold text-evergreen-900 mb-4">
          Consolidated Shopping List
        </h2>
        <p class="text-evergreen-600 mb-4">All ingredients for the week:</p>
        
        <div v-if="allIngredients.length > 0" class="space-y-1">
          <div 
            v-for="(ingredient, idx) in allIngredients" 
            :key="idx"
            class="flex items-center py-2 border-b border-slate-100 last:border-0"
          >
            <input 
              type="checkbox" 
              :id="`ingredient-${idx}`"
              class="mr-3 h-5 w-5 text-primary-600 rounded"
            />
            <label 
              :for="`ingredient-${idx}`" 
              class="text-evergreen-800 cursor-pointer flex-1"
            >
              {{ ingredient }}
            </label>
          </div>
        </div>
        <p v-else class="text-slate-500 italic">No ingredients found for this week</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/database'

const { fetchMenuByWeek } = useMenus()
const { getWeekStart, formatWeekRange, getWeekDays, toISODate } = useDateHelpers()

const currentWeekStart = ref(getWeekStart())
const menu = ref<any>(null)
const loading = ref(false)

const weekRange = computed(() => formatWeekRange(currentWeekStart.value))
const weekDays = computed(() => getWeekDays(currentWeekStart.value))

const daysWithMeals = computed(() => {
  return weekDays.value.map(day => ({
    ...day,
    menuItem: getMenuItemForDay(day.dayOfWeek)
  })).filter(day => day.menuItem)
})

const allIngredients = computed(() => {
  if (!menu.value?.menu_items) return []
  
  const ingredients: string[] = []
  menu.value.menu_items.forEach((item: MenuItem) => {
    if (item.ingredients && Array.isArray(item.ingredients)) {
      ingredients.push(...item.ingredients)
    }
  })
  
  return ingredients
})

const loadMenu = async () => {
  loading.value = true
  try {
    const weekStart = toISODate(currentWeekStart.value)
    menu.value = await fetchMenuByWeek(weekStart)
  } catch (error) {
    console.error('Error loading menu:', error)
  } finally {
    loading.value = false
  }
}

const getMenuItemForDay = (dayOfWeek: number) => {
  if (!menu.value?.menu_items) return null
  return menu.value.menu_items.find((item: MenuItem) => item.day_of_week === dayOfWeek)
}

const navigateWeek = (direction: number) => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + (direction * 7))
  currentWeekStart.value = getWeekStart(newDate)
  loadMenu()
}

const goToCurrentWeek = () => {
  currentWeekStart.value = getWeekStart()
  loadMenu()
}

const exportList = () => {
  if (allIngredients.value.length === 0) {
    alert('No ingredients to export')
    return
  }

  const content = `Shopping List - ${weekRange.value}\n\n${allIngredients.value.map(ing => `☐ ${ing}`).join('\n')}`
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `shopping-list-${toISODate(currentWeekStart.value)}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadMenu()
})
</script>
