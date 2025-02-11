import { defineStore } from 'pinia'

export const useWheelStore = defineStore('wheel', {
  state: () => ({
    teammates: [],
    selectedTeammate: null,
    isSpinning: false
  }),
  
  actions: {
    addTeammate(name) {
      if (!this.teammates.includes(name)) {
        this.teammates.push(name)
      }
    },
    
    removeTeammate(name) {
      this.teammates = this.teammates.filter(t => t !== name)
    },
    
    spinWheel() {
      this.isSpinning = true
      const randomIndex = Math.floor(Math.random() * this.teammates.length)
      return new Promise(resolve => {
        setTimeout(() => {
          this.selectedTeammate = this.teammates[randomIndex]
          this.isSpinning = false
          resolve(this.selectedTeammate)
        }, 3000)
      })
    }
  }
})