// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
  ],

  supabase: {
    redirect: false,
  },

  app: {
    // GitHub Pages requires baseURL to be set to repo name for project pages
    baseURL: process.env.NODE_ENV === 'production' ? '/dinner-menus-6477/' : '/',
    buildAssetsDir: '_nuxt',
    head: {
      title: 'Dinner Menu Planner',
      meta: [
        { name: 'description', content: 'Manage weekly dinner menus with your family' }
      ]
    }
  }
})
