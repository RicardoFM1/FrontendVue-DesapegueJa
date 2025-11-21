ta falatando um elemento aqui?
<template>
  <v-container class="pagamento-container" fluid>
    <v-sheet class="pa-6 mx-auto" max-width="800" elevation="3" rounded="lg">
      <h2 class="text-h4 font-weight-bold mb-6 text-center">Confirmação de Pagamento</h2>

   
<v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
  <h3 class="text-h6 font-weight-bold mb-3">Resumo do Pedido</h3>
  <v-list>
    <v-list-item v-for="(item, index) in carrinhoUser" :key="index">
      <v-list-item-avatar>
        <v-img width="400px" height="200px" :src="getProdutoImage(item.imagem)" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ item.nome }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ item.quantidade }} x R$ {{ (item.preco / 100).toFixed(2) }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <span class="font-weight-bold">
          R$ {{ ((item.preco * item.quantidade) / 100).toFixed(2) }}
        </span>
      </v-list-item-action>
    </v-list-item>
  </v-list>

  <v-divider class="my-3"></v-divider>


  <div class="d-flex justify-space-between" v-if="metodoEntrega === 'entrega'">
    <span>Frete:</span>
    <span>R$ 15,00</span>
  </div>

  <div class="d-flex justify-space-between font-weight-bold mt-2">
    <span>Total:</span>
    <span>R$ {{ (ordemCompra?.valor_total / 100).toFixed(2) || "0.00" }}</span>
  </div>
</v-sheet>



      
<!-- Método de Entrega destacado -->
<v-sheet v-if="metodoEntrega === 'combinar'" class="pa-3 mt-3 text-center bg-red-lighten-5 rounded-lg">
  <v-icon color="red" size="30">mdi-alert-circle</v-icon>
  <p class="mt-2 text-body-1 font-weight-bold">
    Combine com o vendedor depois de efetuar o pagamento
  </p>
</v-sheet>

    
    
<v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
  <h3 class="text-h6 font-weight-bold mb-3">Endereço de entrega</h3>

  <v-sheet v-if="metodoEntrega === 'entrega'" class="pa-3 text-center bg-blue-lighten-5 rounded-lg">
    <v-icon color="blue" size="30">mdi-map-marker</v-icon>
    <p class="mt-2 text-body-1 font-weight-bold">
      Entrega em: 
      {{ enderecoUsuario ? `${enderecoUsuario.rua}, ${enderecoUsuario.numero} - ${enderecoUsuario.cidade}, ${enderecoUsuario.estado}` : 'Carregando endereço...' }}
    </p>
  </v-sheet>

  <v-sheet v-else-if="metodoEntrega === 'combinar'" class="pa-3 text-center bg-red-lighten-5 rounded-lg">
    <v-icon color="red" size="30">mdi-alert-circle</v-icon>
    <p class="mt-2 text-body-1 font-weight-bold">
      Combine com o vendedor depois de efetuar o pagamento
    </p>
  </v-sheet>
</v-sheet>



<v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
  <h3 class="text-h6 font-weight-bold mb-3">Forma de Pagamento</h3>
  <p>{{ metodoPagamento?.toUpperCase() || "Não selecionado" }}</p>

  <v-sheet v-if="isPix" class="pa-3 mt-3 text-center bg-green-lighten-5 rounded-lg">
    <v-icon color="green" size="30">mdi-qrcode</v-icon>
    <p class="mt-2 text-body-1">Pagamento instantâneo pelo Pix</p>
  </v-sheet>

  <v-sheet v-else-if="isCartao" class="pa-3 mt-3 text-center bg-blue-lighten-5 rounded-lg">
    <v-icon color="blue" size="30">mdi-credit-card</v-icon>
    <p class="mt-2 text-body-1">Pagamento com cartão no próximo passo</p>
  </v-sheet>

  <v-sheet v-else-if="isBoleto" class="pa-3 mt-3 text-center bg-yellow-lighten-5 rounded-lg">
    <v-icon color="orange" size="30">mdi-file-document-box</v-icon>
    <p class="mt-2 text-body-1">Gerar boleto bancário</p>
  </v-sheet>

  <v-sheet v-else class="pa-3 mt-3 text-center bg-red-lighten-5 rounded-lg">
    <v-icon color="red" size="30">mdi-alert-circle</v-icon>
    <p class="mt-2 text-body-1">Método de pagamento inválido. Contate o suporte.</p>
  </v-sheet>
</v-sheet>

    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { connection } from "@/connection/axiosConnection";

const router = useRouter();
const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

const carrinhoUser = ref([]);
const subtotal = ref(0);
const metodoPagamento = ref("");
const loadingPagamento = ref(false);
const enderecoUsuario = ref();
const ordemCompra = ref();
const retrieve = ref(null);
const metodoEntrega = ref("combinar");
const formaPagamento = ref(null);


const frete = computed(() => (metodoEntrega.value.toLowerCase() === "entrega" ? 1500 : 0));
const totalComFrete = computed(() => subtotal.value + frete.value);


const metodoPagamentoNormalizado = computed(() => {
  if (!metodoPagamento.value) return null;
  const mp = metodoPagamento.value.toString().trim().toLowerCase(); 
  if (["pix", "cartao", "boleto"].includes(mp)) return mp;
  return "outro";
});


const isPix = computed(() => metodoPagamentoNormalizado.value === "pix");
const isCartao = computed(() => metodoPagamentoNormalizado.value === "cartao");
const isBoleto = computed(() => metodoPagamentoNormalizado.value === "boleto");
const isOutro = computed(() => metodoPagamentoNormalizado.value === "outro");

function getProdutoImage(imagem) {
  if (!imagem || imagem === "Sem imagem" || imagem === "null") return "/png-triste-erro.png";
  if (imagem.startsWith("data:image")) return imagem;
  if (imagem.startsWith("/9j/")) return `data:image/jpeg;base64,${imagem}`;
  if (imagem.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${imagem}`;
  return `data:image/png;base64,${imagem}`;
}

async function getEndereco() {
  try {
    const res = await connection.get(`/desapega/enderecos/${retrieve?.value.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    enderecoUsuario.value = res.data;
  } catch {
    enderecoUsuario.value = null;
  }
}

async function getOrdemCompra() {
  try {
    const res = await connection.get(`/desapega/ordemCompra/usuario/${retrieve?.value.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    ordemCompra.value = res.data;
    metodoEntrega.value = res.data.metodo_entrega || "combinar";
    console.log(res.data)
  } catch {
    ordemCompra.value = null;
  }
}



async function getPagamento() {
  try {

    const resPagamentos = await connection.get(`/desapega/pagamentos/usuario${retrieve?.value.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

   
    const pagamentoOrdem = resPagamentos.data.find(
      (p) => p.ordem_id === ordemCompra.value?.id
    );

    if (!pagamentoOrdem) {
      metodoPagamento.value = null;
      formaPagamento.value = null;
      return;
    }

    
    const resFormas = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

   
    const forma = resFormas.data.find(
      (f) => f.id === pagamentoOrdem.forma_pagamento_id
    );

    if (forma && forma.nome) {
      formaPagamento.value = forma.nome; 
      metodoPagamento.value = forma.nome.toLowerCase();
    } else {
      formaPagamento.value = "outro";
      formaPagamento.value = null;
    }
  } catch (err) {
    console.error("Erro ao buscar pagamento/formas", err);
    metodoPagamento.value = "outro";
    formaPagamento.value = null;
  }
}



onMounted(async () => {
  if (!tokenExiste.value) return router.push("/");

  try {
    const resUser = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    retrieve.value = resUser.data;

    const resCarrinho = await connection.get(`/desapega/carrinho/${retrieve.value.id}`);
    const carrinhoBackend = resCarrinho.data;

    const resProdutos = await connection.get("/desapega/produtos?status=ativo");
    const produtos = resProdutos.data.produtos;

    carrinhoUser.value = carrinhoBackend
      .map((item) => {
        const produto = produtos.find((p) => p.id === item.produto_id);
        return produto ? { ...produto, quantidade: item.quantidade } : null;
      })
      .filter(Boolean);

    subtotal.value = carrinhoUser.value.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao carregar dados do pagamento");
  }

  await getEndereco();
  await getOrdemCompra();
  await getPagamento();
});
</script>

<style scoped>
@import "../css/paginaPagamento/pagamento.css";
</style>
