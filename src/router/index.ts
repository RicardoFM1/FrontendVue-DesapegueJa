import Cadastro from '@/pages/cadastro/cadastro.vue'
import Home from '@/pages/home/home.vue'
import Login from '@/pages/login/login.vue'
import Perfil from '@/pages/perfil/perfil.vue'
import Carrinho from '@/pages/carrinho/carrinho.vue'
import Anunciar from '@/pages/anunciar/anunciar.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Detalhes from '@/pages/produtoDetalhes/detalhes.vue'
import Pagamento from '@/pages/pagamento/pagamento.vue'


const routes = [
  {path: "/login", name: 'Login', component: Login},
  {path: "/", name: 'Home', component: Home},
  {path: "/cadastro", name: 'Cadastro', component: Cadastro},
  {path: "/perfil", name: 'Perfil', component: Perfil},
  {path: "/carrinho", name: 'Carrinho', component: Carrinho},
  {path: "/produto/:id", name: 'Detalhes', component: Detalhes},
  {path: "/anunciar", name: 'Anunciar', component: Anunciar},
  {path: "/pagamento/:uuid", name: 'Pagamento', component: Pagamento}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
