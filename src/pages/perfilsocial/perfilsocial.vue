<template>
  <v-container class="perfil-social-container">

    <v-btn
      variant="tonal"
      color="brown-darken-3"
      class="mb-6"
      height="50"
      width="150"
      prepend-icon="mdi-arrow-left"
      @click="$router.back()"
      size="small"
    >
      Voltar
    </v-btn>

    <v-card class="perfil-card" elevation="8" :loading="carregandoInformacoes">
      <template v-if="!usuarioCarregado && !carregandoInformacoes">
        <v-alert type="error" border="left">
          Usuário não encontrado ou ID inválido.
        </v-alert>
      </template>
      <template v-else>
        
        <v-list class="pa-0">
            <v-list-item class="px-6 pt-6 pb-4">
                <template v-slot:prepend>
                    <v-avatar size="100" class="avatar-perfil">
                        <v-img :src="usuario.foto_de_perfil || 'https://via.placeholder.com/100?text=S/Foto'" alt="Foto de Perfil"></v-img>
                    </v-avatar>
                </template>

                <v-list-item-header>
                    <v-tooltip :text="usuario.nome || 'Usuário Não Identificado'" location="top">
                        <template v-slot:activator="{ props }">
                            <v-list-item-title 
                                v-bind="props" 
                                class="text-h4 font-weight-bold mb-1 name-truncate"
                            >
                                {{ usuario.nome || 'Usuário Não Identificado' }}
                            </v-list-item-title>
                        </template>
                    </v-tooltip>

                    <v-tooltip :text="usuario.email || 'N/A'" location="bottom">
                        <template v-slot:activator="{ props }">
                            <v-list-item-subtitle 
                                v-bind="props" 
                                class="text-h6 text-medium-emphasis email-truncate"
                            >
                                {{ usuario.email || 'N/A' }}
                            </v-list-item-subtitle>
                        </template>
                    </v-tooltip>
                    
                    <div class="d-flex flex-wrap mt-2">
                        <v-chip
                            :color="usuario.status === 'ativo' ? 'green-darken-2' : 'red-darken-2'"
                            size="small"
                            class="mr-2"
                            label
                            variant="flat"
                            prepend-icon="mdi-circle-small"
                        >
                            {{ usuario.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                        </v-chip>

                        <v-chip
                            v-if="usuario.admin == 1 || usuario.admin === true"
                            color="deep-purple-accent-4"
                            size="small"
                            label
                            variant="flat"
                            prepend-icon="mdi-gavel"
                        >
                            Administrador
                        </v-chip>
                    </div>

                </v-list-item-header>
            </v-list-item>
        </v-list>
        
        <v-divider class="my-4"></v-divider>

        <v-row class="px-6 pb-4">
            <v-col cols="12" sm="4">
                <v-card flat>
                    <v-list-item density="compact">
                        <v-list-item-title class="font-weight-medium">Produtos à Venda</v-list-item-title>
                        <v-list-item-subtitle class="text-h6 font-weight-bold primary--text">
                            {{ totalProdutos }}
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat>
                    <v-list-item density="compact">
                        <v-list-item-title class="font-weight-medium">Telefone</v-list-item-title>
                        <v-tooltip :text="usuario.telefone || 'Não Informado'" location="bottom">
                            <template v-slot:activator="{ props }">
                                <v-list-item-subtitle v-bind="props" class="text-h6 font-weight-bold">
                                    {{ usuario.telefone || 'Não Informado' }}
                                </v-list-item-subtitle>
                            </template>
                        </v-tooltip>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat>
                    <v-list-item density="compact">
                        <v-list-item-title class="font-weight-medium">Data de nascimento</v-list-item-title>
                        <v-list-item-subtitle class="text-h6 font-weight-bold">
                             {{ formatarDataNascimento(usuario.data_de_nascimento) }}
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <div class="px-6 pb-6">
            <v-btn
                variant="text"
                class="mb-2 text-capitalize"
                color="primary"
                @click="mostrarMais = !mostrarMais"
                :prepend-icon="mostrarMais ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            >
                {{ mostrarMais ? 'Esconder Lista de Produtos' : `Mostrar ${totalProdutos} Produtos Anunciados` }}
            </v-btn>

            <v-expand-transition>
                <div v-if="mostrarMais">
                    <v-progress-linear v-if="carregandoProdutos" indeterminate color="primary"></v-progress-linear>

                    <v-alert v-else-if="erroGetProduto" type="warning" class="mt-3">
                        Não foi possível carregar a lista de produtos.
                    </v-alert>

                    <v-alert v-else-if="produtos.length === 0" type="info" class="mt-3">
                        Este usuário não possui produtos anunciados no momento.
                    </v-alert>

                    <v-row v-else class="pt-3">
                        <v-col
                            v-for="(produto) in produtos"
                            :key="produto.id"
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                        >
                            <v-card 
                                class="produto-card" 
                                hover 
                                @click="irParaProduto(produto.id)"
                                elevation="3"
                            >
                                <v-img
                                    :src="produto.imagem || 'https://via.placeholder.com/300x200?text=Sem+Foto'"
                                    height="150px"
                                    cover
                                >
                                    <v-chip
                                        :color="categoriaCor(produto.categoria)"
                                        size="small"
                                        label
                                        variant="flat"
                                        class="ma-2"
                                        :prepend-icon="categoriaIcone(produto.categoria)"
                                    >
                                        {{ produto.categoria || 'Outro' }}
                                    </v-chip>
                                </v-img>
                                
                                <v-card-title class="text-subtitle-1 pb-0">
                                    {{ produto.nome }}
                                </v-card-title>
                                
                                <v-card-subtitle class="font-weight-bold text-primary text-h6 pt-1">
                                    R$ {{ formatarPreco(produto.preco) }}
                                </v-card-subtitle>
                                
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        append-icon="mdi-arrow-right"
                                    >
                                        Ver Detalhes
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                    </div>
            </v-expand-transition>
        </div>

      </template>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { connection } from "@/connection/axiosConnection.js";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const mostrarMais = ref(true);
const usuario = ref({});
const produtos = ref([]);
const totalProdutos = ref(0);

const carregandoInformacoes = ref(false);
const carregandoProdutos = ref(false);
const erroGetProduto = ref(false);
const usuarioCarregado = ref(true);

function categoriaCor(cat) {
  const cores = {
    eletronico: "blue-grey-darken-1",
    roupa: "pink-lighten-1",
    acessorio: "teal-darken-1",
    alimento: "orange-darken-1",
  };
  return cores[cat] || "grey-lighten-1";
}

function categoriaIcone(cat) {
  const icones = {
    eletronico: "mdi-cellphone",
    roupa: "mdi-tshirt-crew",
    acessorio: "mdi-watch",
    alimento: "mdi-food",
  };
  return icones[cat] || "mdi-tag";
}

function irParaProduto(id) {
  console.log(`Clicou no produto com ID: ${id}`);
  router.push(`/produto/${id}`);
}

function formatarDataNascimento(data) {
    if (!data) return 'Nascimento N/A';
    try {
        const date = new Date(data);
        if (isNaN(date)) return 'Nascimento N/A';
        return `Nascido em ${date.getFullYear()}`;
    } catch (e) {
        return 'Data Inválida';
    }
}


function formatarPreco(precoEmCentavos) {
  if (precoEmCentavos === null || precoEmCentavos === undefined) {
    return '0,00';
  }
  
  return (precoEmCentavos / 100).toFixed(2).replace('.', ',');
}

async function getUsuario() {
  if (!route.params.id) {
    usuarioCarregado.value = false;
    return;
  }
  carregandoInformacoes.value = true;
  try {
    const res = await connection.get(`/desapega/usuarios/${route.params.id}`);
    if (res.status === 200) {
      usuario.value = res.data;
      usuarioCarregado.value = true;
    } else {
      usuarioCarregado.value = false;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    usuarioCarregado.value = false;
  } finally {
    carregandoInformacoes.value = false;
  }
}

async function getProdutos() {
  if (!route.params.id) return;
  
  carregandoProdutos.value = true;
  erroGetProduto.value = false;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  try {
    const res = await Promise.race([
      connection.get(`/desapega/produtos/usuario/${route.params.id}`),
      timeoutPromise,
    ]);

    if (res.status === 200) {
      console.log('Dados de Produtos Recebidos:', res.data);
      
      const listaProdutos = res.data.produtos || res.data || [];
      produtos.value = Array.isArray(listaProdutos) ? listaProdutos : []; 
      
      totalProdutos.value = res.data.total || produtos.value.length;
    } else {
      erroGetProduto.value = true;
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    erroGetProduto.value = true;
  } finally {
    carregandoProdutos.value = false;
  }
}

onMounted(async () => {
  await getUsuario();
  await getProdutos();
});
</script>

<style >
@import "../css/paginaPerfilSocial/perfilsocial.css";
</style>