<template>
  <div class="min-h-screen">
    <nav class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600">
              Dinner Menu Planner
            </NuxtLink>
            <div class="hidden md:ml-10 md:flex md:space-x-8" v-if="user">
              <NuxtLink to="/" class="px-3 py-2 text-sm font-medium text-evergreen-700 hover:text-primary-600">
                Weekly Menu
              </NuxtLink>
              <NuxtLink to="/recipes" class="px-3 py-2 text-sm font-medium text-evergreen-700 hover:text-primary-600">
                Recipes
              </NuxtLink>
              <NuxtLink to="/menus" class="px-3 py-2 text-sm font-medium text-evergreen-700 hover:text-primary-600">
                All Menus
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span v-if="user" class="text-sm text-evergreen-600">{{ user.email }}</span>
            <button v-if="user" @click="handleSignOut" class="btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

const handleSignOut = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>
