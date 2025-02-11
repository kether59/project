<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Team Tools</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <router-link to="/planning-poker" 
            class="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 class="text-xl font-semibold mb-2">Planning Poker</h2>
            <p class="text-gray-600">Estimate features with your team using Planning Poker.</p>
          </router-link>
          
          <router-link to="/team-wheel" 
            class="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 class="text-xl font-semibold mb-2">Team Wheel</h2>
            <p class="text-gray-600">Randomly select team members with a spinning wheel animation.</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home view component
</script>