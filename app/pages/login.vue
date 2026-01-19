<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
    <!-- Hero Image -->
    <div class="absolute inset-0 overflow-hidden">
      <img 
        src="/hero-home.jpg" 
        alt="Home" 
        class="w-full h-full object-cover opacity-20"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-evergreen-900/40"></div>
    </div>
    
    <div class="card max-w-md w-full relative z-10 backdrop-blur-sm bg-white/95">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-evergreen-900 mb-2">Dinner Menu Planner</h1>
        <p class="text-evergreen-600">Sign in to manage your weekly dinner menus</p>
      </div>

      <div v-if="errorMsg" class="mb-4 p-3 bg-brown-50 border border-brown-200 rounded-lg text-brown-700 text-sm">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSignIn" class="space-y-4">
        <div>
          <label class="label">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="input"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label class="label">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="input"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-evergreen-600">
        Don't have an account?
        <button @click="showSignUp = !showSignUp" class="text-primary-600 hover:text-primary-700 font-medium">
          {{ showSignUp ? 'Sign In' : 'Sign Up' }}
        </button>
      </div>

      <div v-if="showSignUp" class="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <p class="text-sm text-evergreen-800">
          <strong>New User Setup:</strong> Enter your email and password above, then click "Sign In". 
          If the account doesn't exist, you'll receive a confirmation email to complete registration.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const router = useRouter()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const showSignUp = ref(false)

// Redirect if already logged in
watch(user, (newUser) => {
  if (newUser) {
    router.push('/')
  }
}, { immediate: true })

const handleSignIn = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      // If user doesn't exist, try to sign up
      if (error.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.value,
          password: password.value
        })
        
        if (signUpError) {
          errorMsg.value = signUpError.message
        } else {
          errorMsg.value = 'Check your email for the confirmation link!'
        }
      } else {
        errorMsg.value = error.message
      }
    } else if (data.user) {
      router.push('/')
    }
  } catch (error: any) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>
