<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Painel Administrativo</h1>
    </header>

    <nav class="tabs">
      <button :class="{ active: activeTab === 'usuarios' }" @click="changeTab('usuarios')">Usuários</button>
      <button :class="{ active: activeTab === 'categorias' }" @click="changeTab('categorias')">Categorias</button>
      <button :class="{ active: activeTab === 'produtos' }" @click="changeTab('produtos')">Produtos</button>
      <button :class="{ active: activeTab === 'enderecos' }" @click="changeTab('enderecos')">Endereços</button>
    </nav>

    <main class="admin-main">

      <section v-if="activeTab === 'usuarios'">
        <div class="section-header">
          <h2>Usuários</h2>
          <button class="add-btn" @click="openModal('usuario')">+ Usuário</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Admin</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.nome }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.cpf }}</td>
              <td>{{ u.isAdmin ? 'Sim' : 'Não' }}</td>
              <td class="td-actions">
                <button @click="openModal('usuario', u)" class="edit">Editar</button>
                <button @click="deleteData(u.id, 'usuario')" class="delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="activeTab === 'categorias'">
        <div class="section-header">
          <h2>Categorias</h2>
          <button class="add-btn" @click="openModal('categoria')">+ Categoria</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in categorias" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.nome }}</td>
              <td class="td-actions">
                <button @click="openModal('categoria', c)" class="edit">Editar</button>
                <button @click="deleteData(c.id, 'categoria')" class="delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="activeTab === 'produtos'">
        <div class="section-header">
          <h2>Produtos</h2>
          <button class="add-btn" @click="openModal('produto')">+ Produto</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in produtos" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nome }}</td>
              <td>R$ {{ p.preco }}</td>
              <td>{{ p.categoriaId }}</td>
              <td class="td-actions">
                <button @click="openModal('produto', p)" class="edit">Editar</button>
                <button @click="deleteData(p.id, 'produto')" class="delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="activeTab === 'enderecos'">
        <div class="section-header">
          <h2>Endereços</h2>
          <button class="add-btn" @click="openModal('endereco')">+ Endereço</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>CEP</th>
              <th>Rua</th>
              <th>Número</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in enderecos" :key="e.id">
              <td>{{ e.id }}</td>
              <td>{{ e.cep }}</td>
              <td>{{ e.rua }}</td>
              <td>{{ e.numero }}</td>
              <td>{{ e.cidade }}</td>
              <td class="td-actions">
                <button @click="openModal('endereco', e)" class="edit">Editar</button>
                <button @click="deleteData(e.id, 'endereco')" class="delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

    </main>

    <div class="modal" v-if="modalOpen">
      <div class="modal-content">

        <h3 v-if="modalType === 'usuario'">
          {{ modalData.id ? "Editar Usuário" : "Adicionar Usuário" }}
        </h3>

        <h3 v-if="modalType === 'categoria'">
          {{ modalData.id ? "Editar Categoria" : "Adicionar Categoria" }}
        </h3>

        <h3 v-if="modalType === 'produto'">
          {{ modalData.id ? "Editar Produto" : "Adicionar Produto" }}
        </h3>

        <h3 v-if="modalType === 'endereco'">
          {{ modalData.id ? "Editar Endereço" : "Adicionar Endereço" }}
        </h3>

        <div v-if="modalType === 'usuario'">
          <input v-model="modalData.nome" placeholder="Nome" />
          <input v-model="modalData.email" placeholder="Email" />
          <input v-model="modalData.cpf" placeholder="CPF" maxlength="14" />
          <input v-model="modalData.senha" placeholder="Senha" type="password" :required="!modalData.id" />
          
          <div class="checkbox-container">
            <input type="checkbox" id="isAdmin" v-model="modalData.isAdmin" />
            <label for="isAdmin">É Administrador</label>
          </div>
        </div>

        <div v-if="modalType === 'categoria'">
          <input v-model="modalData.nome" placeholder="Nome da Categoria" />
        </div>

        <div v-if="modalType === 'produto'">
          <input v-model="modalData.nome" placeholder="Nome" />
          <input v-model="modalData.preco" placeholder="Preço" type="number" />
          <input v-model="modalData.categoriaId" placeholder="Categoria ID" />
        </div>

        <div v-if="modalType === 'endereco'">
          <input v-model="modalData.cep" placeholder="CEP (ex: 88888-888)" @blur="fetchCep" maxlength="9" />
          <input v-model="modalData.rua" placeholder="Rua" :disabled="cepLoading" />
          <input v-model="modalData.numero" placeholder="Número" />
          <input v-model="modalData.bairro" placeholder="Bairro" :disabled="cepLoading" />
          <input v-model="modalData.cidade" placeholder="Cidade" :disabled="cepLoading" />
          <input v-model="modalData.estado" placeholder="Estado (UF)" maxlength="2" :disabled="cepLoading" />
        </div>

        <div class="modal-actions">
          <button class="save" @click="saveData">Salvar</button>
          <button class="cancel" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// NOTE: Você precisa garantir que 'connection' (seu axios customizado) e 'axios' (para ViaCEP) estejam disponíveis.
import { connection } from "@/connection/axiosConnection.js";
import axios from 'axios'; 

export default {
  data() {
    return {
      activeTab: "usuarios",

      usuarios: [],
      categorias: [],
      produtos: [],
      enderecos: [],

      modalOpen: false,
      modalType: "",
      modalData: {},
      cepLoading: false 
    };
  },

  methods: {
    // ========================= LÓGICA DE CEP (ViaCEP) =========================
    async fetchCep() {
      const cep = this.modalData.cep.replace(/\D/g, ''); 

      if (cep.length !== 8) return;

      this.cepLoading = true;

      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        if (!data.erro) {
          this.modalData.rua = data.logradouro;
          this.modalData.cidade = data.localidade;
          this.modalData.estado = data.uf;
          this.modalData.bairro = data.bairro;
        } else {
          alert('CEP não encontrado.');
          this.modalData.rua = '';
          this.modalData.cidade = '';
          this.modalData.estado = '';
          this.modalData.bairro = '';
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        this.cepLoading = false;
      }
    },


    // ========================= MODAL =========================

    openModal(type, item = {}) {
      this.modalType = type;
      this.cepLoading = false; 

      if (type === "usuario") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || "",
          email: item.email || "",
          cpf: item.cpf || "", // Adicionado CPF
          senha: "", 
          isAdmin: item.isAdmin || false 
        };
      }

      if (type === "categoria") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || ""
        };
      }

      if (type === "produto") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || "",
          preco: item.preco || "",
          categoriaId: item.categoriaId || ""
        };
      }

      if (type === "endereco") {
        this.modalData = {
          id: item.id || null,
          cep: item.cep || "", 
          rua: item.rua || "",
          numero: item.numero || "",
          cidade: item.cidade || "",
          bairro: item.bairro || "", 
          estado: item.estado || "" 
        };
      }

      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.modalData = {};
    },

    // ========================= LISTAGENS =========================

    async loadUsuarios() {
      try {
        const res = await connection.get("/usuarios?status=1");
        this.usuarios = res.data;
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    },

    async loadCategorias() {
      try {
        const res = await connection.get("/categorias?status=1");
        this.categorias = res.data;
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    },

    async loadProdutos() {
      try {
        const res = await connection.get("/produtos?page=1&pageSize=200");
        this.produtos = res.data.produtos || res.data; 
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    },

    async loadEnderecos() {
      try {
        const res = await connection.get("/enderecos?status=1");
        this.enderecos = res.data;
      } catch (error) {
        console.error("Erro ao carregar endereços:", error);
      }
    },

    // ========================= SALVAR (ADICIONAR/EDITAR) =========================
    async saveData() {
      const item = this.modalData;
      const type = this.modalType;

      let endpoint = "";
      if (type === "usuario") endpoint = "/usuarios";
      else if (type === "categoria") endpoint = "/categorias";
      else if (type === "produto") endpoint = "/produtos";
      else if (type === "endereco") endpoint = "/enderecos";

      try {
        if (item.id) {
          await connection.patch(`${endpoint}/${item.id}`, item);
        } else {
          await connection.post(endpoint, item);
        }

        this.closeModal();
        this.reloadTab(); 
      } catch (error) {
        console.error(`Erro ao salvar ${type}:`, error);
        alert(`Falha ao salvar. Verifique o console para detalhes.`);
      }
    },
    
    // ========================= EXCLUIR =========================
    async deleteData(id, type) {
      if (!confirm(`Tem certeza que deseja excluir este(a) ${type} (ID: ${id})?`)) {
        return;
      }

      let endpoint = "";
      if (type === "usuario") endpoint = "/usuarios";
      else if (type === "categoria") endpoint = "/categorias";
      else if (type === "produto") endpoint = "/produtos";
      else if (type === "endereco") endpoint = "/enderecos";

      try {
        await connection.delete(`${endpoint}/${id}`);
        alert(`${type} excluído(a) com sucesso.`);
        this.reloadTab(); 
      } catch (error) {
        console.error(`Erro ao excluir ${type}:`, error);
        alert(`Falha ao excluir. Verifique o console para detalhes.`);
      }
    },

    reloadTab() {
      if (this.activeTab === "usuarios") this.loadUsuarios();
      else if (this.activeTab === "categorias") this.loadCategorias();
      else if (this.activeTab === "produtos") this.loadProdutos();
      else if (this.activeTab === "enderecos") this.loadEnderecos();
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.reloadTab();
    }
  },

  mounted() {
    this.loadUsuarios();
  }
};
</script>

<style>
/* ====== Layout base (Retornado ao estilo moderno) ====== */
.admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 22px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827;
    background: #f7f8fb;
    min-height: 100vh;
    box-sizing: border-box; 
}

/* Header */
.admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
}
.admin-header h1 {
    margin: 0;
    font-size: 24px; 
    font-weight: 700;
    color: #0f172a;
}

/* Tabs */
.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 24px; 
}
.tabs button {
    background: transparent;
    border: 1px solid transparent;
    padding: 10px 16px; 
    border-radius: 12px; 
    cursor: pointer;
    font-weight: 600;
    transition: all .2s ease;
    color: #374151;
}
.tabs button:hover {
    transform: translateY(-1px); 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.tabs .active {
    background: linear-gradient(90deg, #334155, #1e293b);
    color: #fff;
    box-shadow: 0 8px 20px rgba(30, 41, 59, 0.2); 
    border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Main grid */
.admin-main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px; 
}

/* Section header */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
}
.section-header h2 {
    margin: 0;
    font-size: 20px;
    color: #0b1220;
}

/* Buttons Base */
.add-btn, .edit, .delete, .save, .cancel {
    display: inline-flex;
    align-items: center;
    justify-content: center; 
    gap: 8px;
    border: 0;
    cursor: pointer;
    border-radius: 10px;
    padding: 8px 14px;
    font-weight: 600;
    transition: all .2s ease;
}

/* Specific buttons */
.add-btn {
    background: linear-gradient(90deg, #06b6d4, #3b82f6);
    color: #fff;
    box-shadow: 0 6px 14px rgba(59, 130, 246, 0.18);
}
.add-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}
.edit {
    background: linear-gradient(90deg, #f59e0b, #f97316); 
    color: #fff;
    padding: 6px 10px;
    border-radius: 8px;
}
.delete { 
    background: #ef4444; 
    color: #fff;
    padding: 6px 10px;
    border-radius: 8px;
}
.save {
    background: #10b981; 
    color: #fff;
}
.cancel {
    background: #6b7280; 
    color: #fff;
}
.edit:hover, .delete:hover, .save:hover, .cancel:hover {
    opacity: 0.9;
}

/* Table styling */
table {
    width: 100%;
    border-radius: 12px;
    background: #fff;
    border: 1px solid #e6edf3;
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.04);
    border-collapse: separate; 
    border-spacing: 0;
}
thead {
    background: linear-gradient(180deg, #f8fafc, #f1f5f9);
}
th, td {
    padding: 14px 16px; 
    text-align: left;
    color: #374151;
    font-size: 14px;
    border-bottom: 1px solid #f1f5f9;
}
tbody tr:last-child td {
    border-bottom: none;
}
tbody tr:hover {
    background: #fbfdff;
}

/* Modal */
.modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, rgba(2, 6, 23, 0.35), rgba(2, 6, 23, 0.45));
    z-index: 1200;
    padding: 10px;
}
.modal-content {
    width: 880px;
    max-width: 100%; 
    background: #fff;
    border-radius: 14px;
    padding: 24px; 
    box-shadow: 0 20px 60px rgba(2, 6, 23, 0.4); 
    display: flex;
    gap: 20px;
    flex-direction: column;
}

/* Input styles */
input:not([type="checkbox"]):not([type="radio"]), select, textarea {
    width: 100%;
    padding: 12px 14px; 
    border-radius: 10px;
    border: 1px solid #e6edf3;
    background: #fff;
    outline: none;
    font-size: 14px;
    color: #0b1220;
    box-sizing: border-box;
    transition: box-shadow .15s ease, border-color .15s ease;
}
input:focus:not([type="checkbox"]):not([type="radio"]), select:focus, textarea:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); 
}
button:focus, input:focus, select:focus {
    outline: none; 
}

/* Checkbox/Admin specific styles */
.checkbox-container {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 0;
    font-weight: 600;
    color: #374151;
}
.checkbox-container input[type="checkbox"] {
    width: auto; 
    height: 18px;
    width: 18px;
    margin: 0;
    accent-color: #3b82f6; 
}

/* Footer actions in modal */
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;
}

/* Helpers */
.td-actions {
    width: 160px; 
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

/* Responsive */
@media (max-width: 960px) {
    .modal-content {
        width: 92%;
        padding: 20px;
    }
    .td-actions {
        width: auto; 
        justify-content: flex-start; 
    }
}
</style>