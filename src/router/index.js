import Cadastro from '@/pages/cadastro/cadastro.vue'
import Home from '@/pages/home/home.vue'
import Login from '@/pages/login/login.vue'
import Perfil from '@/pages/perfil/perfil.vue'
import Carrinho from '@/pages/carrinho/carrinho.vue'
import { createRouter, createWebHistory } from 'vue-router'
import path from 'path'
import AdminPanel from '@/pages/adminPanel/adminPanel.vue'

const routes = [
  {path: "/login", name: 'Login', component: Login},
  {path: "/", name: 'Home', component: Home},
  {path: "/cadastro", name: 'Cadastro', component: Cadastro},
  {path: "/admin", name: 'Admin', component: AdminPanel},
  {path: "/perfil", name: 'Perfil', component: Perfil},
  {path: "/carrinho", name: 'Carrinho', component: Carrinho}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router