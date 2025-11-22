<template>
  <v-container class="pagamento-container" fluid>
    <v-sheet class="pa-6 mx-auto" max-width="800" elevation="3" rounded="lg">
      <h2 class="text-h4 font-weight-bold mb-6 text-center">
        Confirmação de Pagamento
      </h2>

      <!-- Loading -->
      <div v-if="loadingPagamento" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-subtitle-1">Carregando detalhes do pagamento...</p>
      </div>

      <!-- Conteúdo -->
      <div v-else>
        <!-- Itens do carrinho -->
        <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
          <div class="items-list-enhanced">
            <v-sheet
              v-for="(item, index) in carrinhoUser"
              :key="index"
              class="pa-3 mb-3 d-flex align-center border rounded-lg"
            >
              <v-avatar size="80" rounded="lg" class="mr-4">
                <v-img :src="getProdutoImage(item.imagem)" alt="Imagem do Produto" cover width="80" height="80">
                  <template #error>
                    <img src="/png-triste-erro.png" alt="Imagem não disponível" style="width:100%; height:100%; object-fit:cover;" />
                  </template>
                </v-img>
              </v-avatar>

              <div class="flex-grow-1 mr-4">
                <p class="text-h6 font-weight-bold mb-1 text-truncate">{{ item.nome }}</p>
                <p class="text-body-3 text-medium-emphasis">
                  Qtd: {{ item.quantidade }}
                  <span class="mx-1">|</span>
                  Preço Unitário: R$ {{ (item.preco / 100).toFixed(2) }}
                </p>
              </div>

              <div class="text-right">
                <p class="text-h5 font-weight-bold text-success">
                  R$ {{ ((item.preco * item.quantidade) / 100).toFixed(2) }}
                </p>
                <p class="text-body-2 text-medium-emphasis">Total do Item</p>
              </div>
            </v-sheet>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between" v-if="metodoEntrega === 'entrega'">
            <span>Frete:</span>
            <span>R$ 15,00</span>
          </div>

          <div class="d-flex justify-space-between font-weight-bold mt-2">
            <span>Total:</span>
            <span>R$ {{ ((ordemCompra?.valor_total || subtotal + frete) / 100).toFixed(2) }}</span>
          </div>
        </v-sheet>

        <!-- Endereço -->
        <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
          <h3 class="text-h6 font-weight-bold mb-3">Endereço de entrega</h3>
          <v-sheet
            v-if="metodoEntrega === 'entrega' && enderecoUsuario"
            class="pa-3 text-center bg-blue-lighten-5 rounded-lg"
          >
            <v-icon color="blue" size="30">mdi-map-marker</v-icon>
            <p class="mt-2 text-body-1 font-weight-bold">
              Entrega em: {{ `${enderecoUsuario.rua}, ${enderecoUsuario.numero} - ${enderecoUsuario.cidade}, ${enderecoUsuario.estado}` }}
            </p>
          </v-sheet>
          <v-sheet v-else class="pa-3 text-center bg-red-lighten-5 rounded-lg">
            <v-icon color="red" size="30">mdi-alert-circle</v-icon>
            <p class="mt-2 text-body-1 font-weight-bold">
              Combine com o vendedor depois de efetuar o pagamento
            </p>
          </v-sheet>
        </v-sheet>

        <!-- Pagamento -->
        <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
          <h3 class="text-h6 font-weight-bold mb-3">Forma de Pagamento</h3>
          <p>{{ metodoPagamento?.toUpperCase() || "Não selecionado" }}</p>

          <!-- PIX -->
          <v-sheet v-if="isPix" class="pa-3 mt-3 text-center bg-green-lighten-5 rounded-lg">
            <v-icon color="green" size="30">mdi-qrcode</v-icon>
            <p class="mt-2 text-body-1">Pagamento instantâneo pelo Pix</p>

            <div class="my-3">
              <p class="text-caption text-grey-darken-1 mb-0">Tempo restante para pagar:</p>
              <h2 :class="{ 'text-red': timerExpirado, 'text-green-darken-2': !timerExpirado }">{{ tempoRestante }}</h2>
              <p v-if="timerExpirado" class="text-caption text-red font-weight-bold">Pedido expirado.</p>
            </div>

            <v-img v-if="pixQrCode && !timerExpirado" :src="pixQrCode" max-width="250" class="mx-auto my-2"/>
            <p v-else-if="!timerExpirado">Carregando QR Code...</p>

            <v-btn v-if="pixCopiaCodigo && !timerExpirado" small outlined color="green" @click="copiarPix">
              Copiar código Pix
            </v-btn>
          </v-sheet>

          <!-- Cartão -->
          <v-sheet v-else-if="isCartao" class="pa-3 mt-3 text-center bg-blue-lighten-5 rounded-lg">
            <v-icon color="blue" size="30">mdi-credit-card</v-icon>
            <p class="mt-2 text-body-1">Pagamento com cartão no próximo passo</p>
          </v-sheet>

          <!-- Boleto -->
          <v-sheet v-else-if="isBoleto" class="pa-3 mt-3 text-center bg-yellow-lighten-5 rounded-lg">
            <v-icon color="orange" size="30">mdi-file-document-box</v-icon>
            <p class="mt-2 text-body-1">Gerar boleto bancário</p>
            <v-btn v-if="boletoUrl" small outlined color="orange" :href="boletoUrl" target="_blank">Abrir Boleto</v-btn>
          </v-sheet>

          <!-- Outros / erro -->
          <v-sheet v-else class="pa-3 mt-3 text-center bg-red-lighten-5 rounded-lg">
            <v-icon color="red" size="30">mdi-alert-circle</v-icon>
            <p class="mt-2 text-body-1">Método de pagamento inválido. Contate o suporte.</p>
          </v-sheet>
        </v-sheet>

        <!-- Botão Cancelar -->
        <v-row class="mt-4" justify="center" align="center" dense>
          <v-col cols="12" md="6">
            <v-btn color="red" block large @click="abrirModalCancelamento" :loading="loadingCancelamento">
              Cancelar Pagamento
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-sheet>

    <!-- Modal Cancelamento -->
    <v-dialog v-model="dialogCancelar" max-width="400">
      <v-card>
        <v-card-title class="text-h5 red lighten-2 white--text">Confirmação de Cancelamento</v-card-title>
        <v-card-text class="py-4">
          Tem certeza que deseja cancelar este pagamento e pedido? O carrinho será esvaziado.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="dialogCancelar = false" :disabled="loadingCancelamento">Não, Voltar</v-btn>
          <v-btn color="red" text @click="cancelarPagamento" :loading="loadingCancelamento">Sim, Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
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
const loadingCancelamento = ref(false);
const enderecoUsuario = ref();
const ordemCompra = ref();
const retrieve = ref(null);
const metodoEntrega = ref("combinar");
const pixQrCode = ref(null);
const boletoUrl = ref(null);
const pixCopiaCodigo = ref(null);
const statusPagamentoId = ref(null);
const dialogCancelar = ref(false);

const frete = computed(() => metodoEntrega.value.toLowerCase() === "entrega" ? 1500 : 0);

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

function getProdutoImage(imagem) {
  if (!imagem || imagem === "Sem imagem" || imagem === "null") return "/png-triste-erro.png";
  if (imagem.startsWith("data:image")) return imagem;
  if (imagem.startsWith("/9j/")) return `data:image/jpeg;base64,${imagem}`;
  if (imagem.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${imagem}`;
  return `data:image/png;base64,${imagem}`;
}


async function getPagamento() {
  loadingPagamento.value = true;
  try {
    // 1. Pagamento do usuário
    const res = await connection.get(`/desapega/pagamentos/usuario/${retrieve?.value.id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const pagamento = res.data;
    statusPagamentoId.value = pagamento.status_pagamento_id;

    // 2. Buscar formas de pagamento
    const resFormas = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const formas = resFormas.data; // array de { id, forma, status }
    const formaSelecionada = formas.find(f => f.id === pagamento.forma_pagamento_id);
    metodoPagamento.value = formaSelecionada?.forma?.toLowerCase() || "outro";

    // PIX
    if (isPix.value) {
      pixCopiaCodigo.value = pagamento.pix_copia_codigo || null;
      pixQrCode.value = pagamento.pix_qr_code || null;
      if (pagamento.expiracao) iniciarContagemRegressiva(new Date(pagamento.expiracao));
      iniciarPollingStatus();
    }

    // Boleto
    if (isBoleto.value) boletoUrl.value = pagamento.boleto_url || null;

    // Status pago
    if (pagamento.status_pagamento_id === 2) router.push({ name: 'PagamentoSucesso' });

  } catch (err) {
    console.error("Erro ao buscar pagamento:", err);
    toast.error("Erro ao carregar dados do pagamento");
  } finally {
    loadingPagamento.value = false;
  }
}


// Timer Pix
const tempoRestante = ref("15:00");
const timerExpirado = ref(false);
let intervaloTimer = null;
function iniciarContagemRegressiva(expiracaoISO) {
  const fim = new Date(expiracaoISO).getTime();
  intervaloTimer = setInterval(() => {
    const distancia = fim - Date.now();
    if (distancia <= 0) {
      clearInterval(intervaloTimer);
      tempoRestante.value = "00:00";
      timerExpirado.value = true;
      if (isPix.value && !loadingCancelamento.value) cancelarPagamento();
      return;
    }
    const minutos = Math.floor((distancia / 1000 / 60) % 60);
    const segundos = Math.floor((distancia / 1000) % 60);
    tempoRestante.value = `${String(minutos).padStart(2,"0")}:${String(segundos).padStart(2,"0")}`;
  }, 1000);
}

// Polling de status
let pollingInterval = null;
const POLLING_DELAY_MS = 5000;
function iniciarPollingStatus() {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(checarStatusPagamento, POLLING_DELAY_MS);
}

async function checarStatusPagamento() {
  try {
    const res = await connection.get(`/desapega/pagamentos/usuario/${retrieve?.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
    const pagamento = res.data;
    if (pagamento.status_pagamento_id === 2) {
      clearInterval(pollingInterval);
      router.push({ name: 'PagamentoSucesso' });
    }
    if (pagamento.status_pagamento_id === 4) clearInterval(pollingInterval);
  } catch (err) {
    console.error("Erro polling pagamento:", err);
    clearInterval(pollingInterval);
  }
}

// Cancelamento
function abrirModalCancelamento() { dialogCancelar.value = true; }
async function cancelarPagamento() {
  if (!ordemCompra.value) return;
  try {
    loadingCancelamento.value = true;
    dialogCancelar.value = false;
    await connection.delete(`/desapega/pagamentos/usuario/${retrieve?.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
    toast.success("Pagamento cancelado com sucesso.");
    metodoPagamento.value = "";
    pixQrCode.value = null;
    pixCopiaCodigo.value = null;
    boletoUrl.value = null;
    setTimeout(() => router.push("/carrinho"), 1000);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Erro ao cancelar pagamento.");
  } finally {
    loadingCancelamento.value = false;
  }
}

// Copiar Pix
function copiarPix() {
  if (!pixCopiaCodigo.value) return toast.error("Código Pix não encontrado.");
  navigator.clipboard.writeText(pixCopiaCodigo.value);
  toast.success("Código Pix copiado!");
}

// ------------------- Montagem inicial -------------------
onMounted(async () => {
  if (!tokenExiste.value) return router.push("/");

  loadingPagamento.value = true;
  try {
    const resUser = await connection.get("/desapega/usuarios/retrieve", { headers: { Authorization: `Bearer ${token.value}` } });
    retrieve.value = resUser.data;

    const resCarrinho = await connection.get(`/desapega/carrinho/${retrieve.value.id}`);
    const carrinhoBackend = resCarrinho.data;

    const resProdutos = await connection.get("/desapega/produtos?status=ativo");
    const produtos = resProdutos.data.produtos;

    carrinhoUser.value = carrinhoBackend
      .map(item => {
        const produto = produtos.find(p => p.id === item.produto_id);
        return produto ? { ...produto, quantidade: item.quantidade } : null;
      })
      .filter(Boolean);

    subtotal.value = carrinhoUser.value.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    // Endereço e ordem
    const resEndereco = await connection.get(`/desapega/enderecos/${retrieve.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
    enderecoUsuario.value = resEndereco.data;

    const resOrdem = await connection.get(`/desapega/ordemCompra/usuario/${retrieve.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
    ordemCompra.value = resOrdem.data;
    metodoEntrega.value = ordemCompra.value.metodo_entrega || "combinar";

    await getPagamento();
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao carregar dados do pagamento");
  } finally {
    loadingPagamento.value = false;
  }
});

// Cleanup
onUnmounted(() => {
  if (intervaloTimer) clearInterval(intervaloTimer);
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
@import "../css/paginaPagamento/pagamento.css";
</style>
