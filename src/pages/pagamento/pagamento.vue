<template>
  <v-container class="pagamento-container" fluid>
    <v-sheet class="pa-6 mx-auto" max-width="800" elevation="3" rounded="lg">
      <h2 class="text-h4 font-weight-bold mb-6 text-center">Confirmação de Pagamento</h2>

      <!-- Resumo do Pedido -->
      <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
        <h3 class="text-h6 font-weight-bold mb-3">Resumo do Pedido</h3>
        <v-list>
          <v-list-item v-for="(item, index) in carrinhoUser" :key="index">
            <v-list-item-avatar>
              <v-img :src="getProdutoImage(item.imagem)" />
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
        <div class="d-flex justify-space-between">
          <span>Subtotal:</span>
          <span>R$ {{ (subtotal / 100).toFixed(2) }}</span>
        </div>
        <div class="d-flex justify-space-between" v-if="metodoEntrega === 'entrega'">
          <span>Frete:</span>
          <span>R$ 15,00</span>
        </div>
        <div class="d-flex justify-space-between font-weight-bold mt-2">
          <span>Total:</span>
          <span>R$ {{ (totalComFrete / 100).toFixed(2) }}</span>
        </div>
      </v-sheet>

      <!-- Método de Entrega -->
      <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
        <h3 class="text-h6 font-weight-bold mb-3">Método de Entrega</h3>
        <p class="mb-2">
          {{ metodoEntrega === 'retirada' ? 'Retirada na loja' : 'Entrega em endereço informado' }}
        </p>
        <v-sheet v-if="metodoEntrega === 'retirada'" class="pa-3 text-center bg-blue-lighten-5 rounded-lg">
          <v-icon color="blue" size="30">mdi-map-marker</v-icon>
          <p class="mt-2 text-body-1">
            Local de retirada: Senac Santa Cruz do Sul, RS, Brasil
          </p>
        </v-sheet>
      </v-sheet>

      <!-- Forma de Pagamento -->
      <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
        <h3 class="text-h6 font-weight-bold mb-3">Forma de Pagamento</h3>
        <p>
          {{ metodoPagamento?.toUpperCase() || "Não selecionado" }}
        </p>
        <v-sheet v-if="metodoPagamento?.toLowerCase() === 'pix'" class="pa-3 mt-3 text-center bg-green-lighten-5 rounded-lg">
          <v-icon color="green" size="30">mdi-qrcode</v-icon>
          <p class="mt-2 text-body-1">Pagamento instantâneo pelo Pix</p>
        </v-sheet>
        <v-sheet v-if="metodoPagamento?.toLowerCase() === 'cartao'" class="pa-3 mt-3 text-center bg-blue-lighten-5 rounded-lg">
          <v-icon color="blue" size="30">mdi-credit-card</v-icon>
          <p class="mt-2 text-body-1">Pagamento com cartão no próximo passo</p>
        </v-sheet>
      </v-sheet>

      <!-- Botão de Confirmar -->
      <div class="text-center">
        <v-btn color="primary" class="px-8" @click="finalizarPagamento" :loading="loadingPagamento">
          Confirmar Pagamento
        </v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { connection } from "@/connection/axiosConnection";

// ------------------------
// REFS E ESTADOS
// ------------------------
const router = useRouter();
const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

const carrinhoUser = ref([]);
const subtotal = ref(0);
const totalComFrete = ref(0);
const metodoEntrega = ref("retirada");
const metodoPagamento = ref("");
const loadingPagamento = ref(false);

const retrieve = ref(null);

// ------------------------
// FUNÇÕES AUXILIARES
// ------------------------
function getProdutoImage(imagem) {
  if (!imagem || imagem === "Sem imagem" || imagem === "null") return "/png-triste-erro.png";
  if (imagem.startsWith("data:image")) return imagem;
  if (imagem.startsWith("/9j/")) return `data:image/jpeg;base64,${imagem}`;
  if (imagem.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${imagem}`;
  return `data:image/png;base64,${imagem}`;
}

function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return r.toString(16);
  });
}

// ------------------------
// INICIALIZAÇÃO
// ------------------------
onMounted(async () => {
  if (!tokenExiste.value) return router.push("/");

  try {
    // Buscar usuário
    const resUser = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    retrieve.value = resUser.data;

    // Buscar carrinho do usuário
    const resCarrinho = await connection.get(`/desapega/carrinho/${retrieve.value.id}`);
    const carrinhoBackend = resCarrinho.data;

    // Buscar produtos ativos
    const resProdutos = await connection.get("/desapega/produtos?status=ativo");
    const produtos = resProdutos.data.produtos;

    // Montar carrinho completo
    carrinhoUser.value = carrinhoBackend.map(item => {
      const produto = produtos.find(p => p.id === item.produto_id);
      return produto ? { ...produto, quantidade: item.quantidade } : null;
    }).filter(Boolean);

    // Calcular subtotal e total com frete
    subtotal.value = carrinhoUser.value.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    totalComFrete.value = subtotal.value + (metodoEntrega.value === 'entrega' ? 1500 : 0);

    // Carregar formas de pagamento
    const resFormas = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    const formas = resFormas.data.filter(f => f.status === "ativo" && f.forma);
    if (formas.length) metodoPagamento.value = formas[0].forma;

  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao carregar dados do pagamento");
  }
});

// ------------------------
// FINALIZAR PAGAMENTO
// ------------------------
async function finalizarPagamento() {
  if (!carrinhoUser.value.length) {
    toast.error("Seu carrinho está vazio!");
    return;
  }

  loadingPagamento.value = true;
  try {
    // Buscar status de ordem pendente
    const resStatusOrdem = await connection.get("/desapega/statusOrdem", { headers: { Authorization: `Bearer ${token.value}` } });
    const statusOrdem = resStatusOrdem.data.find(s => s.descricao.toLowerCase() === "pendente");

    // Criar ordem
    const resOrdem = await connection.post("/desapega/ordemCompra", {
      usuario_id: retrieve.value.id,
      status_ordem_id: statusOrdem.id,
      valor_total: subtotal.value,
      metodo_entrega: metodoEntrega.value
    }, { headers: { Authorization: `Bearer ${token.value}` } });

    const ordemId = resOrdem.data.id;

    // Adicionar produtos à ordem
    await Promise.all(carrinhoUser.value.map(item => connection.post("/desapega/ordemProduto", {
      ordem_id: ordemId,
      produto_id: item.id,
      quantidade: item.quantidade,
      preco_unitario: item.preco
    }, { headers: { Authorization: `Bearer ${token.value}` } })));

    // Buscar status de pagamento pendente
    const resStatusPagamento = await connection.get("/desapega/statusPagamento", { headers: { Authorization: `Bearer ${token.value}` } });
    const statusPagamento = resStatusPagamento.data.find(s => s.descricao.toLowerCase() === "pendente");

    // Criar registro de pagamento
    await connection.post("/desapega/pagamentos", {
      ordem_id: ordemId,
      usuario_id: retrieve.value.id,
      forma_pagamento_id: 1, // substitua pelo id correto do metodoPagamento
      status_pagamento_id: statusPagamento.id,
      valor: subtotal.value,
      observacao: ""
    }, { headers: { Authorization: `Bearer ${token.value}` } });

    // Redirecionar para página final de pagamento
    router.push(`/pagamento/${generateUUID()}`);
    toast.success("Pagamento realizado com sucesso!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao processar pagamento");
  } finally {
    loadingPagamento.value = false;
  }
}
</script>

<style scoped>
.pagamento-container {
  padding-top: 40px;
  padding-bottom: 40px;
}
</style>
