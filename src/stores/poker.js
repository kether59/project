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
        players: [],
        votes: {},
        revealed: false
      }
      this.sessions.push(session)
      this.currentSession = session
      Cookies.set('currentSessionId', sessionId, { expires: 7 })
      return session
    },
    
    setPlayer(name) {
      if (!this.playerId) {
        this.playerId = uuidv4()
      }
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
    
    addPlayerToSession(sessionId, playerName) {
      const session = this.sessions.find(s => s.id === sessionId)
      if (session) {
        const playerExists = session.players.some(player => player.name === playerName)
        if (!playerExists) {
          session.players.push({ id: uuidv4(), name: playerName })
        }
      }
    },

    removePlayerFromSession(sessionId, playerName) {
      const session = this.sessions.find(s => s.id === sessionId)
      if (session) {
        session.players = session.players.filter(player => player.name !== playerName)
      }
    },

    vote(sessionId, playerName, value) {
      if (!this.votes[sessionId]) {
        this.votes[sessionId] = {}
      }
      this.votes[sessionId][playerName] = {
        value,
        playerName
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
      if (this.currentSession) {
        this.removePlayerFromSession(this.currentSession.id, this.playerName)
        this.currentSession = null
        Cookies.remove('currentSessionId')
      }
    }
  }
})