import { defineStore } from 'pinia'

// This is a placeholder store to initialize Pinia
// You can add your own stores as needed
export const useAppStore = defineStore('app', {
  state: () => ({
    initialized: true
  }),
  
  getters: {
    isInitialized: (state) => state.initialized
  },
  
  actions: {
    initialize() {
      this.initialized = true
    }
  }
})
