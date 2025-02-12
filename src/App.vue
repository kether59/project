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
        <div>
          <label for="session" class="block text-sm font-medium text-gray-700 mb-1">Select or create a session</label>
          <select 
            id="session"
            v-model="selectedSession"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option v-for="session in sessions" :key="session" :value="session">{{ session }}</option>
            <option value="new">Create new session</option>
          </select>
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
  <div v-else>
    <button 
      @click="logout"
      :title="'Logged in as ' + username"
      class="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      Logout ({{ username }})
    </button>
    <router-view></router-view>
  </div>
  <div>
    <p>Current Sessions:</p>
    <ul>
      <li v-for="(session, index) in userSessions" :key="index">{{ session.name }}</li>
    </ul>
    <button @click="addUserSession({ name: 'John Doe' })">Add User Session</button>
    <button @click="clearUserSessions">Clear All Sessions</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from './stores/user'
import { useWheelStore } from './stores/wheel'
import { usePokerStore } from './stores/poker'
import { useRouter } from 'vue-router'
import { useUserSession } from './stores/user.js'

const userStore = useUserStore()
const wheelStore = useWheelStore()
const pokerStore = usePokerStore()
const router = useRouter()
const username = ref(sessionStorage.getItem('username') || '')
const selectedSession = ref('new')
const sessions = ref(['Session 1', 'Session 2', 'Session 3']) // Example sessions, replace with actual data

const { userSessions, addUserSession, clearUserSessions } = useUserSession();

const login = () => {
  if (username.value.trim()) {
    if (selectedSession.value === 'new') {
      const newSession = prompt('Enter new session name:')
      if (newSession) {
        sessions.value.push(newSession)
        selectedSession.value = newSession
      } else {
        return
      }
    }
    userStore.login(username.value.trim())
    pokerStore.setPlayer(username.value.trim())
    wheelStore.addTeammate(username.value.trim())
    sessionStorage.setItem('username', username.value.trim())
    sessionStorage.setItem('session', selectedSession.value)
    router.push('/')
  }
}

const logout = () => {
  userStore.logout()
  pokerStore.removePlayer(username.value.trim())
  wheelStore.removeTeammate(username.value.trim())
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('session')
  username.value = ''
  selectedSession.value = 'new'
  router.push('/')
}
</script>