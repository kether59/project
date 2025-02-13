<template>
  <div v-if="!userStore.isLoggedIn" class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
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
          :disabled="userStore.isLoading"  
          class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <span v-if="userStore.isLoading" class="animate-spin mr-2">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span v-else>Start</span>
        </button>
      </div>
      <div v-if="userStore.hasError" class="text-red-500 mt-2">{{ userStore.getError }}</div>
    </div>
  </div>
  <div v-else class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-end mb-4">
        <button
          @click="logout"
          :disabled="userStore.isLoading" 
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
        <span v-if="userStore.isLoading" class="animate-spin mr-2">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span v-else>Logout</span>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="md:col-span-3">
          <router-view></router-view>
        </div>
        <div class="md:col-span-1">
          <ConnectedUsers />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from './stores/user';
import { useWheelStore } from './stores/wheel';
import { usePokerStore } from './stores/poker';
import { useRouter } from 'vue-router';
import ConnectedUsers from './components/ConnectedUsers.vue';

const userStore = useUserStore();
const wheelStore = useWheelStore();
const pokerStore = usePokerStore();
const router = useRouter();
const username = ref('');

const login = async () => { // Ajout de async
  if (username.value.trim()) {
    const defaultSession = 'default';
    try {
        await userStore.login(username.value.trim(), defaultSession); // Attendre la fin de l'action login
        pokerStore.setPlayer(username.value.trim());
        wheelStore.addTeammate(username.value.trim());
        router.push('/');
    } catch (error) {
        console.error("Erreur lors du login:", error);
        // Gestion des erreurs, par exemple afficher un message à l'utilisateur
    }
  }
};

const logout = async () => { // Ajout de async
  try {
      await userStore.logout(); // Attendre la fin de l'action logout
      wheelStore.removeTeammate(userStore.getCurrentUser);
      router.push('/');
  } catch (error) {
      console.error("Erreur lors du logout:", error);
  }
};
</script>