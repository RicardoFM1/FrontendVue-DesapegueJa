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
              <th>Telefone</th>
              <th>Nascimento</th>
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
              <td>{{ u.telefone }}</td>
              <td>{{ u.dataNascimento ? new Date(u.dataNascimento).toLocaleDateString('pt-BR') : 'N/A' }}</td>
              <td><span :class="u.isAdmin ? 'badge-ativo' : 'badge-inativo'">{{ u.isAdmin ? 'Sim' : 'Não' }}</span></td>
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
              <th>Status</th>
              <th>Cor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in categorias" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.nome }}</td>
              <td><span :class="c.status === 'Ativo' ? 'badge-ativo' : 'badge-inativo'">{{ c.status }}</span></td>
              <td><div class="color-badge" :style="{ backgroundColor: c.cor || '#ccc' }"></div></td>
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
              <th>Estoque</th>
              <th>Status</th>
              <th>Data Post</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in produtos" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nome }}</td>
              <td>R$ {{ p.preco }}</td>
              <td>{{ p.estoque }}</td>
              <td><span :class="p.status === 'Ativo' ? 'badge-ativo' : 'badge-inativo'">{{ p.status }}</span></td>
              <td>{{ p.dataPost ? new Date(p.dataPost).toLocaleDateString('pt-BR') : 'N/A' }}</td>
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

        <div v-if="modalType === 'usuario'" class="modal-grid">
          <div class="form-row">
            <label>Nome</label>
            <input v-model="modalData.nome" placeholder="Nome" />
          </div>
          <div class="form-row">
            <label>Email</label>
            <input v-model="modalData.email" placeholder="Email" />
          </div>
          <div class="form-row">
            <label>CPF</label>
            <input v-model="modalData.cpf" placeholder="CPF" maxlength="14" />
          </div>
          <div class="form-row">
            <label>Telefone</label>
            <input v-model="modalData.telefone" placeholder="Telefone (DD) 99999-9999" maxlength="15" />
          </div>
          <div class="form-row">
            <label>Data de Nascimento</label>
            <input v-model="modalData.dataNascimento" type="date" />
          </div>
          <div class="form-row">
            <label>Senha</label>
            <input v-model="modalData.senha" placeholder="Senha" type="password" :required="!modalData.id" />
          </div>
          
          <div class="checkbox-container full-row">
            <input type="checkbox" id="isAdmin" v-model="modalData.isAdmin" />
            <label for="isAdmin">É Administrador</label>
          </div>
        </div>

        <div v-if="modalType === 'categoria'" class="modal-grid">
          <div class="form-row">
            <label>Nome da Categoria</label>
            <input v-model="modalData.nome" placeholder="Nome da Categoria" />
          </div>
          <div class="form-row">
            <label>Cor de Destaque</label>
            <input v-model="modalData.cor" type="color" />
          </div>
          <div class="form-row">
            <label>Status</label>
            <select v-model="modalData.status">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        <div v-if="modalType === 'produto'" class="modal-grid">
          <div class="form-row full-row">
            <label>Nome</label>
            <input v-model="modalData.nome" placeholder="Nome do Produto" />
          </div>
          <div class="form-row">
            <label>Preço</label>
            <input v-model="modalData.preco" placeholder="Preço" type="number" />
          </div>
          <div class="form-row">
            <label>Categoria ID</label>
            <input v-model="modalData.categoriaId" placeholder="Categoria ID" />
          </div>
          <div class="form-row">
            <label>Estoque</label>
            <input v-model="modalData.estoque" placeholder="Quantidade em Estoque" type="number" />
          </div>
          <div class="form-row">
            <label>Status</label>
            <select v-model="modalData.status">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div class="form-row">
            <label>Data de Publicação</label>
            <input v-model="modalData.dataPost" type="date" />
          </div>
          <div class="form-row full-row">
            <label>URL da Imagem</label>
            <input v-model="modalData.imagem" placeholder="URL da imagem principal" />
          </div>
          <div class="form-row full-row">
            <label>Descrição</label>
            <textarea v-model="modalData.descricao" placeholder="Descrição detalhada do produto" rows="4"></textarea>
          </div>
        </div>

        <div v-if="modalType === 'endereco'" class="modal-grid">
          <div class="form-row">
            <label>CEP</label>
            <input v-model="modalData.cep" placeholder="CEP (ex: 88888-888)" @blur="fetchCep" maxlength="9" />
          </div>
          <div class="form-row">
            <label>Número</label>
            <input v-model="modalData.numero" placeholder="Número" />
          </div>
          <div class="form-row full-row">
            <label>Rua</label>
            <input v-model="modalData.rua" placeholder="Rua" :disabled="cepLoading" />
          </div>
          <div class="form-row">
            <label>Bairro</label>
            <input v-model="modalData.bairro" placeholder="Bairro" :disabled="cepLoading" />
          </div>
          <div class="form-row">
            <label>Cidade</label>
            <input v-model="modalData.cidade" placeholder="Cidade" :disabled="cepLoading" />
          </div>
          <div class="form-row">
            <label>Estado (UF)</label>
            <input v-model="modalData.estado" placeholder="Estado (UF)" maxlength="2" :disabled="cepLoading" />
          </div>
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
// Se você não tem esses imports ou os caminhos estão errados, o código falhará.
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

    // Função auxiliar para formatar datas para o input type="date" (AAAA-MM-DD)
    formatToDateInput(dateString) {
      if (!dateString) return "";
      // Se já estiver no formato AAAA-MM-DD, retorna
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;

      try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return ""; // Verifica se é uma data válida

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
      } catch (e) {
          return "";
      }
    },

    openModal(type, item = {}) {
      this.modalType = type;
      this.cepLoading = false; 

      if (type === "usuario") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || "",
          email: item.email || "",
          cpf: item.cpf || "", 
          telefone: item.telefone || "",
          dataNascimento: this.formatToDateInput(item.dataNascimento), 
          senha: "", 
          isAdmin: item.isAdmin || false 
        };
      }

      if (type === "categoria") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || "",
          status: item.status || "Ativo", 
          cor: item.cor || "#6366f1"     
        };
      }

      if (type === "produto") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || "",
          preco: item.preco || 0,
          categoriaId: item.categoriaId || "",
          descricao: item.descricao || "",
          // CORREÇÃO: Inicializa estoque como número
          estoque: item.estoque !== undefined && item.estoque !== null ? Number(item.estoque) : 0, 
          // CORREÇÃO: Garante o formato da data para o input
          dataPost: this.formatToDateInput(item.dataPost || new Date()),
          status: item.status || "Ativo",
          imagem: item.imagem || ""
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
        // Assume que a API pode aceitar status como filtro
        const res = await connection.get("/usuarios?status=1");
        this.usuarios = res.data;
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    },

    async loadCategorias() {
      try {
        const res = await connection.get("/categorias"); 
        this.categorias = res.data;
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    },

    async loadProdutos() {
      try {
        const res = await connection.get("/produtos?page=1&pageSize=200");
        // Lógica de manipulação de resposta para garantir que 'produtos' é um array
        this.produtos = Array.isArray(res.data) ? res.data : res.data.produtos || [];
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
          // Usa PATCH para atualizar
          await connection.patch(`${endpoint}/${item.id}`, item);
        } else {
          // Usa POST para criar
          await connection.post(endpoint, item);
        }

        this.closeModal();
        this.reloadTab(); 
      } catch (error) {
        console.error(`Erro ao salvar ${type}:`, error.response ? error.response.data : error.message);
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
/* ========================================================= */
/* RESET E LAYOUT BASE                     */
/* ========================================================= */
.admin-container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 30px;
    font-family: 'Inter', sans-serif;
    color: #1f2937;
    background: #f4f6f9;
    min-height: 100vh;
    box-sizing: border-box;
    transition: background-color 0.3s ease;
}

/* Header */
.admin-header h1 {
    margin: 0 0 30px 0;
    font-size: 28px;
    font-weight: 800;
    color: #111827;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 15px;
}

/* Section Header */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}
.section-header h2 {
    font-size: 22px;
    color: #1f2937;
    font-weight: 700;
    margin: 0;
}


/* ========================================================= */
/* NAVEGAÇÃO (TABS)                  */
/* ========================================================= */
.tabs {
    display: flex;
    gap: 0;
    margin-bottom: 30px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    padding: 6px;
}

.tabs button {
    flex-grow: 1;
    background: transparent;
    border: none;
    padding: 12px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all .3s ease;
    color: #4b5563;
    font-size: 15px;
    outline: none;
}

.tabs button:hover:not(.active) {
    background: #f3f4f6;
    color: #1f2937;
}

.tabs .active {
    background: linear-gradient(135deg, #0d9488, #059669); /* Teal/Emerald Gradient */
    color: #fff;
    box-shadow: 0 4px 15px rgba(13, 148, 136, 0.4);
    font-weight: 700;
}


/* ========================================================= */
/* BOTÕES                          */
/* ========================================================= */

/* Botão principal de Adicionar */
.add-btn, .edit, .delete, .save, .cancel {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0;
    cursor: pointer;
    border-radius: 10px;
    font-weight: 600;
    transition: all .2s ease;
}

.add-btn {
    background: linear-gradient(45deg, #2563eb, #3b82f6); /* Blue Gradient */
    color: #fff;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    padding: 10px 18px;
}
.add-btn:hover {
    opacity: 0.95;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
}

/* Botões de Ação na Tabela */
.edit {
    background: #f59e0b; /* Amber */
    color: #fff;
    padding: 7px 12px;
    border-radius: 8px;
}
.delete {
    background: #ef4444; /* Red */
    color: #fff;
    padding: 7px 12px;
    border-radius: 8px;
}
.edit:hover, .delete:hover {
    opacity: 0.9;
    transform: scale(1.02);
}

/* Botões do Modal */
.save {
    background: #10b981; /* Emerald */
    color: #fff;
    padding: 10px 20px;
}
.cancel {
    background: #6b7280; /* Gray */
    color: #fff;
    padding: 10px 20px;
}
.save:hover, .cancel:hover {
    opacity: 0.9;
}


/* ========================================================= */
/* TABELAS                         */
/* ========================================================= */
table {
    width: 100%;
    border-radius: 12px;
    background: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); 
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden; 
}

thead {
    background: #f9fafb; 
}

th, td {
    padding: 15px 18px;
    text-align: left;
    color: #374151;
    font-size: 14px;
    border-bottom: 1px solid #f3f4f6;
}

th {
    font-weight: 700;
    color: #1f2937;
    font-size: 15px;
}

tbody tr:last-child td {
    border-bottom: none;
}

tbody tr:hover {
    background: #fdfefe;
    transform: translateY(-1px);
    transition: transform 0.1s ease, background 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 1; 
}

.td-actions {
    width: 180px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

/* Badges de Status/Admin */
.badge-ativo {
    background: #0d9488; /* Teal */
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 12px;
    display: inline-block;
}
.badge-inativo {
    background: #ef4444; /* Red */
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 12px;
    display: inline-block;
}

/* Badge de Cor para Categoria */
.color-badge {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid #f3f4f6; 
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    display: inline-block;
    vertical-align: middle;
}


/* ========================================================= */
/* MODAL E FORM                     */
/* ========================================================= */
.modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(17, 24, 39, 0.65); 
    backdrop-filter: blur(5px);
    z-index: 1200;
    padding: 10px;
}
.modal-content {
    width: 900px;
    max-width: 95%;
    background: #fff;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.modal-content h3 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 15px;
}

.modal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: 20px; 
    align-items: start;
}

.full-row {
    grid-column: 1 / -1;
}

/* Inputs, Selects, Textareas */
input:not([type="checkbox"]):not([type="radio"]), select, textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    outline: none;
    font-size: 15px;
    color: #1f2937;
    box-sizing: border-box;
    transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
}

input[type="color"] {
    height: 40px; 
    padding: 4px; 
}

input:focus:not([type="checkbox"]):not([type="radio"]), select:focus, textarea:focus {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); 
}

.form-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.form-row label {
    font-size: 14px;
    color: #4b5563;
    font-weight: 600;
}

/* Checkbox */
.checkbox-container {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 0;
    font-weight: 600;
    color: #374151;
}
.checkbox-container input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: #3b82f6; 
}

/* Modal Actions */
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f3f4f6;
}

/* ========================================================= */
/* RESPONSIVIDADE (MOBILE-FIRST)                      */
/* ========================================================= */
@media (max-width: 768px) {
    .admin-container {
        padding: 15px;
    }
    
    .tabs {
        flex-direction: column;
        padding: 0;
        gap: 0;
        box-shadow: none;
        border: 1px solid #e5e7eb;
    }
    .tabs button {
        border-radius: 0;
        border-bottom: 1px solid #e5e7eb;
    }
    .tabs button:last-child { border-bottom: none; }
    .tabs .active {
        box-shadow: none;
        border-bottom: 2px solid #0d9488;
    }
    
    .modal-grid {
        grid-template-columns: 1fr; 
    }
    
    /* Transformação da Tabela em Cartões */
    table, thead, tbody, th, td, tr {
        display: block;
    }
    thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }
    tr {
        margin-bottom: 15px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    td {
        border: none;
        position: relative;
        padding-left: 50%;
        text-align: right;
    }
    td:before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 45%;
        padding-left: 15px;
        font-weight: 700;
        text-align: left;
        color: #1f2937;
    }
    .td-actions {
        width: 100%;
        justify-content: center;
        padding: 10px 0;
        border-top: 1px solid #f3f4f6;
    }
}
</style>