<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Painel Administrativo</h1>
      <div class="header-actions">
        <select v-model="aba" class="select-aba">
          <option value="usuarios">Usuários</option>
          <option value="categorias">Categorias</option>
          <option value="produtos">Produtos</option>
          <option value="pagamentos">Formas de Pagamento</option>
          <option value="enderecos">Endereços</option>
          <option value="status">Status Ordem</option>
          <option value="ordens">Ordens de Compra</option>
          <option value="carrinho">Carrinho</option>
        </select>
        <button @click="voltar" class="logout-btn">Voltar</button>
      </div>
    </header>

    <main class="admin-main">
      <!-- USUÁRIOS -->
      <section v-if="aba === 'usuarios'" class="panel">
        <h2>Usuários</h2>

        <div class="form-card">
          <input v-model="newUser.name" placeholder="Nome" />
          <input v-model="newUser.email" placeholder="Email" />
          <button @click="createUser">Criar</button>
        </div>

        <table class="admin-table" v-if="usuarios.length">
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Email</th><th>Criado em</th><th>Ações</th></tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.id }}</td>
              <td><input v-model="u.name" /></td>
              <td><input v-model="u.email" /></td>
              <td>{{ formatDate(u.created_at) }}</td>
              <td>
                <button @click="updateUser(u)">Salvar</button>
                <button @click="deleteUser(u.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum usuário encontrado.</p>
      </section>

      <!-- CATEGORIAS -->
      <section v-if="aba === 'categorias'" class="panel">
        <h2>Categorias</h2>

        <div class="form-card">
          <input v-model="newCategoria.nome" placeholder="Nome da categoria" />
          <button @click="createCategoria">Criar</button>
        </div>

        <table class="admin-table" v-if="categorias.length">
          <thead><tr><th>ID</th><th>Nome</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="c in categorias" :key="c.id">
              <td>{{ c.id }}</td>
              <td><input v-model="c.nome" /></td>
              <td>
                <button @click="updateCategoria(c)">Salvar</button>
                <button @click="deleteCategoria(c.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhuma categoria encontrada.</p>
      </section>

      <!-- PRODUTOS -->
      <section v-if="aba === 'produtos'" class="panel">
        <h2>Produtos</h2>

        <div class="form-card">
          <input v-model="newProduto.nome" placeholder="Nome" />
          <input v-model.number="newProduto.preco" placeholder="Preço" type="number" />
          <select v-model="newProduto.categoria_id">
            <option :value="null">-- Selecionar categoria --</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
          </select>
          <button @click="createProduto">Criar</button>
        </div>

        <table class="admin-table" v-if="produtos.length">
          <thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Categoria</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="p in produtos" :key="p.id">
              <td>{{ p.id }}</td>
              <td><input v-model="p.nome" /></td>
              <td><input v-model.number="p.preco" type="number" /></td>
              <td>
                <select v-model="p.categoria_id">
                  <option :value="null">--</option>
                  <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
              </td>
              <td>
                <button @click="updateProduto(p)">Salvar</button>
                <button @click="deleteProduto(p.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum produto encontrado.</p>
      </section>

      <!-- PAGAMENTOS -->
      <section v-if="aba === 'pagamentos'" class="panel">
        <h2>Formas de Pagamento</h2>

        <div class="form-card">
          <input v-model="newPagamento.nome" placeholder="Nome da forma" />
          <button @click="createPagamento">Criar</button>
        </div>

        <table class="admin-table" v-if="pagamentos.length">
          <thead><tr><th>ID</th><th>Nome</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="pg in pagamentos" :key="pg.id">
              <td>{{ pg.id }}</td>
              <td><input v-model="pg.nome" /></td>
              <td>
                <button @click="updatePagamento(pg)">Salvar</button>
                <button @click="deletePagamento(pg.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhuma forma de pagamento encontrada.</p>
      </section>

      <!-- ENDEREÇOS -->
      <section v-if="aba === 'enderecos'" class="panel">
        <h2>Endereços</h2>

        <div class="form-card">
          <input v-model="newEndereco.rua" placeholder="Rua" />
          <input v-model="newEndereco.numero" placeholder="Número" />
          <input v-model="newEndereco.cidade" placeholder="Cidade" />
          <button @click="createEndereco">Criar</button>
        </div>

        <table class="admin-table" v-if="enderecos.length">
          <thead><tr><th>ID</th><th>Rua</th><th>Número</th><th>Cidade</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="e in enderecos" :key="e.id">
              <td>{{ e.id }}</td>
              <td><input v-model="e.rua" /></td>
              <td><input v-model="e.numero" /></td>
              <td><input v-model="e.cidade" /></td>
              <td>
                <button @click="updateEndereco(e)">Salvar</button>
                <button @click="deleteEndereco(e.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum endereço encontrado.</p>
      </section>

      <!-- STATUS DE ORDEM -->
      <section v-if="aba === 'status'" class="panel">
        <h2>Status de Ordem</h2>

        <div class="form-card">
          <input v-model="newStatus.nome" placeholder="Nome do status" />
          <button @click="createStatus">Criar</button>
        </div>

        <table class="admin-table" v-if="statusList.length">
          <thead><tr><th>ID</th><th>Nome</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="s in statusList" :key="s.id">
              <td>{{ s.id }}</td>
              <td><input v-model="s.nome" /></td>
              <td>
                <button @click="updateStatus(s)">Salvar</button>
                <button @click="deleteStatus(s.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum status cadastrado.</p>
      </section>

      <!-- ORDENS DE COMPRA -->
      <section v-if="aba === 'ordens'" class="panel">
        <h2>Ordens de Compra</h2>

        <table class="admin-table" v-if="ordens.length">
          <thead><tr><th>ID</th><th>Usuário</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="o in ordens" :key="o.id">
              <td>{{ o.id }}</td>
              <td>{{ o.usuario?.name ?? o.usuario_id }}</td>
              <td>{{ o.total }}</td>
              <td>
                <select v-model="o.status_id" @change="changeOrderStatus(o)">
                  <option v-for="s in statusList" :key="s.id" :value="s.id">{{ s.nome }}</option>
                </select>
              </td>
              <td>
                <button @click="viewOrder(o)">Ver</button>
                <button @click="deleteOrder(o.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhuma ordem encontrada.</p>
      </section>

      <!-- CARRINHO -->
      <section v-if="aba === 'carrinho'" class="panel">
        <h2>Carrinhos</h2>

        <table class="admin-table" v-if="carrinhos.length">
          <thead><tr><th>ID</th><th>Usuário</th><th>Itens</th><th>Total</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="c in carrinhos" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.usuario?.name ?? c.usuario_id }}</td>
              <td>{{ c.itens?.length ?? 0 }}</td>
              <td>{{ c.total ?? 0 }}</td>
              <td>
                <button @click="viewCart(c)">Ver</button>
                <button @click="clearCart(c.id)">Limpar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum carrinho ativo.</p>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { connection } from '@/connection/axiosConnection';

const router = useRouter();
const aba = ref('usuarios');

// UTIL
const tokenHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '';

// USUÁRIOS
const usuarios = ref([]);
const newUser = ref({ name: '', email: '' });
async function loadUsers() { try { usuarios.value = (await connection.get('/desapega/usuarios', tokenHeader())).data || []; } catch(e){console.error(e);} }
async function createUser(){ try{ await connection.post('/desapega/usuarios', newUser.value, tokenHeader()); newUser.value = {name:'',email:''}; loadUsers(); }catch(e){console.error(e);} }
async function updateUser(u){ try{ await connection.put(`/desapega/usuarios/${u.id}`, u, tokenHeader()); loadUsers(); }catch(e){console.error(e);} }
async function deleteUser(id){ try{ await connection.delete(`/desapega/usuarios/${id}`, tokenHeader()); loadUsers(); }catch(e){console.error(e);} }

// CATEGORIAS
const categorias = ref([]);
const newCategoria = ref({ nome: '' });
async function loadCategorias(){ try{ categorias.value = (await connection.get('/desapega/categorias', tokenHeader())).data || []; }catch(e){console.error(e);} }
async function createCategoria(){ try{ await connection.post('/desapega/categorias', newCategoria.value, tokenHeader()); newCategoria.value = {nome:''}; loadCategorias(); }catch(e){console.error(e);} }
async function updateCategoria(c){ try{ await connection.put(`/desapega/categorias/${c.id}`, c, tokenHeader()); loadCategorias(); }catch(e){console.error(e);} }
async function deleteCategoria(id){ try{ await connection.delete(`/desapega/categorias/${id}`, tokenHeader()); loadCategorias(); }catch(e){console.error(e);} }

// PRODUTOS
const produtos = ref([]);
const newProduto = ref({ nome:'', preco:0, categoria_id:null });
async function loadProdutos(){ try{ produtos.value = (await connection.get('/desapega/produtos', tokenHeader())).data || []; }catch(e){console.error(e);} }
async function createProduto(){ try{ await connection.post('/desapega/produtos', newProduto.value, tokenHeader()); newProduto.value = {nome:'',preco:0,categoria_id:null}; loadProdutos(); }catch(e){console.error(e);} }
async function updateProduto(p){ try{ await connection.put(`/desapega/produtos/${p.id}`, p, tokenHeader()); loadProdutos(); }catch(e){console.error(e);} }
async function deleteProduto(id){ try{ await connection.delete(`/desapega/produtos/${id}`, tokenHeader()); loadProdutos(); }catch(e){console.error(e);} }

// PAGAMENTOS
const pagamentos = ref([]);
const newPagamento = ref({ nome: '' });
async function loadPagamentos(){ try{ pagamentos.value = (await connection.get('/desapega/pagamentos', tokenHeader())).data || []; }catch(e){console.error(e);} }
async function createPagamento(){ try{ await connection.post('/desapega/pagamentos', newPagamento.value, tokenHeader()); newPagamento.value = {nome:''}; loadPagamentos(); }catch(e){console.error(e);} }
async function updatePagamento(pg){ try{ await connection.put(`/desapega/pagamentos/${pg.id}`, pg, tokenHeader()); loadPagamentos(); }catch(e){console.error(e);} }
async function deletePagamento(id){ try{ await connection.delete(`/desapega/pagamentos/${id}`, tokenHeader()); loadPagamentos(); }catch(e){console.error(e);} }

// ENDEREÇOS
const enderecos = ref([]);
const newEndereco = ref({ rua:'', numero:'', cidade:'' });
async function loadEnderecos(){ try{ enderecos.value = (await connection.get('/desapega/enderecos', tokenHeader())).data || []; }catch(e){console.error(e);} }
async function createEndereco(){ try{ await connection.post('/desapega/enderecos', newEndereco.value, tokenHeader()); newEndereco.value = {rua:'',numero:'',cidade:''}; loadEnderecos(); }catch(e){console.error(e);} }
async function updateEndereco(e){ try{ await connection.put(`/desapega/enderecos/${e.id}`, e, tokenHeader()); loadEnderecos(); }catch(e){console.error(e);} }
async function deleteEndereco(id){ try{ await connection.delete(`/desapega/enderecos/${id}`, tokenHeader()); loadEnderecos(); }catch(e){console.error(e);} }

// STATUS DE ORDEM
const statusList = ref([]);
const newStatus = ref({ nome: '' });
async function loadStatus(){ try{ statusList.value = (await connection.get('/desapega/status', tokenHeader())).data || []; }catch(e){console.error(e);} }
async function createStatus(){ try{ await connection.post('/desapega/status', newStatus.value, tokenHeader()); newStatus.value = {nome:''}; loadStatus(); }catch(e){console.error(e);} }
async function updateStatus(s){ try{ await connection.put(`/desapega/status/${s.id}`, s, tokenHeader()); loadStatus(); }catch(e){console.error(e);} }
async function deleteStatus(id){ try{ await connection.delete(`/desapega/status/${id}`, tokenHeader()); loadStatus(); }catch(e){console.error(e);} }

// ORDENS DE COMPRA
const ordens = ref([]);
async function loadOrdens(){ try{ ordens.value = (await connection.get('/desapega/ordens', tokenHeader())).data || []; }catch(e){console.error(e);} }
async function changeOrderStatus(o){ try{ await connection.put(`/desapega/ordens/${o.id}`, { status_id: o.status_id }, tokenHeader()); loadOrdens(); }catch(e){console.error(e);} }
async function viewOrder(o){ try{ const res = await connection.get(`/desapega/ordens/${o.id}`, tokenHeader()); alert(JSON.stringify(res.data, null, 2)); }catch(e){console.error(e);} }
async function deleteOrder(id){ try{ await connection.delete(`/desapega/ordens/${id}`, tokenHeader()); loadOrdens(); }catch(e){console.error(e);} }

// CARRINHOS
const carrinhos = ref([]);
async function loadCarrinhos(){ try{ carrinhos.value = (await connection.get('/desapega/carrinhos', tokenHeader())).data || []; }catch(e){console.error(e);} }
async function viewCart(c){ try{ const res = await connection.get(`/desapega/carrinhos/${c.id}`, tokenHeader()); alert(JSON.stringify(res.data, null, 2)); }catch(e){console.error(e);} }
async function clearCart(id){ try{ await connection.delete(`/desapega/carrinhos/${id}`, tokenHeader()); loadCarrinhos(); }catch(e){console.error(e);} }

onMounted(()=>{
  // carrega tudo ao abrir o painel
  loadUsers(); loadCategorias(); loadProdutos(); loadPagamentos(); loadEnderecos(); loadStatus(); loadOrdens(); loadCarrinhos();
});

const voltar = () => router.push('/');
</script>

<style>
@import "../css/paginaAdminPanel/admin.css";
.admin-header{display:flex;justify-content:space-between;align-items:center}
.header-actions{display:flex;gap:10px;align-items:center}
.form-card{display:flex;gap:10px;margin:12px 0}
.admin-table{width:100%;border-collapse:collapse}
.admin-table th,.admin-table td{padding:8px;border:1px solid #ddd}
.panel{margin-top:16px}
.select-aba{padding:8px;border-radius:6px}
.logout-btn{background:#ef4444;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer}
</style>