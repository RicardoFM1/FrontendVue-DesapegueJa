<template>
  <div v-if="tokenExiste == true">
    <div class="divFiltros">
      <v-layout>
        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>
          <v-toolbar-title>Filtros</v-toolbar-title>

          <v-btn
            prepend-icon="mdi-check"
            variant="flat"
            color="#5865f2"
            @click="toAnunciar"
          >
            Anunciar
          </v-btn>

          <v-btn
            class="ml-4 mr-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
            @click="toCarrinho"
          >
            Carrinho
          </v-btn>

          <v-menu v-model="menu" offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-card class="pa-4" width="300">
              <v-row justify="center">
                <v-avatar color="grey darken-2" size="70">
                  <span class="white--text text-h6">{{ iniciais }}</span>
                </v-avatar>
              </v-row>
              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 nomeUsuario ellipses">
                      {{ usuario?.nome }}
                    </div>
                  </template>
                  <span>{{ usuario?.nome }}</span>
                </v-tooltip>
              </v-row>

              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 emailUsuario ellipses">
                      {{ usuario?.email }}
                    </div>
                  </template>
                  <span>{{ usuario?.email }}</span>
                </v-tooltip>
              </v-row>

              <v-divider class="my-3"></v-divider>

              <v-btn
                block
                color="#eaece7"
                variant="flat"
                class="mb-4"
                @click="toPerfil"
              >
                PERFIL
              </v-btn>
              <v-btn
                block
                color="#cc0000"
                variant="flat"
                class="mb-4"
                @click="removerToken"
              >
                SAIR
              </v-btn>
            </v-card>
          </v-menu>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :width="345">
          <div class="divLabelSlider">
            <p>Preço</p>
            <p>
              R$ <span>{{ range[0] }}-</span><span>{{ range[1] }}</span>
            </p>
          </div>
          <v-range-slider
            class="sliderFiltro"
            v-model="range"
            step="1"
            max="10000"
            min="0"
          ></v-range-slider>

          <v-divider></v-divider>
          <p class="subtitleConservacao">Estado de conservação</p>
          <div class="divCheckboxFiltros">
            <v-checkbox label="Excelente" hide-details></v-checkbox>
            <v-checkbox label="Muito bom" hide-details></v-checkbox>
            <v-checkbox label="Bom" hide-details></v-checkbox>
            <v-checkbox label="Ruim" hide-details></v-checkbox>
            <v-checkbox label="Muito ruim" hide-details></v-checkbox>
            <v-checkbox label="Péssimo" hide-details></v-checkbox>
          </div>

          <v-divider></v-divider>
          <p class="subtitleCategoria">Categoria:</p>
          <div class="divCheckboxCategoria">
            <v-combobox
              class="comboboxCategoria"
              label="Selecionar"
              :items="categorias"
            ></v-combobox>
          </div>
        </v-navigation-drawer>

        <v-main>
        
          <div class="divHeaderMain">
            <v-text-field
              v-model="search"
              class="inputPesquisa transition-all"
              label="Pesquisar"
              width="30%"
              rounded
              :class="{ 'fixed-input': isFixed }"
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
          </div>
          <div style="width: 100%; display: flex;
          justify-content: center;">
            <v-sheet
            v-if="erroGetProduto"
            width="400"
  
            color="red-darken-2"
            class="pa-4 mb-4 text-white text-center rounded-lg"
            elevation="4"
            >
            <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
            <p class="text-h6 mb-2">Erro ao listar os produtos 😢</p>
  <p class="mb-4">Verifique sua conexão e tente novamente.</p>
  <v-btn
  color="white"
    variant="outlined"
    prepend-icon="mdi-refresh"
    @click="recarregarProdutos"

  >
    Tentar novamente
  </v-btn>
</v-sheet>
</div>
<div
  v-if="carregandoProdutos"
  class="d-flex justify-center align-center my-8"
  style="height: 300px"
>
  <v-progress-circular
    indeterminate
    color="primary"
    size="64"
    width="6"
  ></v-progress-circular>
</div>


  
          <div class="divItens">
            <v-card
  width="330"
  min-height="300"
  class="cardItem"
  v-for="(item, index) in itensFiltrados"
  :key="item + '-' + index"
>
  <v-img
    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    width="330"
    class="imgItem"
  ></v-img>

  <v-card-title class="mb-2">
    {{ item.produto }}
  </v-card-title>
  <v-card-subtitle class="mb-2">
    R$ {{ item.valor }}
  </v-card-subtitle>

  <div class="divBtnAdicionar">
    <v-card-actions class="divBtnsAcoes">
      <v-btn
        variant="flat"
        color="#2196F3"
        class="btnDetalhes"
        @click="toDetalhes(index + 1)"
        
        density="comfortable"
       
      >
        Detalhes
      </v-btn>
<!-- Depois colocar o id que vem no produto no @click de cima indo para detalhes -->
      <v-btn
        variant="flat"
        color="#3fa34f"
        prepend-icon="mdi-cart"
        density="comfortable"
        class="btnAdicionar"
        
      >
        Adicionar ao carrinho
      </v-btn>
    </v-card-actions>
  </div>
</v-card>

          </div>
        </v-main>
      </v-layout>
    </div>
  </div>

  <!-- Caso não tenha token -->
  <div v-else>
    <div class="divFiltros">
      <v-layout>
        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>

          <v-toolbar-title>Filtros</v-toolbar-title>
          <v-btn
            prepend-icon="mdi-check"
            variant="flat"
            color="#5865f2"
            @click="toAnunciar"
          >
            Anunciar
          </v-btn>

          <v-btn
            class="ml-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
            @click="toCarrinho"
          >
            Carrinho
          </v-btn>
          <v-btn
            class="ml-4"
            variant="flat"
            color="#5865f2"
            @click="toCadastro"
          >
            Cadastre-se
          </v-btn>
          <v-btn
            @click="toLogin"
            class="ml-4 mr-4"
            variant="outlined"
            color="blue-darken-4"
          >
            Fazer login
          </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :width="345">
          <div class="divLabelSlider">
            <p>Preço</p>
            <p>
              R$ <span>{{ range[0] }}-</span><span>{{ range[1] }}</span>
            </p>
          </div>
          <v-range-slider
            class="sliderFiltro"
            v-model="range"
            step="1"
            max="10000"
            min="0"
          ></v-range-slider>

          <v-divider></v-divider>
          <p class="subtitleConservacao">Estado de conservação</p>
          <div class="divCheckboxFiltros">
            <v-checkbox label="Excelente" hide-details></v-checkbox>
            <v-checkbox label="Muito bom" hide-details></v-checkbox>
            <v-checkbox label="Bom" hide-details></v-checkbox>
            <v-checkbox label="Ruim" hide-details></v-checkbox>
            <v-checkbox label="Muito ruim" hide-details></v-checkbox>
            <v-checkbox label="Péssimo" hide-details></v-checkbox>
          </div>

          <v-divider></v-divider>
          <p class="subtitleCategoria">Categoria:</p>
          <div class="divCheckboxCategoria">
            <v-combobox
              class="comboboxCategoria"
              label="Selecionar"
              :items="categorias"
            ></v-combobox>
          </div>
        </v-navigation-drawer>

        <v-main>
          
          <div class="divHeaderMain">
            <v-text-field
              v-model="search"
              class="inputPesquisa transition-all"
              label="Pesquisar"
              width="30%"
              rounded
              :class="{ 'fixed-input': isFixed }"
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
          </div>
          <div style="width: 100%; display: flex;
          justify-content: center;">
            <v-sheet
            v-if="erroGetProduto"
            width="400"
  
            color="red-darken-2"
            class="pa-4 mb-4 text-white text-center rounded-lg"
            elevation="4"
            >
            <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
            <p class="text-h6 mb-2">Erro ao listar os produtos 😢</p>
  <p class="mb-4">Verifique sua conexão e tente novamente.</p>
  <v-btn
  color="white"
    variant="outlined"
    prepend-icon="mdi-refresh"
    @click="recarregarProdutos"

  >
    Tentar novamente
  </v-btn>
</v-sheet>
</div>
<div
  v-if="carregandoProdutos"
  class="d-flex justify-center align-center my-8"
  style="height: 300px"
>
  <v-progress-circular
    indeterminate
    color="primary"
    size="64"
    width="6"
  ></v-progress-circular>
</div>


          <div class="divItens">
           <v-card
              width="330"
              min-height="300"
              class="cardItem"
              v-for="(item, index) in itensFiltrados"
              :key="item + '-' + index"
            >
              <v-img
                :src="getProdutoImage(item.imagem)"
                width="330"
                position="center"
                height="330"
                cover
                class="imgItem"
              >
                <template #error>
                  <img src="/png-triste-erro.png" alt="Imagem não disponível" />
                </template>
              </v-img>

              <v-card-title class="ellipses mb-2 rounded font-weight-bold">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p v-bind="props">
                      {{ item.nome }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    {{ item.nome }}
                  </span>
                </v-tooltip>
              </v-card-title>
              <v-card-subtitle
                style="width: 50%"
                class="mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p
                      v-bind="props"
                      class="text-subtitle-1 ellipses bg-green text-white rounded px-2 py-1 d-inline-block"
                    >
                      R$ {{ item.preco / 100 }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    R$ {{ item.preco / 100 }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>
              <v-card-subtitle
                class="ellipses text-subtitle-1 mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p style="width: 50%" class="ellipses" v-bind="props">
                      Em estoque: {{ item.estoque }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Estoque : {{ item.estoque }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>

              <div class="divBtnAdicionar" > 
                <v-card-actions>
                  <v-btn variant="flat" density="compact" color="#3fa34f" prepend-icon="mdi-cart">
                    Adicionar ao carrinho
                  </v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </div>
          <v-dialog
            max-width="500"
            v-model="modalAlertShow"
            v-if="modalAlertShow == true"
          >
            <v-card title="Aviso">
              <template #prepend>
                <v-icon size="42" color="yellow">mdi-alert</v-icon>
              </template>
              <v-card-text>
                Usuário sem permissão para executar esta ação! Tente primeiro
                fazer login.
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text="Fazer login"
                  base-color="green"
                  variant="flat"
                  v-model="modalAlertShow"
                  @click="toLogin"
                >
                </v-btn>
                <v-btn
                  text="Ok"
                  base-color="blue"
                  v-model="modalAlertShow"
                  @click="modalAlertShow = false"
                >
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-main>
      </v-layout>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, computed } from "vue";
import { useRouter } from "vue-router"
import { useCartStore } from '@/components/stores/cart'

const cart = useCartStore()

function addToCart(item) {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  cart.addToCart({
    id:item.id,
    produto:item.produto,
    valor:item.valor,
    image:item.image
  })
}

const drawer = ref(false);
const range = ref([0, 0]);
const categoriasList = [
  "Roupas e acessórios",
  "Imóveis",
  "Ferramentas",
  "Veículos",
  "Móveis/Decoração",
  "Equipamentos de escritório",
  "Hobbies e jogos",
  "Esportes",
];

const menu = ref(false);
const search = ref("");

const itensFiltrados = computed(() =>
  itens.value.filter((item) =>
    item.nome.toLowerCase().includes(search.value.toLowerCase())
  )
);

const iniciais = computed(() => {
  if (!usuario.value || !usuario.value.nome) return "Usuário";
  return usuario.value.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});



function toPerfil() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/perfil");
}

function removerToken() {
  localStorage.removeItem("token");
  router.push("/login");
}

function toDetalhes(id) {
  router.push(`/produto/${id}`);
}
function toAnunciar() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/anunciar");
}
function toCarrinho() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/carrinho");
}
function toCadastro() {
  router.push("/cadastro");
}
function toLogin() {
  router.push("/login");
}
</script>

<style>
@import "../css/paginaHome/home.css";

</style>
