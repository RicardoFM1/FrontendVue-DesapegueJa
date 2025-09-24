import Cadastro from '@/pages/cadastro/cadastro.vue'
import Home from '@/pages/home/home.vue'
import Login from '@/pages/login/login.vue'
import path from 'path'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: "/login", component: Login},
  {path: "/", component: Home},
  {path: "/cadastro", component: Cadastro}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
