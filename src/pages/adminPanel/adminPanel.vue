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
import { connection } from "@/connection/axiosConnection";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const users = ref([]);
const retrieve = ref(null);

async function getRetrieve(token) {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token}` },
    });

    retrieve.value = res.data;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function getUsers(token) {
  try {
    const res = await connection.get("/desapega/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });

    users.value = res.data ?? [];
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  const token = localStorage.getItem("token");

  if (!token) return router.push("/");

  const ok = await getRetrieve(token);

  if (!ok || retrieve.value?.admin !== true) {
    return router.push("/");
  }

  await getUsers(token);
});

const voltar = () => router.push("/");

const formatDate = (date) =>
  new Date(date).toLocaleDateString("pt-BR");
</script>

<style>
@import "../css/paginaAdminPanel/admin.css";
</style>
