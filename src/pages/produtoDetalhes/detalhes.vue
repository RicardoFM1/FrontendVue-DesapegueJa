<template>
  <v-container class="produto-detalhes-container">
    <v-btn text color="blue" @click="voltar">Voltar</v-btn>

    <v-card class="produto-card mt-4" max-width="600">
      <v-img :src="produto.imagem" height="300" class="produto-imagem"></v-img>

      <v-card-title class="produto-titulo">{{ produto.produto }}</v-card-title>
      <v-card-subtitle class="produto-preco">R$ {{ produto.valor }}</v-card-subtitle>

      <v-card-text>
        <p>Descrição: {{ produto.descricao }}</p>
        <p>Categoria: {{ produto.categoria }}</p>
        <p>Estado: {{ produto.estado }}</p>
      </v-card-text>

      <v-card-actions class="produto-acoes">
        <v-btn color="#2196F3" class="btn-detalhes">🔍 Detalhes</v-btn>
        <v-btn color="#3fa34f" class="btn-carrinho" @click="adicionarCarrinho(produto)">
          Adicionar ao carrinho
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
  { id: 1, produto: "um Carro", valor: 1200, imagem: "https://cdn.vuetifyjs.com/images/parallax/material.jpg", descricao: "Descrição do carro", categoria: "Veículos", estado: "Excelente" },
  { id: 2, produto: "um Carro2", valor: 12002, imagem: "https://cdn.vuetifyjs.com/images/parallax/material.jpg", descricao: "Descrição do carro2", categoria: "Veículos", estado: "Muito bom" },
  { id: 3, produto: "um Carro3", valor: 12003, imagem: "https://cdn.vuetifyjs.com/images/parallax/material.jpg", descricao: "Descrição do carro3", categoria: "Veículos", estado: "Bom" },
];

const produto = ref({});

onMounted(() => {
  const id = parseInt(route.params.id);
  produto.value = produtos.find((p) => p.id === id) || {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visivel");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".v-card-text p").forEach((p) => observer.observe(p));
});

function voltar() {
  router.back();
}

function adicionarCarrinho(produto) {
  console.log("Adicionado ao carrinho:", produto);
}
</script>

<style>
@import "../css/paginaDetalhesProduto/detalhes.css";
</style>
