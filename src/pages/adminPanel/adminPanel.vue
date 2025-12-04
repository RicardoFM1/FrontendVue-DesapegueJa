<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 rounded-xl" color="primary" elevation="4">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <h1 class="text-h4 font-weight-bold white--text mb-1">Painel Administrativo 🛠️</h1>
                  <p class="text-subtitle-1 white--text opacity-80">Gerencie todo o sistema em um só lugar.</p>
                </div>
                <v-btn variant="tonal" color="white" prepend-icon="mdi-home" to="/">Voltar para Loja</v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
        
        <v-card class="mt-6 rounded-xl" elevation="2">
          <v-tabs
            v-model="activeTab"
            bg-color="primary"
            align-tabs="center"
            slider-color="white"
          >
            <v-tab value="usuarios" prepend-icon="mdi-account-group">Usuários</v-tab>
            <v-tab value="categorias" prepend-icon="mdi-shape">Categorias</v-tab>
            <v-tab value="produtos" prepend-icon="mdi-package-variant">Produtos</v-tab>
            <v-tab value="enderecos" prepend-icon="mdi-map-marker">Endereços</v-tab>
          </v-tabs>

          <v-card-text class="pa-6">
            <v-window v-model="activeTab">
              
              <v-window-item value="usuarios">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">Gerenciar Usuários</h2>
                  <v-btn color="primary" prepend-icon="mdi-plus" class="text-capitalize" @click="openModal('usuario')">
                    Novo Usuário
                  </v-btn>
                </div>
                <v-data-table
                  :headers="usuarioHeaders"
                  :items="usuarios"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.Admin="{ item }">
                    <v-chip :color="item.Admin ? 'info' : 'grey'" size="small" variant="flat">
                      {{ item.Admin ? 'Admin' : 'Cliente' }}
                    </v-chip>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="item.status === 'ativo' ? 'success' : 'error'" size="small" variant="flat">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="openModal('usuario', item)"></v-btn>
                      <v-btn 
                        :icon="item.status === 'ativo' ? 'mdi-block-helper' : 'mdi-check-circle'" 
                        size="small" 
                        :color="item.status === 'ativo' ? 'error' : 'success'" 
                        variant="text" 
                        @click="openConfirmDialog('usuario', item)"
                      >
                        <v-tooltip activator="parent" location="top">{{ item.status === 'ativo' ? 'Desativar' : 'Ativar' }}</v-tooltip>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="categorias">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">Gerenciar Categorias</h2>
                  <v-btn color="primary" prepend-icon="mdi-plus" class="text-capitalize" @click="openModal('categoria')">
                    Nova Categoria
                  </v-btn>
                </div>
                <v-data-table
                  :headers="categoriaHeaders"
                  :items="categorias"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.Cor="{ item }">
                    <div class="d-flex align-center">
                      <v-sheet :color="item.Cor" width="24" height="24" class="rounded-circle mr-2 border"></v-sheet>
                      {{ item.Cor }}
                    </div>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="item.status === 'ativo' ? 'success' : 'error'" size="small" variant="flat">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="openModal('categoria', item)"></v-btn>
                      <v-btn 
                        :icon="item.status === 'ativo' ? 'mdi-block-helper' : 'mdi-check-circle'" 
                        size="small" 
                        :color="item.status === 'ativo' ? 'error' : 'success'" 
                        variant="text" 
                        @click="openConfirmDialog('categoria', item)"
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="produtos">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">Gerenciar Produtos</h2>
                  <v-btn color="primary" prepend-icon="mdi-plus" class="text-capitalize" @click="openModal('produto')">
                    Novo Produto
                  </v-btn>
                </div>
                <v-data-table
                  :headers="produtoHeaders"
                  :items="produtos"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.imagem="{ item }">
                    <v-avatar rounded size="40">
                      <v-img :src="item.imagem || 'https://via.placeholder.com/50'" cover></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:item.preco="{ item }">
                    R$ {{ (item.preco / 100).toFixed(2).replace('.', ',') }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="item.status === 'ativo' ? 'success' : 'error'" size="small" variant="flat">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="openModal('produto', item)"></v-btn>
                      <v-btn 
                        :icon="item.status === 'ativo' ? 'mdi-block-helper' : 'mdi-check-circle'" 
                        size="small" 
                        :color="item.status === 'ativo' ? 'error' : 'success'" 
                        variant="text" 
                        @click="openConfirmDialog('produto', item)"
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="enderecos">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">Gerenciar Endereços</h2>
                  <v-btn color="primary" prepend-icon="mdi-plus" class="text-capitalize" @click="openModal('endereco')">
                    Novo Endereço
                  </v-btn>
                </div>
                <v-data-table
                  :headers="enderecoHeaders"
                  :items="enderecos"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="item.status === 'ativo' ? 'success' : 'error'" size="small" variant="flat">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="openModal('endereco', item)"></v-btn>
                      <v-btn 
                        :icon="item.status === 'ativo' ? 'mdi-block-helper' : 'mdi-check-circle'" 
                        size="small" 
                        :color="item.status === 'ativo' ? 'error' : 'success'" 
                        variant="text" 
                        @click="openConfirmDialog('endereco', item)"
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>
              
            </v-window>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalOpen" max-width="700px" scrollable>
          <v-card class="rounded-xl">
            <v-card-title class="text-h5 font-weight-bold pa-4 bg-primary text-white d-flex justify-space-between align-center">
              {{ modalData.id || modalData.Id ? 'Editar' : 'Novo' }} {{ modalType.charAt(0).toUpperCase() + modalType.slice(1) }}
              <v-btn icon="mdi-close" variant="text" color="white" @click="closeModal"></v-btn>
            </v-card-title>
            
            <v-card-text class="pt-6 pb-4">
              <v-container>
                
                <v-form v-if="modalType === 'usuario'" ref="formUsuario">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.Nome" label="Nome de usuário" variant="outlined" density="comfortable" :rules="[rules.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.Email" label="E-mail" variant="outlined" density="comfortable" :rules="[rules.required, rules.email]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.Cpf" label="CPF" variant="outlined" density="comfortable" hint="Apenas números"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.Telefone" label="Telefone" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.data_de_nascimento" label="Data de Nascimento" type="date" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-if="!modalData.id && !modalData.Id" 
                        v-model="modalData.Senha" 
                        label="Senha" 
                        type="password" 
                        variant="outlined" 
                        density="comfortable"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field 
                        v-else 
                        v-model="modalData.Senha" 
                        label="Nova Senha (Opcional)" 
                        type="password" 
                        variant="outlined" 
                        density="comfortable"
                        hint="Deixe em branco para manter a atual"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="modalData.Foto_De_Perfil" label="URL da Foto de Perfil" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="d-flex">
                      <v-checkbox v-model="modalData.Admin" label="Acesso Administrativo" color="primary"></v-checkbox>
                      <v-select 
                        v-model="modalData.status" 
                        :items="['ativo', 'inativo']" 
                        label="Status" 
                        variant="outlined" 
                        density="compact"
                        class="ml-4 mt-2"
                        style="max-width: 150px;"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'categoria'" ref="formCategoria">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="modalData.Nome" label="Nome da Categoria" variant="outlined" density="comfortable" :rules="[rules.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.Cor" label="Cor (Hex ou Nome)" type="color" variant="outlined" density="comfortable" style="height: 60px;"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="modalData.status" :items="['ativo', 'inativo']" label="Status" variant="outlined" density="comfortable"></v-select>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'produto'" ref="formProduto">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="modalData.nome" label="Nome do Produto" variant="outlined" density="comfortable" :rules="[rules.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model.number="modalData.preco" label="Preço (Centavos)" type="number" variant="outlined" density="comfortable" :rules="[rules.required]" hint="Ex: 1000 = R$ 10,00"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model.number="modalData.estoque" label="Estoque" type="number" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model.number="modalData.categoria_id" label="ID da Categoria" type="number" variant="outlined" density="comfortable" :rules="[rules.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model.number="modalData.usuario_id" label="ID do Vendedor" type="number" variant="outlined" density="comfortable" :rules="[rules.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="modalData.status" :items="['ativo', 'inativo', 'vendido']" label="Status" variant="outlined" density="comfortable"></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="modalData.imagem" label="URL da Imagem Principal" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="modalData.descricao" label="Descrição" variant="outlined" density="comfortable" rows="3"></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'endereco'" ref="formEndereco">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model.number="modalData.usuario_id" label="ID do Usuário" type="number" variant="outlined" density="comfortable" :rules="[rules.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.Cep" label="CEP" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="9">
                      <v-text-field v-model="modalData.rua" label="Rua / Logradouro" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field v-model="modalData.numero" label="Número" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.bairro" label="Bairro" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="modalData.cidade" label="Cidade" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field v-model="modalData.estado" label="UF" variant="outlined" density="comfortable" maxlength="2"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="modalData.complemento" label="Complemento" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="modalData.status" :items="['ativo', 'inativo']" label="Status" variant="outlined" density="comfortable"></v-select>
                    </v-col>
                  </v-row>
                </v-form>

              </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn variant="outlined" color="grey" @click="closeModal" class="px-4">Cancelar</v-btn>
              <v-btn color="primary" variant="flat" @click="saveData" :loading="saving" class="px-6">Salvar Dados</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="confirmDialog.show" max-width="400">
          <v-card class="rounded-lg pa-4">
            <div class="text-center pt-2">
              <v-icon size="48" :color="confirmDialog.isActivate ? 'success' : 'warning'" class="mb-2">
                {{ confirmDialog.isActivate ? 'mdi-check-circle' : 'mdi-alert-circle' }}
              </v-icon>
              <div class="text-h6 font-weight-bold">{{ confirmDialog.title }}</div>
              <div class="text-body-2 text-grey mt-2">{{ confirmDialog.message }}</div>
            </div>
            <v-card-actions class="justify-center mt-4">
              <v-btn variant="text" color="grey" @click="confirmDialog.show = false">Cancelar</v-btn>
              <v-btn 
                :color="confirmDialog.isActivate ? 'success' : 'warning'" 
                variant="flat" 
                @click="confirmStatusChange"
                :loading="loadingStatus"
              >
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { connection } from "@/connection/axiosConnection.js";
import axios from 'axios';

const activeTab = ref("usuarios");
const loading = ref(false);
const saving = ref(false);
const loadingStatus = ref(false);
const modalOpen = ref(false);
const modalType = ref("");
const modalData = ref({});
const cepLoading = ref(false);

const usuarios = ref([]);
const categorias = ref([]);
const produtos = ref([]);
const enderecos = ref([]);

const confirmDialog = ref({
    show: false,
    title: '',
    message: '',
    item: null,
    type: '',
    isActivate: false
});

const usuarioHeaders = [
    { title: 'ID', key: 'id', sortable: true },
    { title: 'Nome', key: 'nome' },
    { title: 'Email', key: 'email' },
    { title: 'CPF', key: 'cpf' },
    { title: 'Telefone', key: 'telefone' },
    { title: 'Admin', key: 'isAdmin' },
    { title: 'Status', key: 'status' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
];
const categoriaHeaders = [
    { title: 'ID', key: 'id', sortable: true },
    { title: 'Nome', key: 'nome' },
    { title: 'Cor', key: 'cor', sortable: false },
    { title: 'Status', key: 'status' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
];
const produtoHeaders = [
    { title: 'ID', key: 'id', sortable: true },
    { title: 'Nome', key: 'nome' },
    { title: 'Preço', key: 'preco' },
    { title: 'Estoque', key: 'estoque' },
    { title: 'Status', key: 'status' },
    { title: 'Data Post', key: 'dataPost' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
];
const enderecoHeaders = [
    { title: 'ID', key: 'id', sortable: true },
    { title: 'CEP', key: 'cep' },
    { title: 'Rua', key: 'rua' },
    { title: 'Número', key: 'numero' },
    { title: 'Cidade', key: 'cidade' },
    { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
];

const rules = {
    required: value => !!value || 'Campo obrigatório.',
    email: value => /.+@.+\..+/.test(value) || 'E-mail inválido.',
};

function formatDateToInput(dateString) {
    if (!dateString) return "";
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ""; 
        return date.toISOString().split('T')[0];
    } catch {
        return "";
    }
}

function getEmptyModel(type) {
    switch(type) {
        case 'usuario': 
            return { id: null, nome: '', email: '', cpf: '', telefone: '', senha: '', isAdmin: false, dataNascimento: '' };
        case 'categoria': 
            return { id: null, nome: '', status: 'Ativo', cor: '#6366f1' };
        case 'produto': 
            return { id: null, nome: '', preco: 0, categoriaId: '', descricao: '', estoque: 0, dataPost: formatDateToInput(new Date()), status: 'Ativo', imagem: '' };
        case 'endereco': 
            return { id: null, cep: '', rua: '', numero: '', cidade: '', bairro: '', estado: '' };
        default: return {};
    }
}

function openModal(type, item = null) {
    modalType.value = type;
    cepLoading.value = false;

    if (item && item.id) {
        modalData.value = { ...item };
        if (type === 'usuario') {
            modalData.value.dataNascimento = formatDateToInput(item.dataNascimento);
        }
        if (type === 'produto') {
            modalData.value.dataPost = formatDateToInput(item.dataPost);
        }
    } else {
        modalData.value = getEmptyModel(type);
    }
    modalOpen.value = true;
}

function closeModal() {
    modalOpen.value = false;
    modalData.value = {};
}

async function fetchCep() {
    const cep = modalData.value.cep ? modalData.value.cep.replace(/\D/g, '') : '';
    if (cep.length !== 8) return;

    cepLoading.value = true;
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        if (!data.erro) {
            modalData.value.rua = data.logradouro;
            modalData.value.cidade = data.localidade;
            modalData.value.estado = data.uf;
            modalData.value.bairro = data.bairro;
        } else {
            alert('CEP não encontrado.');
            modalData.value.rua = '';
            modalData.value.cidade = '';
            modalData.value.estado = '';
            modalData.value.bairro = '';
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    } finally {
        cepLoading.value = false;
    }
}

async function loadDataForTab(tab) {
    loading.value = true;
    try {
        let endpoint = '';
        let targetRef;

        if (tab === "usuarios") { endpoint = "/usuarios"; targetRef = usuarios; }
        else if (tab === "categorias") { endpoint = "/categorias"; targetRef = categorias; }
        else if (tab === "produtos") { endpoint = "/produtos?page=1&pageSize=200"; targetRef = produtos; }
        else if (tab === "enderecos") { endpoint = "/enderecos"; targetRef = enderecos; }

        if (endpoint) {
            const res = await connection.get(endpoint);
            targetRef.value = Array.isArray(res.data) ? res.data : (res.data.produtos || res.data);
        }

    } catch (error) {
        console.error(`Erro ao carregar dados da aba ${tab}:`, error);
    } finally {
        loading.value = false;
    }
}

async function saveData() {
    saving.value = true;
    const item = modalData.value;
    const type = modalType.value;
    const id = item.id; 
    const isEdit = !!id;

    let endpoint = "";
    if (type === "usuario") endpoint = "/usuarios";
    else if (type === "categoria") endpoint = "/categorias";
    else if (type === "produto") endpoint = "/produtos";
    else if (type === "endereco") endpoint = "/enderecos";

    try {
        if (isEdit) {
            await connection.patch(`${endpoint}/${id}`, item);
        } else {
            await connection.post(endpoint, item);
        }

        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} salvo com sucesso!`);
        closeModal();
        loadDataForTab(activeTab.value); 
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        console.error(`Erro ao salvar ${type}:`, msg);
        alert(`Erro ao salvar: ${msg}`);
    } finally {
        saving.value = false;
    }
}

function openConfirmDialog(type, item) {
    const isCurrentlyActive = item.status?.toLowerCase() === 'ativo';
    confirmDialog.value = {
        show: true,
        type: type,
        item: item,
        isActivate: !isCurrentlyActive,
        title: isCurrentlyActive ? `Desativar ${type}?` : `Reativar ${type}?`,
        message: isCurrentlyActive 
          ? `O registro será marcado como inativo.` 
          : `O registro ficará visível novamente.`
    };
}

async function confirmStatusChange() {
    loadingStatus.value = true;
    const { type, item, isActivate } = confirmDialog.value;
    const newStatus = isActivate ? 'Ativo' : 'Inativo';
    const id = item.id;

    let endpoint = "";
    if (type === "usuario") endpoint = "/usuarios";
    else if (type === "categoria") endpoint = "/categorias";
    else if (type === "produto") endpoint = "/produtos";
    else if (type === "endereco") endpoint = "/enderecos";

    try {
        await connection.patch(`${endpoint}/${id}`, { status: newStatus });
        
        item.status = newStatus;
        
        confirmDialog.value.show = false;
    } catch (error) {
        console.error("Erro ao alterar status", error);
        alert("Erro ao alterar status.");
    } finally {
        loadingStatus.value = false;
    }
}

async function deleteData(id, type) {
    if (!confirm(`ATENÇÃO: Isso excluirá permanentemente o ${type} (ID: ${id}). Continuar?`)) return;

    let endpoint = "";
    if (type === "usuario") endpoint = "/usuarios";
    else if (type === "categoria") endpoint = "/categorias";
    else if (type === "produto") endpoint = "/produtos";
    else if (type === "endereco") endpoint = "/enderecos";

    try {
        await connection.delete(`${endpoint}/${id}`);
        alert("Registro excluído.");
        loadDataForTab(activeTab.value);
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir registro.");
    }
}

watch(activeTab, (newTab) => {
    loadDataForTab(newTab);
});

onMounted(() => {
    
});

</script>