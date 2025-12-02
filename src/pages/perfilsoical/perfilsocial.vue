<template>
  <div class="perfil-wrapper">

    <!-- Botão de Voltar -->
    <v-btn
      variant="tonal"
      color="brown-darken-3"
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      @click="$router.back()"
    >
      Voltar
    </v-btn>

    <v-card class="pa-4 perfil-card" elevation="4">
      <v-row>
        <v-col cols="4" class="d-flex justify-center align-center">
          <v-avatar size="80">
            <img :src="user.avatar" alt="Avatar" />
          </v-avatar>
        </v-col>

        <v-col cols="8">
          <h3 class="text-h6 font-weight-bold">{{ user.nome }}</h3>
          <p class="text-body-2">{{ user.email }}</p>
        </v-col>
      </v-row>

      <v-divider class="my-3"></v-divider>

      <v-btn variant="text" class="mb-2" @click="mostrarMais = !mostrarMais">
        {{ mostrarMais ? 'Esconder detalhes' : 'Mostrar detalhes' }}
      </v-btn>

      <v-expand-transition>
        <div v-if="mostrarMais">
          <p><strong>Contato:</strong> {{ user.contato }}</p>
          <p><strong>Produtos à venda:</strong> {{ user.totalProdutos }}</p>

          <p><strong>Produtos:</strong></p>

          <div class="d-flex flex-wrap">
            <v-chip
              :color="categoriaCor(produto.categoria)"
              variant="flat"
              v-for="(produto, index) in user.produtos"
              :key="index"
              class="ma-1"
              :ripple="false"
              link
              @click="irParaProduto(produto.nome)"
              :prepend-icon="categoriaIcone(produto.categoria)"
            >
              {{ produto.nome }}
            </v-chip>
          </div>
        </div>
      </v-expand-transition>
    </v-card>

  </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  name: "PerfilUsuario",
  data() {
    return {
      mostrarMais: true,
      user: {
        avatar: "https://via.placeholder.com/80",
        nome: "Nome do Usuário",
        email: "email@exemplo.com",
        contato: "51993819394",
        totalProdutos: 103,
        produtos: [
          { nome: "Produto 1", categoria: "eletronico" },
          { nome: "Produto 2", categoria: "roupa" },
          { nome: "Produto 3", categoria: "acessorio" },
          { nome: "Produto 4", categoria: "alimento" }
        ]
      }
    };
  },

  methods: {
    categoriaCor(cat) {
      const cores = {
        eletronico: "blue",
        roupa: "pink",
        acessorio: "green",
        alimento: "orange",
      };
      return cores[cat] || "grey";
    },

    categoriaIcone(cat) {
      const icones = {
        eletronico: "mdi-cellphone",
        roupa: "mdi-tshirt-crew",
        acessorio: "mdi-watch",
        alimento: "mdi-food",
      };
      return icones[cat] || "mdi-tag";
    },

    irParaProduto(nome) {
      this.$router.push(`/detalhes/${nome}`);
    }
  }
};

// --- SEU CÓDIGO DE REQUISIÇÃO MANTIDO COMO ESTAVA ---
const carregandoInformacoes = ref(false);
const usuario = ref([]);
async function getUsuario() {
  carregandoInformacoes.value = true;
  try {
    const res = await connection.get(`/desapega/usuarios/${route.params.id}`);
    if (res.status == 200) {
      console.log(res.data);
      usuario.value = res.data;

    } else {
      return "Sem vendedor";
    }
  } catch (error) {
    return null;
  } finally {
    carregandoInformacoes.value = false;
  }
}
const carregandoProdutos = ref(false);
const erroGetProduto = ref(false);
const total = ref(false);
const itens = ref([])
async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

    try {
      const res = await Promise.race([
        connection.get(`/desapega/produtos/usuario/${route.params.id}`),
        timeout,
      ]);

      if (res.status == 200) {
        itens.value = res.data.produtos     
  total.value = res.data.total
        erroGetProduto.value = false;
      } else {
        toast.error("Erro ao buscar o produto");
        erroGetProduto.value = true;
      }
    } catch (error) {
      const mensagem =
        error.message === "Tempo limite excedido"
          ? "Tempo limite excedido ao buscar produtos"
          : error.response?.data?.message || "Erro ao buscar o produto";
      console.log(mensagem);
      toast.error(mensagem);
      erroGetProduto.value = true;
    } finally {
      setTimeout(() => {
        carregandoProdutos.value = false;
      }, 500);
    }
  } 

onMounted(async () => {
  if(!localStorage.getItem("token")){
    router.push('/login');
  }
  await getUsuario();
  await getProdutos();
});
</script>

<style scoped>
/* --- TELA INTEIRA --- */
.perfil-wrapper {
  width: 100vw;
  min-height: 100vh;
  background: #f1f1f1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- Card agora ocupa mais espaço (sem alterar seu design interno) --- */
.perfil-card {
  width: 100%;
  max-width: 900px;
  min-width: 400px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

/* --- Avatar --- */
v-avatar img {
  border-radius: 50%;
  object-fit: cover;
}

/* --- Nome e Email --- */
h3 {
  margin: 0;
  color: #333;
}

p {
  margin: 2px 0;
  color: #555;
}

/* --- Botão Detalhes --- */
.v-btn {
  text-transform: none;
  font-weight: 600;
  color: #1976d2;
}

/* Chips */
.d-flex.flex-wrap {
  margin-top: 6px;
}

.v-chip {
  cursor: pointer;
  background-color: #f5f5f5;
  border-radius: 10px;
  font-weight: 500;
  transition: 0.2s ease;
}

.v-chip:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

/* Animação */
.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.v-expand-transition-enter-from,
.v-expand-transition-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
