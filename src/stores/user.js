import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: Cookies.get('username') || null
  }),
  
  actions: {
    login(username) {
      this.username = username
      Cookies.set('username', username, { expires: 7 })
    },
    
    logout() {
      this.username = null
      Cookies.remove('username')
    },
    
    isLoggedIn() {
      return !!this.username
    }
  }
})