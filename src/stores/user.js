import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import initSqlJs from 'sql.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: useStorage('user', null),
    activeSession: useStorage('session', null),
    sessions: {},
    loading: false,
    error: null,
    db: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    getCurrentUser: (state) => state.currentUser,
    getActiveSession: (state) => state.activeSession,
    getUsersInSession: (state) => (session) => state.sessions[session] || [],
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
  },

  actions: {
    async initializeDatabase() {
      return new Promise((resolve, reject) => {
        initSqlJs().then(SQL => {
          fetch('/ma_base_de_donnees.db')
            .then(response => response.arrayBuffer())
            .then(buffer => {
              this.db = new SQL.Database(new Uint8Array(buffer));
              console.log("Database initialized successfully");
              this.createTables();
              resolve();
            })
            .catch(error => {
              console.error("Error loading database file:", error);
              reject(error);
            });
        }).catch(error => {
          console.error("Error initializing sql.js:", error);
          reject(error);
        });
      });
    },

    createTables() {
      if (this.db) {
        const stmt = this.db.prepare(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            session TEXT NOT NULL
          )
        `);
        stmt.run();
        stmt.free();
      } else {
        console.error("Database is not initialized yet.");
      }
    },

    async login(username, session) {
      this.loading = true;
      this.error = null;

      try {
        const user = await this.findOrCreateUser(username, session);
        this.currentUser = user;
        this.activeSession = session;
        await this.fetchSessions();
      } catch (error) {
        console.error("Login error:", error);
        this.error = error.message || "Login failed";
      } finally {
        this.loading = false;
      }
    },

    async findOrCreateUser(username, session) {
      return new Promise((resolve, reject) => {
        if (!this.db) {
          return reject("Database not initialized");
        }

        const stmt = this.db.prepare(`SELECT * FROM users WHERE username = ? AND session = ?`);
        stmt.bind([username, session]);

        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          resolve(row);
        } else {
          stmt.free();
          const insertStmt = this.db.prepare(`INSERT INTO users (username, session) VALUES (?, ?)`);
          insertStmt.bind([username, session]);
          insertStmt.run();
          const lastID = this.db.exec("SELECT last_insert_rowid()")[0].values[0][0];
          insertStmt.free();
          resolve({ id: lastID, username, session });
        }
      });
    },

    async logout() {
      this.loading = true;
      this.error = null;

      try {
        this.currentUser = null;
        this.activeSession = null;
        this.sessions = {};
      } catch (error) {
        console.error("Logout error:", error);
        this.error = error.message || "Logout failed";
      } finally {
        this.loading = false;
      }
    },

    async fetchSessions() {
      return new Promise((resolve, reject) => {
        if (!this.db) {
          return reject("Database not initialized");
        }
        this.db.all(`SELECT DISTINCT session FROM users`, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            this.sessions = {};
            rows.forEach(row => {
              this.sessions[row.session] = [];
            });
            this.fetchUsersInSessions().then(resolve).catch(reject);
          }
        });
      });
    },

    async fetchUsersInSessions() {
      return new Promise((resolve, reject) => {
        if (!this.db) {
          return reject("Database not initialized");
        }
        const promises = Object.keys(this.sessions).map(session => {
          return new Promise((resolveSession, rejectSession) => {
            this.db.all(`SELECT username FROM users WHERE session = ?`, [session], (err, rows) => {
              if (err) {
                rejectSession(err);
              } else {
                this.sessions[session] = rows.map(row => row.username);
                resolveSession();
              }
            });
          });
        });
        Promise.all(promises).then(resolve).catch(reject);
      });
    },

    async addSession(session) {
      this.loading = true;
      this.error = null;
      try {
        if (!this.sessions[session]) {
          this.sessions[session] = [];
        }
        await this.fetchSessions();
      } catch (error) {
        console.error("Error adding session:", error);
        this.error = error.message || "Failed to add session";
      } finally {
        this.loading = false;
      }
    },

    async removeSession(session) {
      this.loading = true;
      this.error = null;
      try {
        delete this.sessions[session];
        if (this.activeSession === session) {
          this.activeSession = null;
        }
        await this.fetchSessions();
      } catch (error) {
        console.error("Error removing session:", error);
        this.error = error.message || "Failed to remove session";
      } finally {
        this.loading = false;
      }
    },

    async removeUserFromSession(session, username) {
      this.loading = true;
      this.error = null;
      try {
        if (this.sessions[session]) {
          this.sessions[session] = this.sessions[session].filter(user => user !== username);
        }
        if (this.sessions[session] && this.sessions[session].length === 0) {
          delete this.sessions[session];
        }
        await this.fetchSessions();
      } catch (error) {
        console.error("Error removing user from session:", error);
        this.error = error.message || "Failed to remove user from session";
      } finally {
        this.loading = false;
      }
    },

    async clearUserSessions() {
      this.loading = true;
      this.error = null;
      try {
        this.sessions = {};
        this.activeSession = null;
        await this.fetchSessions();
      } catch (error) {
        console.error("Error clearing user sessions:", error);
        this.error = error.message || "Failed to clear user sessions";
      } finally {
        this.loading = false;
      }
    },
  },
});