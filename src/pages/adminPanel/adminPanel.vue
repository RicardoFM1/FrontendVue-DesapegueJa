<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Painel Administrativo</h1>
      <button @click="voltar" class="logout-btn">Voltar</button>
    </header>

    <main class="admin-main">
      <h2>Usuários cadastrados</h2>

      <table v-if="users.length" class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.created_at) }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else>Nenhum usuário encontrado.</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const retrieve = ref(null);

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;
      
    } else {
      toast.error("Erro ao buscar o usuário");
      console.error("Resposta inesperada:", res);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    toast.error(error.response?.data?.message || "Erro ao buscar o usuário");
  }
}

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token || retrieve.value.admin !== true) {
    router.push("/");
  }
  if (tokenExiste.value) {
      getRetrieve();
    }
});

const voltar = () => {
  router.push("/");
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR");
};


</script>

<style scoped>
@import "@/pages/css/paginaAdminPanel/admin.css";
</style>
