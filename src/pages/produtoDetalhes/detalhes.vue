<template>
  <v-container>
    <!-- Botão Voltar -->
    <v-btn class="btn-voltar" @click="voltar" prepend-icon="mdi-arrow-left">
      Voltar
    </v-btn>

    <!-- Grid de produtos -->
    <v-row dense>
      <v-col
        v-for="produto in produtos"
        :key="produto.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="produto-card">
          <v-img :src="produto.imagem" height="180px"></v-img>
          <v-card-title class="produto-titulo">{{ produto.produto }}</v-card-title>
          <v-card-subtitle class="produto-preco">
            R$ {{ produto.valor }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="#3fa34f" block @click="adicionarCarrinho(produto)">
              Adicionar ao carrinho
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const produtos = [
  {
    id: 1,
    produto: "Carro Esportivo 2024",
    valor: 120000,
    imagem: "https://cdn.vuetifyjs.com/images/cards/sunshine.jpg",
  },
  {
    id: 2,
    produto: "Carro Sedan Premium 2023",
    valor: 95000,
    imagem: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
  },
  {
    id: 3,
    produto: "SUV Familiar Confort 2022",
    valor: 87000,
    imagem: "https://cdn.vuetifyjs.com/images/cards/mountain.jpg",
  },
];

function voltar() {
  router.back();
}

function adicionarCarrinho(produto) {
  console.log("Adicionado ao carrinho:", produto);
}
</script>

<style scoped>
@import "../css/paginaDetalhesProduto/detalhes.css";
</style>
