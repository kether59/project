<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-full mx-auto">
      <!-- Navigation -->
      <div class="mb-6 flex justify-between items-center">
        <router-link to="/" class="inline-flex items-center px-4 py-2 bg-gray-600 text-blue-900 rounded-md hover:bg-gray-700">
          <span class="mr-2">←</span> Back to Home
        </router-link>
        <div class="text-gray-600">
          Logged in as: <span class="font-semibold text-blue-900">{{ username }}</span>
        </div>
      </div>

      <!-- Session Management -->
      <div>
        <div v-if="currentSession" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-xl font-semibold">Current Session: {{ currentSession.name }}</h2>
                <p class="text-gray-600">{{ currentSession.feature }}</p>
              </div>
              <button @click="leaveSession" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Leave Session
              </button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vote</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(vote, player) in votes[currentSession.id]" :key="player">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ player }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        <span v-if="currentSession.revealed">{{ vote }}</span>
                        <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Voted</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button @click="revealVotes" class="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Reveal Votes
            </button>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <PokerCards title="Choose your estimate" @card-selected="vote" />
          </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Create or Join a Session</h2>
          <input v-model="newFeature" class="mb-2 rounded-md border-gray-300" placeholder="Feature description">
          <input v-model="sessionName" class="mb-2 rounded-md border-gray-300" placeholder="Session name">
          <button @click="createSession" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Create Session</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStorage, useLocalStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import PokerCards from './poker/component/PokerCards.vue'

const username = useSessionStorage('username', 'Guest' + Math.floor(Math.random() * 1000))
const sessions = useLocalStorage('sessions', [])
const currentSession = useSessionStorage('currentSession', null)
const votes = useLocalStorage('votes', {})

const newFeature = ref('')
const sessionName = ref('')

const createSession = () => {
  const session = { id: uuidv4(), feature: newFeature.value, name: sessionName.value, revealed: false }
  sessions.value.push(session)
  currentSession.value = session
}

const vote = (value) => {
  if (!votes.value[currentSession.value.id]) {
    votes.value[currentSession.value.id] = {}
  }
  votes.value[currentSession.value.id][username.value] = value
}

const revealVotes = () => {
  if (currentSession.value) {
    currentSession.value.revealed = true
  }
}

const leaveSession = () => {
  currentSession.value = null
}
</script>