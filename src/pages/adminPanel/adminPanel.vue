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

      <!-- =================== USUÁRIOS =================== -->
      <section v-if="aba === 'usuarios'" class="panel">
        <h2>Usuários</h2>

        <div class="form-card">
          <input v-model="newUser.name" placeholder="Nome" />
          <input v-model="newUser.email" placeholder="Email" />
          <button @click="createUser" class="primary">Criar</button>
        </div>

        <table class="admin-table" v-if="usuarios.length">
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Email</th><th>Criado em</th><th>Ações</th></tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ formatDate(u.created_at) }}</td>
              <td>
                <button @click="openEditUser(u)" class="edit-btn">Editar</button>
                <button @click="deleteUser(u.id)" class="delete-btn">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum usuário encontrado.</p>
      </section>

      <!-- =================== CATEGORIAS =================== -->
      <section v-if="aba === 'categorias'" class="panel">
        <h2>Categorias</h2>

        <div class="form-card">
          <input v-model="newCategoria.nome" placeholder="Nome da categoria" />
          <button @click="createCategoria" class="primary">Criar</button>
        </div>

        <table class="admin-table" v-if="categorias.length">
          <thead><tr><th>ID</th><th>Nome</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="c in categorias" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.nome }}</td>
              <td>
                <button @click="openEditCategoria(c)" class="edit-btn">Editar</button>
                <button @click="deleteCategoria(c.id)" class="delete-btn">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhuma categoria encontrada.</p>
      </section>

      <!-- =================== PRODUTOS =================== -->
      <section v-if="aba === 'produtos'" class="panel">
        <h2>Produtos</h2>

        <div class="form-card">
          <input v-model="newProduto.nome" placeholder="Nome" />
          <input v-model.number="newProduto.preco" placeholder="Preço" type="number" />
          <select v-model="newProduto.categoria_id">
            <option :value="null">-- Selecionar categoria --</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
          </select>
          <button @click="createProduto" class="primary">Criar</button>
        </div>

        <table class="admin-table" v-if="produtos.length">
          <thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Categoria</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="p in produtos" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nome }}</td>
              <td>R$ {{ p.preco }}</td>
              <td>{{ categorias.find(c => c.id === p.categoria_id)?.nome ?? '---' }}</td>
              <td>
                <button @click="openEditProduto(p)" class="edit-btn">Editar</button>
                <button @click="deleteProduto(p.id)" class="delete-btn">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum produto encontrado.</p>
      </section>

      <!-- =================== ENDEREÇOS =================== -->
      <section v-if="aba === 'enderecos'" class="panel">
        <h2>Endereços</h2>

        <div class="form-card">
          <input v-model="newEndereco.rua" placeholder="Rua" />
          <input v-model="newEndereco.numero" placeholder="Número" />
          <input v-model="newEndereco.cidade" placeholder="Cidade" />
          <button @click="createEndereco" class="primary">Criar</button>
        </div>

        <table class="admin-table" v-if="enderecos.length">
          <thead><tr><th>ID</th><th>Rua</th><th>Número</th><th>Cidade</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="e in enderecos" :key="e.id">
              <td>{{ e.id }}</td>
              <td>{{ e.rua }}</td>
              <td>{{ e.numero }}</td>
              <td>{{ e.cidade }}</td>
              <td>
                <button @click="openEditEndereco(e)" class="edit-btn">Editar</button>
                <button @click="deleteEndereco(e.id)" class="delete-btn">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum endereço encontrado.</p>
      </section>

    </main>

    <!-- =================== MODAIS =================== -->

    <!-- EDITAR USUÁRIO -->
    <div v-if="modalUser" class="modal">
      <div class="modal-content">
        <h3>Editar Usuário</h3>
        <input v-model="editUser.name" placeholder="Nome" />
        <input v-model="editUser.email" placeholder="Email" />
        <button @click="saveEditUser" class="primary">Salvar</button>
        <button class="close" @click="modalUser=false">Fechar</button>
      </div>
    </div>

    <!-- EDITAR CATEGORIA -->
    <div v-if="modalCategoria" class="modal">
      <div class="modal-content">
        <h3>Editar Categoria</h3>
        <input v-model="editCategoria.nome" placeholder="Nome" />
        <button @click="saveEditCategoria" class="primary">Salvar</button>
        <button class="close" @click="modalCategoria=false">Fechar</button>
      </div>
    </div>

    <!-- EDITAR PRODUTO -->
    <div v-if="modalProduto" class="modal">
      <div class="modal-content">
        <h3>Editar Produto</h3>
        <input v-model="editProduto.nome" placeholder="Nome" />
        <input v-model.number="editProduto.preco" placeholder="Preço" type="number" />
        <select v-model="editProduto.categoria_id">
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
        <button @click="saveEditProduto" class="primary">Salvar</button>
        <button class="close" @click="modalProduto=false">Fechar</button>
      </div>
    </div>

    <!-- EDITAR ENDEREÇO -->
    <div v-if="modalEndereco" class="modal">
      <div class="modal-content">
        <h3>Editar Endereço</h3>
        <input v-model="editEndereco.rua" placeholder="Rua" />
        <input v-model="editEndereco.numero" placeholder="Número" />
        <input v-model="editEndereco.cidade" placeholder="Cidade" />
        <button @click="saveEditEndereco" class="primary">Salvar</button>
        <button class="close" @click="modalEndereco=false">Fechar</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { connection } from '@/connection/axiosConnection';

const router = useRouter();
const aba = ref('usuarios');

// ==================== UTIL ====================
const tokenHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const formatDate = d => d ? new Date(d).toLocaleDateString('pt-BR') : '';

// ==================== USUÁRIOS ====================
const usuarios = ref([]);
const newUser = ref({ name: '', email: '' });

async function loadUsers() { usuarios.value = (await connection.get('/desapega/usuarios', tokenHeader())).data || []; }
async function createUser() { await connection.post('/desapega/usuarios', newUser.value, tokenHeader()); newUser.value = {name:'',email:''}; loadUsers(); }
async function deleteUser(id) { await connection.delete(`/desapega/usuarios/${id}`, tokenHeader()); loadUsers(); }
function openEditUser(u){ editUser.value = {...u}; modalUser.value = true; }
async function saveEditUser(){ await connection.put(`/desapega/usuarios/${editUser.value.id}`, editUser.value, tokenHeader()); modalUser.value=false; loadUsers(); }

// ==================== CATEGORIAS ====================
const categorias = ref([]);
const newCategoria = ref({ nome: '' });

async function loadCategorias(){ categorias.value = (await connection.get('/desapega/categorias', tokenHeader())).data || []; }
async function createCategoria(){ await connection.post('/desapega/categorias', newCategoria.value, tokenHeader()); newCategoria.value={nome:''}; loadCategorias(); }
function openEditCategoria(c){ editCategoria.value={...c}; modalCategoria.value=true; }
async function saveEditCategoria(){ await connection.put(`/desapega/categorias/${editCategoria.value.id}`, editCategoria.value, tokenHeader()); modalCategoria.value=false; loadCategorias(); }
async function deleteCategoria(id){ await connection.delete(`/desapega/categorias/${id}`, tokenHeader()); loadCategorias(); }

// ==================== PRODUTOS ====================
const produtos = ref([]);
const newProduto = ref({ nome:'', preco:0, categoria_id:null });

async function loadProdutos(){ produtos.value = (await connection.get('/desapega/produtos', tokenHeader())).data || []; }
async function createProduto(){ await connection.post('/desapega/produtos', newProduto.value, tokenHeader()); newProduto.value={nome:'',preco:0,categoria_id:null}; loadProdutos(); }
function openEditProduto(p){ editProduto.value={...p}; modalProduto.value=true; }
async function saveEditProduto(){ await connection.put(`/desapega/produtos/${editProduto.value.id}`, editProduto.value, tokenHeader()); modalProduto.value=false; loadProdutos(); }
async function deleteProduto(id){ await connection.delete(`/desapega/produtos/${id}`, tokenHeader()); loadProdutos(); }

// ==================== ENDEREÇOS ====================
const enderecos = ref([]);
const newEndereco = ref({ rua:'', numero:'', cidade:'' });

async function loadEnderecos(){ enderecos.value = (await connection.get('/desapega/enderecos', tokenHeader())).data || []; }
async function createEndereco(){ await connection.post('/desapega/enderecos', newEndereco.value, tokenHeader()); newEndereco.value={rua:'',numero:'',cidade:''}; loadEnderecos(); }
function openEditEndereco(e){ editEndereco.value={...e}; modalEndereco.value=true; }
async function saveEditEndereco(){ await connection.put(`/desapega/enderecos/${editEndereco.value.id}`, editEndereco.value, tokenHeader()); modalEndereco.value=false; loadEnderecos(); }
async function deleteEndereco(id){ await connection.delete(`/desapega/enderecos/${id}`, tokenHeader()); loadEnderecos(); }

// ==================== MODAIS ====================
const modalUser = ref(false);
const editUser = ref({});

const modalCategoria = ref(false);
const editCategoria = ref({});

const modalProduto = ref(false);
const editProduto = ref({});

const modalEndereco = ref(false);
const editEndereco = ref({});

// ==================== ON MOUNT ====================
onMounted(() => {
  loadUsers();
  loadCategorias();
  loadProdutos();
  loadEnderecos();
});

// BOTÃO VOLTAR
const voltar = () => router.push('/');
</script>

<style>
/* ======================= */
/*      LAYOUT BASE        */
/* ======================= */

.admin-container {
  width: 100%;
  min-height: 100vh;
  background: #f4f5f7;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

.admin-header {
  background: #ffffff;
  padding: 18px 22px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  margin-bottom: 20px;
}

.admin-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ======================= */
/*       SELECT E INPUTS   */
/* ======================= */

.select-aba,
.form-card input,
.form-card select,
.modal-content input,
.modal-content select {
  padding: 10px 12px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s;
}

.select-aba:focus,
.form-card input:focus,
.modal-content input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.25);
}

/* ======================= */
/*        BOTÕES           */
/* ======================= */

button {
  border: none;
  cursor: pointer;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  transition: 0.2s ease;
}

button:hover {
  opacity: 0.85;
}

.logout-btn {
  background: #ef4444;
  color: #fff;
}

button.primary {
  background: #4f46e5;
  color: white;
}

button.edit-btn {
  background: #3b82f6;
  color: white;
}

button.delete-btn {
  background: #ef4444;
  color: white;
}

/* ======================= */
/*         FORM CARDS      */
/* ======================= */

.form-card {
  background: #ffffff;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 15px;
}

/* ======================= */
/*          TABLES         */
/* ======================= */

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.admin-table thead {
  background: #f9fafb;
}

.admin-table th {
  padding: 12px;
  font-weight: 600;
  color: #374151;
  text-align: left;
}

.admin-table td {
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  color: #4b5563;
}

.admin-table tbody tr:hover {
  background: #f3f4f6;
}

/* ======================= */
/*          PANELS         */
/* ======================= */

.panel h2 {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

/* ======================= */
/*          MODAL          */
/* ======================= */

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 350px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.close {
  background: #6b7280;
  color: white;
}
</style>
