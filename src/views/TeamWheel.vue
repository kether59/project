<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Navigation -->
      <div class="mb-6 flex justify-between items-center">
        <router-link to="/" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          <span class="mr-2">←</span> Back to Home
        </router-link>
        <div class="text-gray-600">
          Logged in as: <span class="font-semibold">{{ userStore.username }}</span>
        </div>
      </div>

      <!-- Winner Announcement -->
      <div v-if="store.selectedTeammate && !store.isSpinning" 
        class="text-center mb-6 bg-white rounded-lg shadow p-4">
        <div class="text-4xl font-bold text-indigo-600 animate-bounce">
          🎉 {{ store.selectedTeammate }} 🎉
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column - Wheel -->
        <div class="bg-white rounded-lg shadow p-6">
          <WheelV2
            ref="wheelRef"
            :slices="wheelSlices"
            :sounds="{}"
            @spin-start="onSpinStart"
            @spin-end="onSpinEnd"
            class="max-w-[500px] mx-auto mb-6"
          >
            <template #cursor>
              <div class="text-4xl">▼</div>
            </template>
          </WheelV2>

          <button 
            @click="spin"
            :disabled="store.isSpinning || store.teammates.length === 0"
            class="w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {{ store.isSpinning ? 'Spinning...' : 'Spin the Wheel!' }}
          </button>
        </div>

        <!-- Right Column - Team Management -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-semibold mb-6">Team Members</h2>
          
          <!-- Add Team Member -->
          <div class="flex gap-4 mb-6">
            <input 
              v-model="newMember" 
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Team member name"
              @keyup.enter="addMember"
            >
            <button 
              @click="addMember"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add Member
            </button>
          </div>

          <!-- Team Members List -->
          <div class="space-y-2 max-h-[400px] overflow-y-auto">
            <div 
              v-for="member in store.teammates" 
              :key="member"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span class="font-medium">{{ member }}</span>
              <button 
                @click="removeMember(member)"
                class="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
              >
                <span class="text-xl">×</span>
              </button>
            </div>
            
            <div v-if="store.teammates.length === 0" 
              class="text-center py-8 text-gray-500">
              Add team members to start spinning the wheel!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWheelStore } from '../stores/wheel'
import { useUserStore } from '../stores/user'
import confetti from 'canvas-confetti'
import WheelV2 from './WheelV2.vue'

const store = useWheelStore()
const userStore = useUserStore()
const newMember = ref('')
const wheelRef = ref(null)
const MIN_SEGMENTS = 8

const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
    '#E67E22', '#27AE60', '#F1C40F', '#E74C3C'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const wheelSlices = computed(() => {
  const teammates = store.teammates
  const totalSlices = Math.max(teammates.length, MIN_SEGMENTS)
  const slices = []

  for (let i = 0; i < totalSlices; i++) {
    slices.push({
      text: teammates[i] || '',
      color: getRandomColor()
    })
  }

  return slices
})

const addMember = () => {
  if (newMember.value.trim()) {
    store.addTeammate(newMember.value.trim())
    newMember.value = ''
  }
}

const removeMember = (name) => {
  store.removeTeammate(name)
}

const onSpinStart = () => {
  store.isSpinning = true
}

const onSpinEnd = (winnerIndex) => {
  store.isSpinning = false
  store.selectedTeammate = store.teammates[winnerIndex] || ''
  if (store.selectedTeammate) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }
}

const spin = async () => {
  if (wheelRef.value && store.teammates.length > 0) {
    const winnerIndex = Math.floor(Math.random() * store.teammates.length)
    wheelRef.value.spinWheel(winnerIndex)
  }
}
</script>