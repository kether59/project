import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useSessionStorage } from '@vueuse/core';

export function useUserSession() {
  const userSessions = useSessionStorage('user-sessions', []);

  const addUserSession = (sessionData) => {
    userSessions.value.push(sessionData);
  };

  const clearUserSessions = () => {
    userSessions.value = [];
  };

  return {
    userSessions,
    addUserSession,
    clearUserSessions,
  };
}

export const useUserStore = defineStore('user', {
  state: () => ({
    username: useStorage('username', null),
    sessionId: useStorage('sessionId', null),
    users: useStorage('users', []), // Store all connected users
  }),
  
  actions: {
    login(username, sessionId) {
      this.username = username;
      this.sessionId = sessionId;

      // Add user to the list of connected users
      let users = this.users || [];
      users.push({ username, sessionId });
      this.users = users;
    },
    
    logout() {
      if (!this.username || !this.sessionId) return;

      // Remove user from the list
      let users = this.users || [];
      users = users.filter(user => user.username !== this.username || user.sessionId !== this.sessionId);

      // Clear user data
      this.username = null;
      this.sessionId = null;
      this.users = users;
    },

    isLoggedIn() {
      return !!this.username;
    },

    loadSessionFromStorage() {
      const storedUsername = localStorage.getItem('username');
      const storedSessionId = localStorage.getItem('sessionId');
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
 con
      if (storedUsername && storedSessionId) {
      this.username = storedUsername;
      this.sessionId = storedSessionId;
      this.users = storedUsers;
      }
    },

    saveSessionToStorage() {
      localStorage.setItem('username', this.username);
      localStorage.setItem('sessionId', this.sessionId);
      localStorage.setItem('users', JSON.stringify(this.users));
    },

    clearSessionFromStorage() {
      localStorage.removeItem('username');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('users');
    },

    getAllUsers() {
      return JSON.parse(sessionStorage.getItem('users') || '[]');
    }
  }
})
