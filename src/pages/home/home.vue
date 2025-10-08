<template>
  <div v-if="tokenExiste == true">
    <div class="divFiltros">
      <v-layout>
        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>

          <v-toolbar-title>Filtros</v-toolbar-title>
          <v-btn prepend-icon="mdi-check" variant="flat" color="#5865f2">
            Criar
          </v-btn>

          <v-btn
            class="ml-4 mr-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
          >
            Carrinho
          </v-btn>

          <v-menu v-model="menu" offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-card min-width="250">
              <v-list>
                <v-list-item>
                  <v-avatar color="surface-variant"></v-avatar>
                  ricardo@gmail.com
                </v-list-item>
                <v-divider thickness="2"></v-divider>
              </v-list>
              <v-btn variant="flat" color="#eaece7"> Perfil </v-btn>
              <v-divider thickness="2"></v-divider>
              <v-btn color="#cc0000">Sair</v-btn>
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
          >
          </v-range-slider>
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
              class="inputPesquisa"
              label="Pesquisar"
              width="30%"
              rounded
              variant="outlined"
              append-inner-icon="mdi-magnify"
            >
            </v-text-field>
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
              >
              </v-img>

              <v-card-title class="mb-2">
                {{ item.produto }}
              </v-card-title>
              <v-card-subtitle class="mb-2">
                R$ {{ item.valor }}
              </v-card-subtitle>

              <div class="divBtnAdicionar">
                <v-card-actions>
                  <v-btn variant="flat" color="#3fa34f" prepend-icon="mdi-cart"
                    >Adicionar ao carrinho</v-btn
                  >
                </v-card-actions>
              </div>
            </v-card>
          </div>
        </v-main>
      </v-layout>
    </div>
  </div>
  <div v-if="tokenExiste == false">
    <div class="divFiltros">
      <v-layout>
        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>

          <v-toolbar-title>Filtros</v-toolbar-title>
          <v-btn prepend-icon="mdi-check" variant="flat" color="#5865f2">
            Criar
          </v-btn>

          <v-btn
            class="ml-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
          >
            Carrinho
          </v-btn>
          <v-btn class="ml-4" variant="flat" color="#5865f2" to="/cadastro">
            Cadastre-se
          </v-btn>
          <v-btn
            to="/login"
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
          >
          </v-range-slider>
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
              class="inputPesquisa"
              label="Pesquisar"
              width="40%"
              rounded
              variant="outlined"
              append-inner-icon="mdi-magnify"
            >
            </v-text-field>
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
              >
              </v-img>

              <v-card-title class="mb-2">
                {{ item.produto }}
              </v-card-title>
              <v-card-subtitle class="mb-2">
                R$ {{ item.valor }}
              </v-card-subtitle>

              <div class="divBtnAdicionar">
                <v-card-actions>
                  <v-btn variant="flat" color="#3fa34f" prepend-icon="mdi-cart"
                    >Adicionar ao carrinho</v-btn
                  >
                </v-card-actions>
              </div>
            </v-card>
          </div>
        </v-main>
      </v-layout>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const drawer = ref(false);
const range = ref([0, 0]);
const tokenExiste = ref(false);
const palavraAtual = ref("");
const palavrasChaves = ref([]);
const categorias = [
  "Roupas e acessórios",
  "Imóveis",
  "Ferramentas",
  "Veículos",
  "Móveis/Decoração",
  "Equipamentos de escritório",
  "Hobbies e jogos",
  "Esportes",
];
// depois mudar para pegar do backend as categorias, onde o adm pode colocar mais

const itens = [
  {
    produto: "um Carro",
    valor: 1200,
  },
  {
    produto: "um Carro2",
    valor: 12002,
  },
  {
    produto: "um Carro3",
    valor: 12003,
  },
  {
    produto: "um Carro",
    valor: 1200,
  },
  {
    produto: "um Carro2",
    valor: 12002,
  },
  {
    produto: "um Carro3",
    valor: 12003,
  },
];

const search = ref("");
const menu = ref(false);
const itensFiltrados = computed(() =>
  itens.filter((item) =>
    item.produto.toLowerCase().includes(search.value.toLowerCase())
  )
);

if (localStorage.getItem("token") != null) {
  tokenExiste.value = true;
} else {
  tokenExiste.value = false;
}
function adicionarPalavra() {
  const novaPalavra = palavraAtual.value.trim();
  if (novaPalavra !== "" && !palavrasChaves.value.includes(novaPalavra)) {
    palavrasChaves.value.push(novaPalavra);
  }
  palavraAtual.value = "";
}

function removerPalavra(index) {
  palavrasChaves.value.splice(index, 1);
}
</script>

<style>
@import "../css/paginaHome/home.css";
</style>
