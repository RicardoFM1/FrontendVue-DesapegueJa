<template>
  <div class="not-found-container">
    <v-card class="pa-8 text-center" max-width="500" rounded="lg" elevation="6">
      <div class="mb-4">
        <v-icon size="96" color="error">mdi-alert-circle-outline</v-icon>
      </div>

      <h1 class="text-h1 font-weight-bold text-primary">404</h1>
      <h2 class="text-h5 font-weight-medium mb-4">Página Não Encontrada</h2>

      <p class="text-body-1 text-medium-emphasis mb-6">
        Ops! Parece que o endereço que você tentou acessar não existe ou foi
        alterado. Verifique o endereço ou use o botão abaixo para retornar.
      </p>

      <v-divider class="my-6"></v-divider>

      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        class="mt-2 text-white"
        @click="goToHome"
      >
        <v-icon start>mdi-home</v-icon>
        Voltar para a Página Inicial
      </v-btn>

      <v-btn
        variant="text"
        color="grey-darken-1"
        class="mt-4"
        @click="router.back()"
      >
        Tentar a página anterior
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToHome = () => {
  router.push("/");
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
