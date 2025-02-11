<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Navigation -->
      <div class="mb-6">
        <router-link to="/" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          <span class="mr-2">←</span> Back to Home
        </router-link>
      </div>

      <!-- Player Registration -->
      <div v-if="!store.playerName" class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Join Session</h2>
        <div class="flex gap-4">
          <input 
            v-model="newPlayerName" 
            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Your name"
          >
          <button 
            @click="registerPlayer"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Join
          </button>
        </div>
      </div>

      <!-- Session Management -->
      <div v-else>
        <div v-if="!store.currentSession" class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="grid grid-cols-1 gap-6">
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

            <!-- Join Existing Session -->
            <div>
              <h2 class="text-xl font-semibold mb-4">Join Existing Session</h2>
              <div class="space-y-4">
                <div v-for="session in store.sessions" :key="session.id"
                  class="p-4 bg-gray-50 rounded-lg">
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
          </div>
        </div>

        <!-- Current Session -->
        <div v-if="store.currentSession" class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-xl font-semibold">{{ store.currentSession.name }}</h2>
              <p class="text-gray-600">{{ store.currentSession.feature }}</p>
            </div>
            <button 
              @click="leaveSession"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Leave Session
            </button>
          </div>
          
          <!-- Connected Players -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Connected Players</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(vote, playerId) in store.votes[store.currentSession.id]" 
                :key="playerId"
                class="p-4 bg-gray-50 rounded-lg text-center"
              >
                <div class="font-semibold">{{ vote.playerName }}</div>
                <div class="mt-2">
                  <span v-if="store.currentSession.revealed" class="text-lg">{{ vote.value }}</span>
                  <span v-else class="text-green-600">✓</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Voting Cards -->
          <PokerCards title="Choose your estimate" @card-selected="vote" />

          <button 
            @click="revealVotes"
            class="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Reveal Votes
          </button>
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
import { ref } from 'vue'
import { usePokerStore } from '../stores/poker'
import PokerCards from './poker/component/PokerCards.vue'

const store = usePokerStore()
const newPlayerName = ref('')
const newFeature = ref('')
const sessionName = ref('')

const registerPlayer = () => {
  if (newPlayerName.value.trim()) {
    store.setPlayer(newPlayerName.value.trim())
  }
}

const createSession = () => {
  if (newFeature.value.trim() && sessionName.value.trim()) {
    store.createSession(newFeature.value.trim(), sessionName.value.trim())
    newFeature.value = ''
    sessionName.value = ''
  }
}

const joinSession = (session) => {
  store.currentSession = session
}

const leaveSession = () => {
  store.currentSession = null
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