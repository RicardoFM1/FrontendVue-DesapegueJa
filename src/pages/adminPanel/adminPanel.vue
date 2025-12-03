<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4">
        
        <v-row>
          <v-col cols="12">
            <v-card class="pa-4" color="primary" dark>
              <v-card-title class="text-h4">
                Painel Administrativo 🛠️
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        
        <v-divider class="my-4"></v-divider>

        <v-tabs
          v-model="activeTab"
          background-color="transparent"
          color="primary"
          show-arrows
        >
          <v-tab value="usuarios">Usuários</v-tab>
          <v-tab value="categorias">Categorias</v-tab>
          <v-tab value="produtos">Produtos</v-tab>
          <v-tab value="enderecos">Endereços</v-tab>
        </v-tabs>

        <v-card class="mt-4" elevation="4">
          <v-card-text>
            <v-window v-model="activeTab">
              
              <v-window-item value="usuarios">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h5">Usuários</h2>
                  <v-btn color="success" @click="openModal('usuario')">
                    <v-icon left>mdi-plus</v-icon>
                    + Usuário
                  </v-btn>
                </div>
                <v-data-table
                  :headers="usuarioHeaders"
                  :items="usuarios"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:item.isAdmin="{ item }">
                    <v-chip :color="item.isAdmin ? 'green' : 'red'" dark small>
                      {{ item.isAdmin ? 'Sim' : 'Não' }}
                    </v-chip>
                  </template>
                  <template v-slot:item.dataNascimento="{ item }">
                    {{ item.dataNascimento ? new Date(item.dataNascimento).toLocaleDateString('pt-BR') : 'N/A' }}
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn small color="primary" class="mr-2" @click="openModal('usuario', item)">Editar</v-btn>
                    <v-btn small color="error" @click="deleteData(item.id, 'usuario')">Excluir</v-btn>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="categorias">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h5">Categorias</h2>
                  <v-btn color="success" @click="openModal('categoria')">
                    <v-icon left>mdi-plus</v-icon>
                    + Categoria
                  </v-btn>
                </div>
                <v-data-table
                  :headers="categoriaHeaders"
                  :items="categorias"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="item.status === 'Ativo' ? 'green' : 'red'" dark small>
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.cor="{ item }">
                    <v-chip :color="item.cor || '#ccc'" dark small>Cor</v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn small color="primary" class="mr-2" @click="openModal('categoria', item)">Editar</v-btn>
                    <v-btn small color="error" @click="deleteData(item.id, 'categoria')">Excluir</v-btn>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="produtos">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h5">Produtos</h2>
                  <v-btn color="success" @click="openModal('produto')">
                    <v-icon left>mdi-plus</v-icon>
                    + Produto
                  </v-btn>
                </div>
                <v-data-table
                  :headers="produtoHeaders"
                  :items="produtos"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:item.preco="{ item }">
                    R$ {{ item.preco.toFixed(2) }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="item.status === 'Ativo' ? 'green' : 'red'" dark small>
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.dataPost="{ item }">
                    {{ item.dataPost ? new Date(item.dataPost).toLocaleDateString('pt-BR') : 'N/A' }}
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn small color="primary" class="mr-2" @click="openModal('produto', item)">Editar</v-btn>
                    <v-btn small color="error" @click="deleteData(item.id, 'produto')">Excluir</v-btn>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="enderecos">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h5">Endereços</h2>
                  <v-btn color="success" @click="openModal('endereco')">
                    <v-icon left>mdi-plus</v-icon>
                    + Endereço
                  </v-btn>
                </div>
                <v-data-table
                  :headers="enderecoHeaders"
                  :items="enderecos"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn small color="primary" class="mr-2" @click="openModal('endereco', item)">Editar</v-btn>
                    <v-btn small color="error" @click="deleteData(item.id, 'endereco')">Excluir</v-btn>
                  </template>
                </v-data-table>
              </v-window-item>
              
            </v-window>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalOpen" max-width="600px">
          <v-card>
            <v-card-title class="text-h5 primary white--text">
              {{ modalData.id ? 'Editar' : 'Adicionar' }} {{ modalType.charAt(0).toUpperCase() + modalType.slice(1) }}
            </v-card-title>
            <v-card-text class="pt-4">
              <v-container>
                
                <v-form v-if="modalType === 'usuario'">
                  <v-row>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.nome" label="Nome" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.email" label="Email" outlined dense type="email"></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.cpf" label="CPF" outlined dense maxlength="14" hint="Apenas números"></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.telefone" label="Telefone" outlined dense maxlength="15" hint="(DD) 99999-9999"></v-text-field></v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="modalData.dataNascimento" label="Data de Nascimento" type="date" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="modalData.senha" label="Senha" outlined dense type="password" :rules="[v => !!modalData.id || !!v || 'Campo obrigatório para novo usuário']"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox v-model="modalData.isAdmin" label="É Administrador" color="primary"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'categoria'">
                  <v-row>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.nome" label="Nome da Categoria" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6">
                      <v-select v-model="modalData.status" :items="['Ativo', 'Inativo']" label="Status" outlined dense></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="modalData.cor" label="Cor de Destaque" type="color" outlined dense></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'produto'">
                  <v-row>
                    <v-col cols="12"><v-text-field v-model="modalData.nome" label="Nome do Produto" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.preco" label="Preço" type="number" prefix="R$" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.categoriaId" label="Categoria ID" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.estoque" label="Quantidade em Estoque" type="number" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="6">
                      <v-select v-model="modalData.status" :items="['Ativo', 'Inativo']" label="Status" outlined dense></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="modalData.dataPost" label="Data de Publicação" type="date" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12"><v-text-field v-model="modalData.imagem" label="URL da Imagem" outlined dense></v-text-field></v-col>
                    <v-col cols="12">
                      <v-textarea v-model="modalData.descricao" label="Descrição detalhada do produto" rows="4" outlined dense></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'endereco'">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="modalData.cep" label="CEP" outlined dense maxlength="9" @blur="fetchCep" :loading="cepLoading"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6"><v-text-field v-model="modalData.numero" label="Número" outlined dense></v-text-field></v-col>
                    <v-col cols="12"><v-text-field v-model="modalData.rua" label="Rua" :disabled="cepLoading" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="4"><v-text-field v-model="modalData.bairro" label="Bairro" :disabled="cepLoading" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="4"><v-text-field v-model="modalData.cidade" label="Cidade" :disabled="cepLoading" outlined dense></v-text-field></v-col>
                    <v-col cols="12" sm="4"><v-text-field v-model="modalData.estado" label="Estado (UF)" maxlength="2" :disabled="cepLoading" outlined dense></v-text-field></v-col>
                  </v-row>
                </v-form>

              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeModal">Cancelar</v-btn>
              <v-btn color="success" @click="saveData">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { connection } from "@/connection/axiosConnection.js";
import axios from 'axios';

export default {
  data() {
    return {
      activeTab: "usuarios",
      
      usuarioHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Nome', value: 'nome' },
        { text: 'Email', value: 'email' },
        { text: 'CPF', value: 'cpf' },
        { text: 'Telefone', value: 'telefone' },
        { text: 'Nascimento', value: 'dataNascimento' },
        { text: 'Admin', value: 'isAdmin' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
      categoriaHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Nome', value: 'nome' },
        { text: 'Status', value: 'status' },
        { text: 'Cor', value: 'cor', sortable: false },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
      produtoHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Nome', value: 'nome' },
        { text: 'Preço', value: 'preco' },
        { text: 'Estoque', value: 'estoque' },
        { text: 'Status', value: 'status' },
        { text: 'Data Post', value: 'dataPost' },
        { text: 'Categoria ID', value: 'categoriaId' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
      enderecoHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'CEP', value: 'cep' },
        { text: 'Rua', value: 'rua' },
        { text: 'Número', value: 'numero' },
        { text: 'Cidade', value: 'cidade' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],

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


    formatToDateInput(dateString) {
      if (!dateString) return "";
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;

      try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return ""; 

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
      } else if (type === "categoria") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || "",
          status: item.status || "Ativo",
          cor: item.cor || "#6366f1"
        };
      } else if (type === "produto") {
        this.modalData = {
          id: item.id || null,
          nome: item.nome || "",
          preco: item.preco !== undefined && item.preco !== null ? Number(item.preco) : 0,
          categoriaId: item.categoriaId || "",
          descricao: item.descricao || "",
          estoque: item.estoque !== undefined && item.estoque !== null ? Number(item.estoque) : 0,
          dataPost: this.formatToDateInput(item.dataPost || new Date()),
          status: item.status || "Ativo",
          imagem: item.imagem || ""
        };
      } else if (type === "endereco") {
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
        const res = await connection.get("/categorias");
        this.categorias = res.data;
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    },

    async loadProdutos() {
      try {
        const res = await connection.get("/produtos?page=1&pageSize=200");
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

    reloadTab() {
      if (this.activeTab === "usuarios") this.loadUsuarios();
      else if (this.activeTab === "categorias") this.loadCategorias();
      else if (this.activeTab === "produtos") this.loadProdutos();
      else if (this.activeTab === "enderecos") this.loadEnderecos();
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.reloadTab();
    },
    
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
        console.error(`Erro ao salvar ${type}:`, error.response ? error.response.data : error.message);
        alert(`Falha ao salvar. Verifique o console para detalhes.`);
      }
    },
    
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
    }
  },

  mounted() {
    this.loadUsuarios();
    this.loadCategorias();
    this.loadProdutos();
    this.loadEnderecos();
  }
};
</script>