<template>
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
</template>

<script>
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
</script>

<style scoped>
/* --- Card metade da tela --- */
.perfil-card {
  width: 50vw;          /* metade da tela */
  max-width: none;      /* remove limite antigo */
  min-width: 400px;     /* garante tamanho mínimo */
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

/* --- Botão de Detalhes --- */
.v-btn {
  text-transform: none;
  font-weight: 600;
  color: #1976d2;
}

/* --- Container dos Chips --- */
.d-flex.flex-wrap {
  margin-top: 6px;
}

/* --- Estilo dos Chips --- */
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

/* --- Animação ao expandir --- */
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
