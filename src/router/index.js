import { createRouter, createWebHistory } from 'vue-router'
import PlanningPoker from '../views/PlanningPoker.vue'
import TeamWheel from '../views/TeamWheel.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/planning-poker',
    name: 'PlanningPoker',
    component: PlanningPoker
  },
  {
    path: '/team-wheel',
    name: 'TeamWheel',
    component: TeamWheel
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router