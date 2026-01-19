<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-evergreen-900">Weekly Menu</h1>
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
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-evergreen-600">Loading menu...</p>
    </div>

    <div v-else-if="!menu" class="card text-center py-12">
      <p class="text-evergreen-600 mb-4">No menu exists for this week yet.</p>
      <button @click="createNewMenu" class="btn btn-primary">
        Create Menu for This Week
      </button>
    </div>

    <div v-else>
      <!-- Status Badge -->
      <div class="mb-6">
        <StatusBadge :status="menu.status" />
        <div class="mt-3 flex space-x-3">
          <button 
            v-if="menu.status === 'draft'" 
            @click="submitForApproval"
            class="btn btn-primary"
          >
            Submit for Approval
          </button>
          <button 
            v-if="menu.status === 'pending_approval' && canApprove" 
            @click="approveMenu"
            class="btn btn-primary"
          >
            Approve Menu
          </button>
          <button 
            v-if="menu.status === 'pending_approval' && canApprove" 
            @click="requestChanges"
            class="btn btn-secondary"
          >
            Request Changes
          </button>
        </div>
      </div>

      <!-- Weekly Calendar -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <DayCard 
          v-for="day in weekDays" 
          :key="day.dayOfWeek"
          :day="day"
          :menu-item="getMenuItemForDay(day.dayOfWeek)"
          @add="handleAddMeal(day.dayOfWeek)"
          @edit="handleEditMeal"
          @delete="handleDeleteMeal"
        />
      </div>
    </div>

    <!-- Add/Edit Meal Modal -->
    <MealModal 
      v-if="showMealModal"
      :menu-id="menu?.id"
      :day-of-week="selectedDayOfWeek"
      :menu-item="selectedMenuItem"
      @close="showMealModal = false"
      @saved="handleMealSaved"
    />
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/database'

definePageMeta({
  middleware: 'auth'
})

const { fetchMenuByWeek, createMenu } = useMenus()
const { getWeekStart, formatWeekRange, getWeekDays, toISODate } = useDateHelpers()
const user = useSupabaseUser()

const currentWeekStart = ref(getWeekStart())
const menu = ref<any>(null)
const loading = ref(false)
const showMealModal = ref(false)
const selectedDayOfWeek = ref(0)
const selectedMenuItem = ref<MenuItem | null>(null)

const weekRange = computed(() => formatWeekRange(currentWeekStart.value))
const weekDays = computed(() => getWeekDays(currentWeekStart.value))
const canApprove = computed(() => {
  // In production, check if user has 'viewer' role (husband)
  return true
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

const createNewMenu = async () => {
  try {
    const weekStart = toISODate(currentWeekStart.value)
    menu.value = await createMenu(weekStart)
  } catch (error: any) {
    alert('Error creating menu: ' + error.message)
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

const handleAddMeal = (dayOfWeek: number) => {
  selectedDayOfWeek.value = dayOfWeek
  selectedMenuItem.value = null
  showMealModal.value = true
}

const handleEditMeal = (menuItem: MenuItem) => {
  selectedMenuItem.value = menuItem
  selectedDayOfWeek.value = menuItem.day_of_week
  showMealModal.value = true
}

const handleDeleteMeal = async (menuItemId: string) => {
  if (!confirm('Are you sure you want to delete this meal?')) return
  
  const { deleteMenuItem } = useMenus()
  try {
    await deleteMenuItem(menuItemId)
    await loadMenu()
  } catch (error: any) {
    alert('Error deleting meal: ' + error.message)
  }
}

const handleMealSaved = () => {
  showMealModal.value = false
  loadMenu()
}

const submitForApproval = async () => {
  const { updateMenuStatus } = useMenus()
  try {
    await updateMenuStatus(menu.value.id, 'pending_approval')
    await loadMenu()
  } catch (error: any) {
    alert('Error submitting menu: ' + error.message)
  }
}

const approveMenu = async () => {
  const { updateMenuStatus } = useMenus()
  try {
    await updateMenuStatus(menu.value.id, 'approved')
    await loadMenu()
  } catch (error: any) {
    alert('Error approving menu: ' + error.message)
  }
}

const requestChanges = async () => {
  const comment = prompt('What changes would you like to see?')
  if (!comment) return
  
  const { updateMenuStatus } = useMenus()
  try {
    await updateMenuStatus(menu.value.id, 'needs_changes', comment)
    await loadMenu()
  } catch (error: any) {
    alert('Error requesting changes: ' + error.message)
  }
}

onMounted(() => {
  loadMenu()
})
</script>
