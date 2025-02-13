<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-full mx-auto">
      <!-- Navigation -->
      <div class="mb-6 flex justify-between items-center">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          <span class="mr-2">←</span> Back to Home
        </router-link>
        <div class="text-gray-600">
          Logged in as:
          <span class="font-semibold text-gray-900">{{ userStore.getCurrentUser }}</span>
        </div>
      </div>

      <!-- Session Management -->
      <div class="space-y-6">
        <div v-if="currentSession" class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-xl font-semibold">
                Current Session: {{ currentSession.name }}
              </h2>
              <p class="text-gray-600">{{ currentSession.feature }}</p>
            </div>
            <button
              @click="leaveSession"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Leave Session
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Player
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vote
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="player in currentSession.players"
                  :key="player.id"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ player.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      <span v-if="currentSession.revealed && votes[currentSession.id]?.[player.name]">
                        {{ votes[currentSession.id][player.name].value }}
                      </span>
                      <span
                        v-else-if="votes[currentSession.id]?.[player.name]"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        Voted
                      </span>
                      <span v-else class="text-gray-400">Not voted</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex justify-between items-center">
            <button
              @click="revealVotes"
              :disabled="!hasVotes"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reveal Votes
            </button>
            <button
              @click="startNewVoting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              New Voting Round
            </button>
          </div>
        </div>

        <div v-if="currentSession" class="bg-white rounded-lg shadow p-6">
          <PokerCards @card-selected="vote" />
        </div>

        <div v-if="!currentSession" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Create New Session</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Feature Description
              </label>
              <input
                v-model="newFeature"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="What are we estimating?"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Session Name
              </label>
              <input
                v-model="sessionName"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Give this session a name"
              />
            </div>
            <button
              @click="createSession"
              :disabled="!canCreateSession"
              class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Session
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { usePokerStore } from '../stores/poker';
import { useRouter } from 'vue-router';
import PokerCards from './poker/component/PokerCards.vue';

const userStore = useUserStore();
const pokerStore = usePokerStore();
const router = useRouter();

const newFeature = ref('');
const sessionName = ref('');
const currentSession = ref(null);
const votes = ref({});

const canCreateSession = computed(() => {
  return newFeature.value.trim() && sessionName.value.trim();
});

const hasVotes = computed(() => {
  if (!currentSession.value) return false;
  return Object.keys(votes.value[currentSession.value.id] || {}).length > 0;
});

const createSession = () => {
  if (canCreateSession.value) {
    currentSession.value = pokerStore.createSession(
      newFeature.value.trim(),
      sessionName.value.trim()
    );
    pokerStore.addPlayerToSession(
      currentSession.value.id,
      userStore.getCurrentUser
    );
    newFeature.value = '';
    sessionName.value = '';
  }
};

const vote = (value) => {
  if (currentSession.value) {
    pokerStore.vote(
      currentSession.value.id,
      userStore.getCurrentUser,
      value
    );
    votes.value = { ...pokerStore.votes };
  }
};

const revealVotes = () => {
  if (currentSession.value) {
    pokerStore.revealVotes(currentSession.value.id);
    currentSession.value = { ...currentSession.value, revealed: true };
  }
};

const startNewVoting = () => {
  if (currentSession.value) {
    const newSession = pokerStore.createSession(
      currentSession.value.feature,
      `${currentSession.value.name} (New Round)`
    );
    pokerStore.addPlayerToSession(newSession.id, userStore.getCurrentUser);
    currentSession.value = newSession;
  }
};

const leaveSession = () => {
  if (currentSession.value) {
    pokerStore.leaveSession();
    currentSession.value = null;
  }
};
</script>