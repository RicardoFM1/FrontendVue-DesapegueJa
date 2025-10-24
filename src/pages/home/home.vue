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
            to="/carrinho"
          >
            Carrinho
          </v-btn>

          <!-- Menu do Perfil -->
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

              <!-- Espaçamento maior entre avatar e nome -->
              <v-row justify="center" class="mt-6">
                <div class="nomeUsuario">{{ usuario.nome }}</div>
              </v-row>

              <v-row justify="center">
                <div class="emailUsuario">{{ usuario.email }}</div>
              </v-row>

              <v-divider class="my-3"></v-divider>

              <!-- Botões com maior espaçamento -->
              <v-btn block color="#eaece7" variant="flat" class="mb-4" @click="toPerfil">
                PERFIL
              </v-btn>
              <v-btn block color="#cc0000" variant="flat" class="mb-4" @click="removerToken">
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
              class="inputPesquisa"
              label="Pesquisar"
              width="30%"
              rounded
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
          </div>
          <div class="divItens">
            <v-card
              width="395"
              min-height="300"
              class="cardItem"
              v-for="(item, index) in itensFiltrados"
              :key="item + '-' + index"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                width="395"
                class="imgItem"
              ></v-img>

              <v-card-title class="mb-2">
                {{ item.produto }}
              </v-card-title>
              <v-card-subtitle class="mb-2">
                R$ {{ item.valor }}
              </v-card-subtitle>

              <div class="divBtnAdicionar">
                <v-card-actions>
                  <v-btn variant="flat" color="#3fa34f" prepend-icon="mdi-cart" @click="addToCart(item)"
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

  <!-- Caso não tenha token -->
  <div v-else>
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
              class="inputPesquisa"
              label="Pesquisar"
              width="40%"
              rounded
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
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

              <div class="divBtnAdicionar" > 
                <v-card-actions>
                  <v-btn variant="flat" color="#3fa34f" prepend-icon="mdi-cart">
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
</template>

<script setup>
import router from "@/router";
import { ref, computed } from "vue";
import { useRouter } from "vue-router"

const drawer = ref(false);
const range = ref([0, 0]);
const tokenExiste = ref(false);
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

const menu = ref(false);
const search = ref("");

const itens = [
  { produto: "um Carro", valor: 1200 },
  { produto: "um Carro2", valor: 12002 },
  { produto: "um Carro3", valor: 12003 },
  { produto: "um Carro", valor: 1200 },
  { produto: "um Carro2", valor: 12002 },
  { produto: "um Carro3", valor: 12003 },
];

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

const usuario = ref({
  nome: "Ricardo Moura",
  email: "ricardo@gmail.com",
});

const iniciais = computed(() =>
  usuario.value.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
);

function toPerfil() {
  router.push("/perfil");
}

function removerToken() {
  localStorage.removeItem("token");
  router.push("/login");
}
</script>

<style>
@import "../css/paginaHome/home.css";
@import "../css/paginaPerfil/perfil.css";
</style>
 