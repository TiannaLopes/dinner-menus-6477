<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">All Menus</h1>
      <p class="text-gray-600 mt-1">Browse and manage all your weekly dinner menus</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading menus...</p>
    </div>

    <div v-else-if="menus.length === 0" class="card text-center py-12">
      <p class="text-gray-600 mb-4">No menus created yet.</p>
      <NuxtLink to="/" class="btn btn-primary">
        Create Your First Menu
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div v-for="menu in menus" :key="menu.id" class="card hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo(`/`)">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg mb-2">
              Week of {{ formatDate(menu.week_start_date) }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ menu.menu_items?.length || 0 }} meals planned
            </p>
          </div>
          <StatusBadge :status="menu.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const { fetchMenus } = useMenus()
const { formatDate } = useDateHelpers()
const menus = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    menus.value = await fetchMenus()
  } catch (error) {
    console.error('Error loading menus:', error)
  } finally {
    loading.value = false
  }
})
</script>
