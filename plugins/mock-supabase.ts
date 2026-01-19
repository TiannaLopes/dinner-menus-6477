// Mock Supabase plugin for development without database
export default defineNuxtPlugin(() => {
  // Plugin just provides the mock client instance
  // The composables are defined in composables/useSupabase.ts
  
  console.log('🔧 Running in mock mode - Supabase not configured')
  console.log('ℹ️  Add SUPABASE_URL and SUPABASE_KEY to .env to enable database features')
})
