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


  <v-sheet class="pa-4 mt-4" rounded="lg" elevation="2">
    <h3 class="text-h6 mb-3 font-weight-bold">Método de Entrega</h3>

    <v-radio-group v-model="metodoEntrega">
      <v-radio label="Retirar na loja" value="retirada"></v-radio>
      <v-radio label="Entrega" value="entrega"></v-radio>
    </v-radio-group>

    <v-expand-transition>
      <div v-if="metodoEntrega === 'retirada'" class="mt-3">
        <v-sheet elevation="4" rounded="lg">
          <iframe
            width="100%"
            height="200"
            style="border:0; border-radius: 8px;"
            loading="lazy"
            allowfullscreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.305191864881!2d-46.662325!3d-23.558097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c81507ad4b%3A0x9f7f0a9e5a84f36f!2sPaulista!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
          ></iframe>
        </v-sheet>
      </div>
    </v-expand-transition>
  </v-sheet>


 <v-sheet class="pa-4 mt-4" rounded="lg" elevation="2">
  <h3 class="text-h6 mb-3 font-weight-bold">Forma de Pagamento</h3>

  
  <v-radio-group
    v-if="formasPagamento.length"
    v-model="metodoPagamento"
  >
  <v-radio
  v-for="forma in formasPagamento"
  :key="forma.id"
  :label="forma.forma"
  :value="forma.forma"
/>

  </v-radio-group>


  <div v-else>
    <p>Não há formas de pagamento disponíveis no momento.</p>
  </div>


 <v-expand-transition>
  <v-sheet
    v-if="metodoPagamento?.toLowerCase() === 'pix'"
    class="pa-3 mt-3 text-center bg-green-lighten-5"
    rounded="lg"
  >
    <v-icon color="green" size="30">mdi-qrcode</v-icon>
    <p class="mt-2 text-body-1">Pagamento instantâneo pelo Pix</p>
  </v-sheet>
</v-expand-transition>



  <v-expand-transition>
    <v-sheet
      v-if="metodoPagamento && metodoPagamento.toLowerCase() === 'cartao'"
      class="pa-3 mt-3 text-center bg-blue-lighten-5"
      rounded="lg"
    >
      <v-icon color="blue" size="30">mdi-credit-card</v-icon>
      <p class="mt-2 text-body-1">Pagamento com cartão no próximo passo</p>
    </v-sheet>
  </v-expand-transition>
</v-sheet>



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
import Pagamento from "../pagamento/pagamento.vue";


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
const metodoEntrega = ref("retirada");
const formasPagamento = ref([]);


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
    await setarCarrinhoUser()
    await carregarFormasPagamento();
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
function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const metodoPagamento = ref(''); 


async function carregarFormasPagamento() {
  try {
    const res = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` },
      timeout: 10000
    });

    if (res?.data && Array.isArray(res.data)) {
    formasPagamento.value = res.data.filter(f => f.status === "ativo" && f.forma);

if (formasPagamento.value.length > 0) {
  metodoPagamento.value = formasPagamento.value[0].forma;
}

    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao buscar formas de pagamento");
  }
}




async function comprar() {
  if (!carrinhoUser.value.length) {
    toast.error("Seu carrinho está vazio");
    return;
  }

  try {
 
    const resStatusOrdem = await connection.get("/desapega/statusOrdem", {
      headers: { Authorization: `Bearer ${token.value}` },
      timeout: 10000 
    });

    if (!resStatusOrdem?.data || !Array.isArray(resStatusOrdem.data)) {
      toast.error("Não foi possível buscar status de ordem");
      return;
    }

    const statusOrdemPendente = resStatusOrdem.data.find(
      s => s.descricao?.toLowerCase() === "pendente" && s.status === "ativo"
    );

    if (!statusOrdemPendente) {
      toast.error("Status de ordem 'pendente' não encontrado");
      return;
    }


    const ordemBody = {
      usuario_id: retrieve.value.id,
      status_ordem_id: statusOrdemPendente.id,
      valor_total: subtotal.value
    };

    const resOrdem = await connection.post("/desapega/ordemCompra", ordemBody, {
      headers: { Authorization: `Bearer ${token.value}` },
      timeout: 10000
    });

    if (!resOrdem?.data?.id) {
      toast.error("Erro ao criar ordem de compra");
      return;
    }

    const ordemId = resOrdem.data.id;


    await Promise.all(
      carrinhoUser.value.map(item => {
        const itemBody = {
          ordem_id: ordemId,
          produto_id: item.id,
          quantidade: item.quantidade,
          preco_unitario: item.preco
        };
        return connection.post("/desapega/ordemProduto", itemBody, {
          headers: { Authorization: `Bearer ${token.value}` },
          timeout: 10000
        });
      })
    );

  
    const resFormaPagamento = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` },
      timeout: 10000
    });

    if (!resFormaPagamento?.data || !Array.isArray(resFormaPagamento.data)) {
      toast.error("Não foi possível buscar formas de pagamento");
      return;
    }

  const formaPagamentoSelecionada = resFormaPagamento.data.find(
  f => (f.forma || '').toLowerCase() === (metodoPagamento.value || '').toLowerCase()
);



    if (!formaPagamentoSelecionada) {
      toast.error("Forma de pagamento inválida");
      return;
    }
const resStatusPagamento = await connection.get("/desapega/statusPagamento", {
  headers: { Authorization: `Bearer ${token.value}` },
  timeout: 10000
});

if (!resStatusPagamento?.data || !Array.isArray(resStatusPagamento.data)) {
  toast.error("Não foi possível buscar status de pagamento");
  return;
}

const statusPagamentoPendente = resStatusPagamento.data.find(
  s => s.descricao?.toLowerCase() === "pendente" && s.status === "ativo"
);

if (!statusPagamentoPendente) {
  toast.error("Status de pagamento 'pendente' não encontrado");
  return;
}

 
   const pagamentoBody = {
  ordem_id: ordemId,
  usuario_id: retrieve?.value.id,
  forma_pagamento_id: formaPagamentoSelecionada.id,
  status_pagamento_id: statusPagamentoPendente.id,
  valor: subtotal.value,
   observacao: ""
};


    const resPagamento = await connection.post("/desapega/pagamentos", pagamentoBody, {
      headers: { Authorization: `Bearer ${token.value}` },
      timeout: 10000
    });

    if (!resPagamento?.data?.id) {
      toast.error("Erro ao criar registro de pagamento");
      return;
    }


    const uuid = generateUUID();
    router.push(`/pagamento/${uuid}`);

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Erro ao processar compra");
  }
}




</script>

<style scoped>
@import "../css/paginaCarrinho/carrinho.css";
</style>
