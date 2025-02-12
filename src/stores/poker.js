import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'

export const usePokerStore = defineStore('poker', {
  state: () => ({
    sessions: [],
    currentSession: null,
    playerId: Cookies.get('playerId') || null,
    playerName: Cookies.get('playerName') || null,
    votes: {},
    history: []
  }),
  
  actions: {
    createSession(feature, name) {
      const sessionId = uuidv4()
      const session = {
        id: sessionId,
        feature,
        name,
        createdAt: new Date(),
        votes: {},
        revealed: false
      }
      this.sessions.push(session)
      this.currentSession = session
      Cookies.set('currentSessionId', sessionId, { expires: 7 })
      return session
    },
    
    setPlayer(name) {
      this.playerId = this.playerId || uuidv4()
      this.playerName = name
      Cookies.set('playerId', this.playerId, { expires: 7 })
      Cookies.set('playerName', name, { expires: 7 })
    },

    loadSession() {
      const sessionId = Cookies.get('currentSessionId')
      if (sessionId) {
        const session = this.sessions.find(s => s.id === sessionId)
        if (session) {
          this.currentSession = session
          return session
        }
      }
      return null
    },
    
    vote(sessionId, value) {
      if (!this.votes[sessionId]) {
        this.votes[sessionId] = {}
      }
      this.votes[sessionId][this.playerId] = {
        value,
        playerName: this.playerName
      }
    },
    
    revealVotes(sessionId) {
      const session = this.sessions.find(s => s.id === sessionId)
      if (session) {
        session.revealed = true
        this.history.push({
          ...session,
          finalVotes: { ...this.votes[sessionId] }
        })
      }
    },

    leaveSession() {
      this.currentSession = null
      Cookies.remove('currentSessionId')
    }
  }
})