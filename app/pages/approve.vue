<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p class="text-gray-600">Verifying approval token...</p>
      </div>

      <!-- Invalid Token -->
      <div v-else-if="!tokenData" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Invalid or Expired Token</h1>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        <NuxtLink to="/menu" class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg">
          Go to Menu
        </NuxtLink>
      </div>

      <!-- Approval Form -->
      <div v-else-if="!submitted" class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Menu Approval Request</h1>
        <p class="text-gray-600 mb-6">Week starting: {{ formatDate(weekData?.start_date) }}</p>

        <!-- Menu Items -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">This Week's Menu</h2>
          <div class="space-y-4">
            <div v-for="item in menuItems" :key="item.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-semibold text-gray-800">{{ item.day_of_week }}</p>
                  <p class="text-sm text-gray-600">{{ item.meal_name }}</p>
                </div>
                <a v-if="item.recipe_url" :href="item.recipe_url" target="_blank" 
                   class="text-primary-500 hover:text-primary-600 text-sm">
                  View Recipe →
                </a>
              </div>
              <div v-if="item.ingredients?.length" class="mt-2">
                <p class="text-xs text-gray-500 mb-1">Ingredients:</p>
                <ul class="text-sm text-gray-600 list-disc list-inside">
                  <li v-for="(ingredient, idx) in item.ingredients.slice(0, 3)" :key="idx">
                    {{ ingredient }}
                  </li>
                  <li v-if="item.ingredients.length > 3" class="text-gray-400">
                    + {{ item.ingredients.length - 3 }} more
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Comments or Suggested Changes (optional)
          </label>
          <textarea 
            v-model="comments" 
            rows="4" 
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add any comments or suggestions here..."
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button 
            @click="handleApprove"
            :disabled="processing"
            class="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {{ processing ? 'Processing...' : '✓ Approve Menu' }}
          </button>
          <button 
            @click="handleRequestChanges"
            :disabled="processing || !comments.trim()"
            class="flex-1 bg-brown-500 hover:bg-brown-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {{ processing ? 'Processing...' : '✎ Request Changes' }}
          </button>
        </div>
        <p v-if="!comments.trim()" class="text-sm text-gray-500 mt-2 text-center">
          Add comments to request changes
        </p>
      </div>

      <!-- Success State -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="text-green-500 text-5xl mb-4">{{ decision === 'approved' ? '✓' : '✎' }}</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          {{ decision === 'approved' ? 'Menu Approved!' : 'Changes Requested' }}
        </h1>
        <p class="text-gray-600 mb-6">
          {{ decision === 'approved' 
            ? 'The menu creator has been notified of your approval.' 
            : 'The menu creator has been notified of your requested changes.' 
          }}
        </p>
        <NuxtLink to="/menu" class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg">
          View Menu
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const { sendApprovalConfirmation, sendEditRequest, verifyToken, markTokenAsUsed } = useEmailApproval()
const { formatDate } = useDateHelpers()

const token = computed(() => route.query.token as string)
const loading = ref(true)
const processing = ref(false)
const submitted = ref(false)
const decision = ref<'approved' | 'changes_requested'>()
const tokenData = ref<any>(null)
const weekData = ref<any>(null)
const menuItems = ref<any[]>([])
const comments = ref('')
const errorMessage = ref('This approval link is invalid or has expired.')

// Verify token and load menu data
onMounted(async () => {
  if (!token.value) {
    loading.value = false
    return
  }

  const result = await verifyToken(token.value)
  
  if (!result.valid) {
    errorMessage.value = result.message || 'Invalid token'
    loading.value = false
    return
  }

  tokenData.value = result.data

  // Load week data
  const { data: week } = await supabase
    .from('weekly_menus')
    .select('*')
    .eq('id', result.data.week_id)
    .single()

  weekData.value = week

  // Load menu items
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('week_id', result.data.week_id)
    .order('day_of_week')

  menuItems.value = items || []
  loading.value = false
})

const handleApprove = async () => {
  processing.value = true
  
  // Update menu status
  await supabase
    .from('weekly_menus')
    .update({ status: 'approved' })
    .eq('id', tokenData.value.week_id)

  // Mark token as used
  await markTokenAsUsed(token.value, 'approved')

  // Send confirmation email
  await sendApprovalConfirmation(
    tokenData.value.week_id,
    formatDate(weekData.value.start_date),
    comments.value
  )

  decision.value = 'approved'
  submitted.value = true
  processing.value = false
}

const handleRequestChanges = async () => {
  if (!comments.value.trim()) return
  
  processing.value = true

  // Update menu status
  await supabase
    .from('weekly_menus')
    .update({ status: 'draft' })
    .eq('id', tokenData.value.week_id)

  // Mark token as used
  await markTokenAsUsed(token.value, 'changes_requested')

  // Send edit request email
  await sendEditRequest(
    tokenData.value.week_id,
    formatDate(weekData.value.start_date),
    comments.value
  )

  decision.value = 'changes_requested'
  submitted.value = true
  processing.value = false
}
</script>
