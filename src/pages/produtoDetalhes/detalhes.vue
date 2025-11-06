<template>
  <v-container class="produto-detalhes-container">
    <v-btn
      text
      color="blue"
      class="btn-voltar-fixo"
      @click="voltar"
      prepend-icon="mdi-arrow-left"
    >
      Voltar
    </v-btn>

    <v-card class="produto-card">
      <v-img
        :src="produto.imagem"
        height="420"
        class="produto-imagem"
        cover
      ></v-img>

      <v-card-title class="produto-titulo">
        {{ produto.produto }}
      </v-card-title>

      <v-card-subtitle class="produto-preco">
        {{ formatarPreco(produto.valor) }}
      </v-card-subtitle>

      <v-card-text class="produto-info">
        <p class="descricao">
          <strong>Descrição:</strong> {{ produto.descricao }}
        </p>
        <p><strong>Categoria:</strong> {{ produto.categoria }}</p>
        <p><strong>Estado:</strong> {{ produto.estado }}</p>
      </v-card-text>

      <v-card-actions class="produto-acoes">
        <v-btn class="btn-carrinho" @click="adicionarCarrinho(produto)">
          <v-icon left>mdi-cart</v-icon>
          ADICIONAR AO CARRINHO
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const produtos = [
  {
    id: 1,
    produto: "Carro Esportivo",
    valor: 120000,
    imagem: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    descricao:
      "Um carro potente, confortável e com excelente desempenho nas estradas.",
    categoria: "Veículos",
    estado: "Excelente",
  },
  {
    id: 2,
    produto: "Carro Sedan",
    valor: 85000,
    imagem: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    descricao:
      "Carro ideal para o dia a dia, econômico e com ótimo espaço interno.",
    categoria: "Veículos",
    estado: "Muito bom",
  },
  {
    id: 3,
    produto: "SUV Compacto",
    valor: 98000,
    imagem: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    descricao:
      "SUV moderno com tecnologia embarcada e conforto premium.",
    categoria: "Veículos",
    estado: "Bom",
  },
];

const produto = ref({});

onMounted(() => {
  const id = parseInt(route.params.id);
  produto.value = produtos.find((p) => p.id === id) || {};
});

function voltar() {
  router.back();
}

function adicionarCarrinho(produto) {
  console.log("Adicionado ao carrinho:", produto);
}

function formatarPreco(valor) {
  if (!valor) return "R$ 0,00";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
</script>

<style>
@import "../css/paginaDetalhesProduto/detalhes.css";
</style>
