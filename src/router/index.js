import Cadastro from '@/pages/cadastro/cadastro.vue'
import Home from '@/pages/home/home.vue'
import Login from '@/pages/login/login.vue'
import Perfil from '@/pages/perfil/perfil.vue'
import Carrinho from '@/pages/carrinho/carrinho.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Detalhes from '@/pages/produtoDetalhes/detalhes.vue'
import Pagamento from '@/pages/pagamento/pagamento.vue'
import CompletarCadastro from '@/pages/completarCadastro/completarCadastro.vue'
import AdminPanel from '@/pages/adminPanel/adminPanel.vue'
import Anunciar from '@/pages/anunciar/anunciar.vue'
import Perfilsocial from '@/pages/perfilsoical/perfilsocial.vue'



const routes = [
  {path: "/login", name: 'Login', component: Login},
  {path: "/", name: 'Home', component: Home},
  {path: "/cadastro", name: 'Cadastro', component: Cadastro},
  {path: "/admin", name: 'Admin', component: AdminPanel},
  {path: "/perfil", name: 'Perfil', component: Perfil},
  {path: "/carrinho", name: 'Carrinho', component: Carrinho},
  {path: "/produto/:id", name: 'Detalhes', component: Detalhes},
  {path: "/anunciar", name: 'Anunciar', component: Anunciar},
  {path: "/pagamento/:uuid", name: 'Pagamento', component: Pagamento},
  {path: "/completar-cadastro", name: 'CompletarCadastro', component: CompletarCadastro},
  {path: "/perfilsocial/:id", name: 'Social', component: Perfilsocial},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/desapega",
  timeout: 10000
});

// Intercepta requisição e adiciona token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default router

