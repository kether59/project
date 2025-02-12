<template>
  <!-- ...existing code... -->
  <div>
    <p>Current Sessions:</p>
    <ul>
      <li v-for="(session, index) in userSessions" :key="index">{{ session.name }}</li>
    </ul>
    <button @click="addUserSession({ name: 'John Doe' })">Add User Session</button>
    <button @click="clearUserSessions">Clear All Sessions</button>
  </div>
  <!-- ...existing code... -->
</template>

<script>
import { ref } from 'vue';
import { useUserSession } from './stores/user.js';

export default {
  setup() {
    const { userSessions, addUserSession, clearUserSessions } = useUserSession();

    return {
      userSessions,
      addUserSession,
      clearUserSessions,
    };
  },
};
</script>
