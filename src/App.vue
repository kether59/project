<template>
  <div v-if="!userStore.isLoggedIn()" class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Welcome to Team Tools</h1>
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Enter your name</label>
          <input 
            id="username"
            v-model="username" 
            @keyup.enter="login"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Your name"
          >
        </div>
        <button 
          @click="login"
          class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Start
        </button>
      </div>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from './stores/user'
import { useWheelStore } from './stores/wheel'
import { usePokerStore } from './stores/poker'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const wheelStore = useWheelStore()
const pokerStore = usePokerStore()
const router = useRouter()
const username = ref('')

const login = () => {
  if (username.value.trim()) {
    userStore.login(username.value.trim())
    pokerStore.setPlayer(username.value.trim())
    wheelStore.addTeammate(username.value.trim())
    router.push('/')
  }
}
</script>