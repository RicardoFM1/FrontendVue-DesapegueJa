<template>
  <v-sheet
    v-if="carregandoCarrinho"
    class="d-flex justify-center align-center my-8"
    height="200"
  >
    <v-progress-circular size="50" color="teal" indeterminate>
    </v-progress-circular>
    <p class="ml-3">Carregando seu carrinho... aguarde</p>
  </v-sheet>
  <v-sheet
    class="d-flex align-center justify-center mt-10"
    v-if="erroGetProduto"
  >
    <v-sheet
      width="400"
      color="red-darken-2"
      class="pa-4 mb-4 text-white text-center rounded-lg"
      elevation="4"
    >
      <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
      <p class="text-h6 mb-2">Erro ao listar seu carrinho</p>
      <p class="mb-4">Verifique sua conexão e tente novamente.</p>
      <v-btn
        color="white"
        variant="outlined"
        prepend-icon="mdi-refresh"
        @click="recarregarProdutos"
        :disabled="carregandoProdutos"
      >
        Tentar novamente
      </v-btn>
    </v-sheet>
  </v-sheet>
  <v-dialog 
        max-width="500"
        v-model="modalConfirmacaoOpen" 
        v-if="modalConfirmacaoOpen">
          <v-card class="pa-4" elevation="8" rounded="xl">
      <v-card-title class="text-center font-weight-bold text-h4">
        <v-icon color="error"  size="32" class="mr-2">mdi-alert-circle-outline</v-icon>
        Remover produto
      </v-card-title>

      <v-card-text class="text-center text-h5 text-medium-emphasis">
        Tem certeza que quer remover esse produto do seu carrinho?
      </v-card-text>

      <v-card-actions class="justify-center mt-2">
        <v-btn
          color="grey"
          variant="outlined"
          rounded="xl"
          @click="modalConfirmacaoOpen = false"
          width="120"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="error"
          variant="flat"
          rounded="xl"
          width="120"
          :loading="loadingRemover"
          @click="removerItem"
        >
          Remover
        </v-btn>
      </v-card-actions>
    </v-card>
        </v-dialog>
  <v-container class="d-flex cart-container">
    <v-sheet
      class="sheetItems"
      v-if="!erroGetProduto && !carregandoCarrinho && carrinhoUser.length > 0"
    >
      <v-sheet class="cart-items">
        <div class="cart-item" v-for="(item, index) in carrinhoUser">
          <v-img
            :src="getProdutoImage(item.imagem)"
            width="50"
            height="150"
            class="imgItem"
          >
            <template #error>
              <img src="/png-triste-erro.png" alt="Imagem não disponível" />
            </template>
          </v-img>

          <div class="item-details">
            <v-tooltip top>
              <template #activator="{ props }">
                <div v-bind="props" class="font-weight-bold ellipses">
                  {{ item?.nome || "Produto indisponível" }}
                </div>
              </template>
              <span>{{ item?.nome || "Produto indisponível" }}</span>
            </v-tooltip>

            <v-tooltip top>
              <template #activator="{ props }">
                <div
                  v-bind="props"
                  class="text-green font-weight-bold ellipses"
                >
                  R$ {{ item?.preco * item?.quantidade / 100 || "Preço indisponível" }}
                </div>
              </template>
              <span>R$ {{ item?.preco * item?.quantidade / 100 || "Preço indisponível"}}</span>
            </v-tooltip>
          </div>

          <div class="item-actions">
            <v-select
  v-model="item.quantidade"
  :items="Array.from({ 
  length: Math.max(item.estoque, item.quantidade) 
}, (_, i) => i + 1)"
  @update:modelValue="atualizarQuantidade(item)"
  density="compact"
  hide-details
></v-select>



            <button @click="clickRemover(item)">
              <v-icon>mdi-delete</v-icon>
            </button>
          </div>
        </div>
      </v-sheet>
    </v-sheet>

    <v-sheet
      height="200"
      class="cart-summary"
      v-if="!erroGetProduto && carrinhoUser.length > 0 && !carregandoCarrinho"
    >
      <p><strong>Total de itens:</strong> {{ totalItems }}</p>
      <p><strong>Subtotal:</strong> R$ {{ subtotal / 100 }}</p>

      <div class="cart-buttons">
        <button class="btn-voltar" @click="voltar">← Voltar às compras</button>
        <button class="btn-comprar" @click="comprar">Finalizar compra</button>
      </div>
    </v-sheet>

    <v-sheet
      v-if="!erroGetProduto && !carregandoCarrinho && carrinhoUser.length <= 0"
      class="empty-cart"
    >
      <p>Seu carrinho está vazio 😢</p>
      <button class="btn-voltar" @click="voltar">Voltar às compras</button>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { connection } from "@/connection/axiosConnection";
import { ref, onMounted, computed, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";


const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);
const retrieve = ref();
const carrinho = ref([]);
const produtos = ref([]);
const erroGetProduto = ref(false);
const carregandoProdutos = ref(true);
const carrinhoUser = ref([]);
const carregandoCarrinho = ref(true);
const totalItems = ref();
const subtotal = computed(() => {
  return carrinhoUser.value.reduce((acc, item) => {
    return acc + item.preco * item.quantidade;
  }, 0);
});
const modalConfirmacaoOpen = ref(false)
const itemASerRemovido = ref()
const loadingRemover = ref(false)

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

async function getCarrinho() {
  try {
    const res = await connection.get(`/desapega/carrinho/${retrieve?.value.id}`);

    if (res.status == 200 || res.status == 201) {
      carrinho.value = res.data;
    } else {
      toast.error("Estamos com dificuldade de listar seus produtos...");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao listar seus produtos");
  }
}

const total = ref(0)

async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  if (retrieve.admin == true) {
    try {
      const res = await Promise.race([
        connection.get("/desapega/produtos"),
        timeout,
      ]);

      if (res.status == 200) {
      produtos.value = res.data.produtos     
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
  } else {
    try {
      const res = await Promise.race([
        connection.get("/desapega/produtos?status=ativo"),
        timeout,
      ]);

      if (res.status == 200) {
        produtos.value = res.data.produtos     
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
}

async function setarCarrinhoUser() {
  carregandoCarrinho.value = true;

  try {
    if (carrinho.value && produtos.value) {
      const carrinhoUsernew = [];

      for (let i = 0; i < carrinho.value.length; i++) {
        const itemCarrinho = carrinho.value[i];
        const produto = produtos.value.find(
          (p) => p.id === itemCarrinho.produto_id
        );

        if (produto) {
          carrinhoUsernew.push({
            ...produto,
            quantidade: itemCarrinho.quantidade,
          });
        }
      }

      carrinhoUser.value = [...carrinhoUsernew].reverse();

      totalItems.value = carrinhoUsernew.length ;

      
    }
  } catch (err) {
    toast.error("Erro ao carregar carrinho, tente novamente!");
  } finally {
    carregandoCarrinho.value = false;
  }
}

onMounted(async () => {
  if (!tokenExiste.value) {
    router.push("/");
  }
  if (tokenExiste.value) {
    await getRetrieve();
    await getCarrinho();
    await getProdutos();
    await setarCarrinhoUser();
  }
});

watch(retrieve, (r) => {
  console.log(r.id, "retrieve id");
});
watch(carrinho, (c) => {
  console.log(c, "carrinho");
});
watch(produtos, (p) => {
  console.log(p, "produtos");
});
watch(carrinhoUser, (ca) => {
  console.log(ca, "Carrinho user");
});

function recarregarProdutos() {
  getProdutos();
}
function getProdutoImage(imagem) {
  if (!imagem || imagem === "Sem imagem" || imagem === "null") {
    return "/png-triste-erro.png";
  }

  if (imagem.startsWith("data:image")) {
    return imagem;
  }

  if (imagem.startsWith("/9j/")) return `data:image/jpeg;base64,${imagem}`;
  if (imagem.startsWith("iVBORw0KGgo"))
    return `data:image/png;base64,${imagem}`;
  if (imagem.startsWith("R0lGODlh") || imagem.startsWith("R0lGODdh"))
    return `data:image/gif;base64,${imagem}`; // GIF
  if (imagem.startsWith("UklGR")) return `data:image/webp;base64,${imagem}`;

  return `data:image/png;base64,${imagem}`;
}


async function atualizarQuantidade(item) {

  item.quantidade = Number(item.quantidade);
  carrinhoUser.value = [...carrinhoUser.value];
  try{
    const body = {
      quantidade: item.quantidade
    }
    const res = await connection.patch(`/desapega/carrinho/${retrieve?.value.id}/${item.id}`, body, 
      {headers: {
        Authorization: `Bearer ${token.value}`
      }}
    )
    if(res.status === 200 || res.status === 201){
      toast.success("Quantidade atualizada com sucesso!", {autoClose: 2000})
    }else{
      toast.error("Erro ao tentar atualizar essa quantidade", {autoClose: 2000})
    }
  }catch(err){
    toast.error(err.response?.data?.message || "Erro ao tentar atualizar essa quantidade do produto")
  }
}

function clickRemover(item){
  itemASerRemovido.value = item;
  modalConfirmacaoOpen.value = !modalConfirmacaoOpen.value
}

async function removerItem() {
  loadingRemover.value = true
  console.log(itemASerRemovido)
try{
  const res = await connection.delete(`/desapega/carrinho/${retrieve?.value.id}/${itemASerRemovido.value.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
  if(res.status === 200 || res.status === 201){
    toast.success("Item removido do carrinho!", {autoClose: 2000})
    setTimeout(() => {
      router.go(0)
    }, 2000);
  }
}catch(err){
  toast.error(err.response?.data?.message || "Erro ao remover item do carrinho!")
}finally{
  loadingRemover.value = false
}

}

function voltar() {
  router.push("/");
}

function comprar() {
  alert("Compra finalizada com sucesso! 🛒");
  router.push("/");
}
</script>

<style scoped>
@import "../css/paginaCarrinho/carrinho.css";
</style>
