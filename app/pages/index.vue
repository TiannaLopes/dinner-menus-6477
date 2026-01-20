<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Hero Background -->
  <img src="../assets/6477-hero.jpg"/>
    
    <!-- Content -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
        Dinner Menu Planner
      </h1>
      <p class="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl drop-shadow">
        Plan your weekly dinners, manage recipes, and create shopping lists
      </p>
      
      <NuxtLink 
        to="/menu" 
        class="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
      >
        View This Week's Menu
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
