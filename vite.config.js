import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    headers: {
      'Content-Type': 'application/wasm', // Ajout du header pour les fichiers .wasm
    },
  },
});