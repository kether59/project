<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-full mx-auto">
      <!-- Navigation -->
      <div class="mb-6 flex justify-between items-center">
        <router-link to="/" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          <span class="mr-2">←</span> Back to Home
        </router-link>
        <div class="text-gray-600">
          Logged in as: <span class="font-semibold">{{ userStore.username }}</span>
        </div>
      </div>

      <!-- Session Management -->
      <div>
        <!-- Current Session Display -->
        <div v-if="store.currentSession" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-xl font-semibold">Current Session: {{ store.currentSession.name }}</h2>
                <p class="text-gray-600">{{ store.currentSession.feature }}</p>
              </div>
              <button 
                @click="leaveSession"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Leave Session
              </button>
            </div>
            
            <!-- Votes Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vote
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(vote, playerId) in store.votes[store.currentSession.id]" :key="playerId">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ vote.playerName }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        <span v-if="store.currentSession.revealed">{{ vote.value }}</span>
                        <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Voted
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button 
              @click="revealVotes"
              class="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Reveal Votes
            </button>
          </div>

          <!-- Voting Cards -->
          <div class="bg-white rounded-lg shadow p-6">
            <PokerCards title="Choose your estimate" @card-selected="vote" />
          </div>
        </div>

        <!-- Session Selection -->
        <div v-else class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="grid grid-cols-1 gap-6">
            <!-- Join Existing Session -->
            <div v-if="store.sessions.length > 0">
              <h2 class="text-xl font-semibold mb-4">Available Sessions</h2>
              <div class="space-y-4">
                <div v-for="session in store.sessions" :key="session.id"
                  class="p-4 bg-gray-50 rounded-lg"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="font-semibold">{{ session.name }}</h3>
                      <p class="text-sm text-gray-600">{{ session.feature }}</p>
                    </div>
                    <button 
                      @click="joinSession(session)"
                      class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Create New Session -->
            <div>
              <h2 class="text-xl font-semibold mb-4">Create New Session</h2>
              <div class="flex flex-col gap-4">
                <input 
                  v-model="newFeature" 
                  class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Feature description"
                >
                <input 
                  v-model="sessionName" 
                  class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Session name (e.g., Sprint 1 - Login Feature)"
                >
                <button 
                  @click="createSession"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Session
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">History</h2>
          <div class="space-y-4">
            <div 
              v-for="session in store.history" 
              :key="session.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <h3 class="font-semibold">{{ session.name }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ session.feature }}</p>
              <div class="mt-2 text-sm text-gray-600">
                <div v-for="(vote, playerId) in session.finalVotes" :key="playerId">
                  {{ vote.playerName }}: {{ vote.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePokerStore } from '../stores/poker'
import { useUserStore } from '../stores/user'
import PokerCards from './poker/component/PokerCards.vue'
import Cookies from 'js-cookie'

const store = usePokerStore()
const userStore = useUserStore()
const newFeature = ref('')
const sessionName = ref('')

onMounted(() => {
  store.loadSession()
})

const createSession = () => {
  if (newFeature.value.trim() && sessionName.value.trim()) {
    store.createSession(newFeature.value.trim(), sessionName.value.trim())
    newFeature.value = ''
    sessionName.value = ''
  }
}

const joinSession = (session) => {
  store.currentSession = session
  Cookies.set('currentSessionId', session.id, { expires: 7 })
}

const leaveSession = () => {
  store.leaveSession()
}

const vote = (value) => {
  if (store.currentSession) {
    store.vote(store.currentSession.id, value)
  }
}

const revealVotes = () => {
  if (store.currentSession) {
    store.revealVotes(store.currentSession.id)
  }
}
</script>