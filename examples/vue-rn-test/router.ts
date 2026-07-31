import { createRouter } from 'vue-router'
import { createRNHistory } from '@cat5th/vue-rn/router'
import Home from './src/pages/Home.vue'
import About from './src/pages/About.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
]

export const router = createRouter({
  history: createRNHistory(),
  routes,
})
