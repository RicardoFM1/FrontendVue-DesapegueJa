import Cadastro from '@/pages/cadastro/cadastro.vue'
import Home from '@/pages/home/home.vue'
import Login from '@/pages/login/login.vue'
import Criar from '@/pages/criar/criar.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: "/login", name: 'Login', component: Login},
  {path: "/", name: 'Home', component: Home},
  {path: "/cadastro", name: 'Cadastro', component: Cadastro},
  {path: "/criar", name: 'Criar', component: Criar}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
