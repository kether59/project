<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <h3 class="text-sm font-medium text-gray-700 mb-2">Connected Users</h3>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="user in connectedUsers"
        :key="user"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="user === currentUser ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
      >
        {{ user }}
        <span v-if="user === currentUser" class="ml-1 text-green-600">•</span>
      </span>
    </div>
    <p v-if="connectedUsers.length === 0" class="text-sm text-gray-500">
      No users connected
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const currentUser = computed(() => userStore.getCurrentUser);
const connectedUsers = computed(() => {
  const session = userStore.getActiveSession;
  return userStore.getUsersInSession(session);
});
</script>