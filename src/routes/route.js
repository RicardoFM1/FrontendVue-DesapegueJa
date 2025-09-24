import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/home/home.vue'
import Cadastro from '../pages/cadastro/cadastro.vue'
import Login from '../pages/login/login.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
  { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router