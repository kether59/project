import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/user';
import router from './router';
import './style.css';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // Pinia doit être utilisé avant le montage de l'application
app.use(router);

const userStore = useUserStore();

userStore.initializeDatabase()
  .then(() => {
    console.log("Application started");
    app.mount('#app'); // Le montage se fait *après* l'initialisation de la base
  })
  .catch(err => {
    console.error("Failed to initialize application:", err);
  });