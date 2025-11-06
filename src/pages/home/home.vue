<template>
  <v-container class="detalhes-container">
    <v-btn
      class="btn-voltar-fixo"
      color="blue"
      prepend-icon="mdi-arrow-left"
      @click="voltar"
      variant="text"
    >
      Voltar
    </v-btn>

    <div v-if="carregandoProdutos" class="d-flex justify-center align-center my-8" style="height: 300px">
      <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
    </div>

    <div v-else-if="erroGetProduto" style="width: 100%; display: flex; justify-content: center;">
      <v-sheet
        width="400"
        color="red-darken-2"
        class="pa-4 mb-4 text-white text-center rounded-lg"
        elevation="4"
      >
        <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
        <p class="text-h6 mb-2">Erro ao carregar o produto 😢</p>
        <p class="mb-4">Verifique sua conexão e tente novamente.</p>
        <v-btn
          color="white"
          variant="outlined"
          prepend-icon="mdi-refresh"
          @click="recarregarProdutos"
        >
          Tentar novamente
        </v-btn>
      </v-sheet>
    </div>

    <div v-else class="detalhes-conteudo">
      <div class="imagem-container">
        <v-img
          :src="getProdutoImage(produto.imagem)"
          class="produto-imagem"
          :aspect-ratio="1"
          contain
        ></v-img>
      </div>

      <div class="info-container">
        <h1 class="titulo-produto">{{ produto.produto }}</h1>

        <div class="avaliacoes">
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star-half-full</v-icon>
          <span class="texto-avaliacao">(483)</span>
        </div>

        <div class="preco-container">
          <p class="preco-antigo">{{ produto.precoAntigo }}</p>
          <p class="preco-novo">{{ formatarPreco(produto.valor) }}</p>
          <p class="parcelamento">6x {{ parcela(produto.valor) }} sem juros</p>
        </div>

        <v-btn class="btn-promo" color="blue-lighten-5">
          R$ 20 OFF BB VISA
        </v-btn>

        <div class="informacoes-extra">
          <p><strong>FRETE GRÁTIS ACIMA DE R$ 19</strong></p>
          <p>Receba grátis amanhã</p>
          <p>Retire grátis a partir de amanhã em uma agência</p>
          <p>Devolução grátis: Você tem 30 dias após o recebimento</p>
        </div>

        <div class="detalhes-produto">
          <p><strong>Descrição:</strong> {{ produto.descricao }}</p>
          <p><strong>Categoria:</strong> {{ produto.categoria }}</p>
          <p><strong>Estado:</strong> {{ produto.estado }}</p>
        </div>

        <v-btn class="btn-carrinho" @click="adicionarCarrinho(produto)">
          <v-icon left>mdi-cart</v-icon>
          ADICIONAR AO CARRINHO
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { connection } from "@/connection/axiosConnection";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const route = useRoute();
const router = useRouter();

// ---------- Variáveis compartilhadas ----------
const token = ref();
const tokenExiste = ref(false);
if (localStorage.getItem("token")) {
  tokenExiste.value = true;
  token.value = localStorage.getItem("token");
}

const retrieve = ref();
const usuario = ref();
const categorias = ref([]);
const vendedor = ref([]);
const itens = ref([]);
const produto = ref({});
const erroGetProduto = ref(false);
const carregandoProdutos = ref(false);

// ---------- Funções reutilizadas ----------
async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res.status === 200) {
      retrieve.value = res.data;
      usuario.value = res.data;
    }
  } catch (error) {
    toast.error("Erro ao buscar o usuário");
  }
}

async function getCategorias() {
  try {
    const res = await connection.get(`/desapega/categorias`);
    if (res.status === 200) categorias.value = res.data;
  } catch (error) {
    toast.error("Erro ao carregar categorias");
  }
}

async function getVendedor() {
  try {
    const res = await connection.get("/desapega/usuarios");
    if (res.status === 200) vendedor.value = res.data;
  } catch (error) {
    toast.error("Erro ao buscar vendedores");
  }
}

async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  try {
    const url =
      retrieve.value?.admin === true
        ? "/desapega/produtos"
        : "/desapega/produtos?status=ativo";
    const res = await Promise.race([connection.get(url), timeout]);

    if (res.status === 200) {
      itens.value = res.data;
      const id = parseInt(route.params.id);
      produto.value = res.data.find((p) => p.id === id) || {};
    } else {
      erroGetProduto.value = true;
    }
  } catch (error) {
    erroGetProduto.value = true;
    toast.error("Erro ao carregar produto");
  } finally {
    carregandoProdutos.value = false;
  }
}

function recarregarProdutos() {
  getProdutos();
}

function voltar() {
  router.back();
}

function adicionarCarrinho(produto) {
  console.log("Adicionado ao carrinho:", produto);
  toast.success("Produto adicionado ao carrinho!");
}

function formatarPreco(valor) {
  if (!valor) return "R$ 0,00";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parcela(valor) {
  const valorParcela = valor / 6;
  return valorParcela.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getProdutoImage(imagem) {
  if (imagem && imagem !== "Sem imagem" && imagem.length > 0) {
    return imagem.startsWith("data:")
      ? imagem
      : `data:image/png;base64,${imagem}`;
  }
  return "/png-triste-erro.png";
}

// ---------- Lifecycle ----------
onMounted(async () => {
  if (tokenExiste.value) await getRetrieve();
  await Promise.all([getCategorias(), getVendedor(), getProdutos()]);
});

watch(retrieve, (novo) => {
  console.log("Usuário:", novo);
});
</script>

<style src="../css/paginaDetalhesProduto/detalhes.css"></style>
