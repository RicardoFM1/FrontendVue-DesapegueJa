<template>
  <v-container v-if="tokenExiste" class="pagamento-container" fluid>
    <v-sheet class="pa-4 pa-sm-6 mx-auto" max-width="900" elevation="6" rounded="xl">
      <h2 class="text-h5 text-sm-h4 font-weight-bold mb-6 text-center text-primary">
        💰 Confirmação de Pagamento
      </h2>

      <div v-if="loadingPagamento" class="text-center pa-6">
        <v-skeleton-loader type="image, heading, paragraph" class="mb-4" />
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        <p class="mt-4 text-subtitle-1 text-medium-emphasis">Carregando detalhes do pedido e pagamento...</p>
      </div>

      <div v-else>
        <div class="mb-6">
          <v-alert
            v-if="statusPagamento === STATUS.pendente"
            variant="tonal"
            border="start"
            border-color="info"
            color="info"
            class="d-flex align-center pa-3"
          >
            <div class="mr-3">
              <v-icon size="28">mdi-timer-sand</v-icon>
            </div>
            <div class="flex-grow-1">
              <span class="font-weight-medium">Aguardando confirmação do pagamento.</span>
              <div class="text-caption text-medium-emphasis">Atualização automática em curso...</div>
            </div>
            <v-btn 
              icon 
              size="small" 
              variant="text" 
              @click="checarStatusPagamento" 
              :disabled="loadingPolling" 
              title="Atualizar agora"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-alert>

          <v-alert
            v-else-if="statusPagamento === STATUS.pago"
            variant="tonal"
            border="start"
            border-color="success"
            color="success"
            class="d-flex align-center pa-3"
          >
            <v-icon class="mr-3" size="28">mdi-check-circle</v-icon>
            <span class="font-weight-medium">Pagamento confirmado!</span> Redirecionando...
          </v-alert>

          <v-alert
            v-else-if="statusPagamento === STATUS.rejeitado || statusPagamento === STATUS.erro"
            variant="tonal"
            border="start"
            border-color="error"
            color="error"
            class="d-flex align-center pa-3"
          >
            <v-icon class="mr-3" size="28">mdi-alert-circle</v-icon>
            <span class="font-weight-medium">Pagamento não autorizado.</span> Verifique com seu banco ou tente novamente.
          </v-alert>

          <v-alert
            v-else-if="timerExpirado"
            variant="tonal"
            border="start"
            border-color="warning"
            color="warning"
            class="d-flex align-center pa-3"
          >
            <v-icon class="mr-3" size="28">mdi-clock-alert</v-icon>
            <span class="font-weight-medium">O tempo para pagamento expirou.</span> Gere um novo pedido ou volte ao carrinho.
          </v-alert>
        </div>

        <v-row dense>
          <v-col cols="12" md="6">
            <v-sheet class="pa-4" rounded="lg" elevation="2">
              <h3
                class="text-h6 font-weight-bold mb-3 d-flex align-center"
                :class="{
                  'text-green-darken-2': isPix,
                  'text-blue-darken-2': isCartao,
                  'text-orange-darken-2': isBoleto
                }"
              >
                <v-icon :color="isPix ? 'green' : (isCartao ? 'blue' : 'orange')" class="mr-2">
                  {{ isPix ? 'mdi-qrcode-scan' : (isCartao ? 'mdi-credit-card' : 'mdi-barcode') }}
                </v-icon>
                Método de Pagamento
              </h3>
              
              <v-divider class="mb-4"></v-divider>

              <p class="text-subtitle-1 font-weight-medium mb-4">
                 Método: <span class="text-uppercase">{{ metodoPagamento || "Não Selecionado" }}</span>
              </p>

              <v-sheet v-if="isPix" class="pa-3 mt-3 text-center bg-green-lighten-5 rounded-lg">
                <v-icon color="green" size="40">mdi-qrcode-scan</v-icon>
                <p class="mt-2 text-body-1 font-weight-medium text-green-darken-2">Pagamento Instantâneo</p>

                <v-progress-linear
                  v-if="!timerExpirado"
                  :model-value="percentualRestante"
                  height="8"
                  color="green"
                  rounded
                  class="my-3"
                />

                <div class="my-3">
                  <p class="text-caption text-grey-darken-1 mb-0">Tempo restante para pagar:</p>
                  <h3 :class="{ 'text-red': timerExpirado, 'text-green-darken-2': !timerExpirado }" class="text-h4 font-weight-bold">
                    {{ tempoRestante }}
                  </h3>
                </div>

                <transition name="fade" mode="out-in">
                  <div v-if="pixQrCode" key="qr-loaded" class="text-center mb-2">
                    <img :src="pixQrCode" alt="QR Code PIX" width="200" class="elevation-4 rounded-lg" />
                    <p class="mt-3 text-caption text-medium-emphasis">Aguardando confirmação do pagamento...</p>
                  </div>
                  <div v-else-if="!timerExpirado" key="qr-loading" class="text-center mb-2">
                    <v-skeleton-loader type="image" width="200" class="mx-auto" />
                    <p class="mt-3 text-caption">Carregando QR Code...</p>
                  </div>
                  <div v-else key="qr-expired" class="text-center mb-2 text-error">
                    <v-icon size="48">mdi-alert-circle</v-icon>
                    <p class="mt-3 text-subtitle-1 font-weight-medium">Tempo expirado. Gere outro QR Code.</p>
                  </div>
                </transition>

                <v-row>
                  <v-col>

                    <v-btn
                    v-if="pixCopiaCodigo && !timerExpirado"
                  size="large"
                  variant="flat"
                    color="green"
                    block
                    @click="copiarPix"
                  >
                    <template v-if="!copiado">
                      <v-icon left>mdi-content-copy</v-icon> Copiar código Pix
                    </template>
                    <template v-else>
                      <v-icon left>mdi-check</v-icon> Código Copiado!
                    </template>
                  </v-btn>
                    </v-col>

                    <v-col>

                      <v-btn
                      v-if="!timerExpirado"
                      size="large"
                      block
                    variant="tonal"
                    color="blue"
                    @click="checarStatusPagamento"
                    :loading="loadingPolling"
                  >
                  <v-icon left>mdi-refresh</v-icon> Atualizar status
                </v-btn>
              </v-col>
            
            </v-row>

                <div v-if="timerExpirado" class="mt-4 d-flex flex-column flex-sm-row justify-center gap-3">
                  <v-btn color="primary" @click="router.push('/carrinho')" size="large" class="mb-2 mb-sm-0">
                    Voltar ao carrinho
                  </v-btn>
                  <v-btn color="secondary" variant="outlined" @click="router.push('/')" size="large" class="ml-sm-2">
                    Continuar navegando
                  </v-btn>
                </div>
              </v-sheet>

              <v-sheet v-else-if="isCartao" class="pa-3 mt-3 text-center bg-blue-lighten-5 rounded-lg">
                <v-icon color="blue" size="40">mdi-credit-card</v-icon>
                <p class="mt-2 text-body-1 font-weight-medium text-blue-darken-2">Pagamento com Cartão de Crédito/Débito</p>
                <p class="text-caption mt-1">Detalhes do pagamento serão exibidos ou solicitados no próximo passo seguro.</p>
              </v-sheet>

              <v-sheet v-else-if="isBoleto" class="pa-3 mt-3 text-center bg-orange-lighten-5 rounded-lg">
                <v-icon color="orange" size="40">mdi-file-document-box</v-icon>
                <p class="mt-2 text-body-1 font-weight-medium text-orange-darken-2">Pagamento via Boleto Bancário</p>
                <v-btn v-if="boletoUrl" size="large" variant="flat" color="orange" :href="boletoUrl" target="_blank" class="mt-3">
                  <v-icon left>mdi-open-in-new</v-icon> Abrir Boleto
                </v-btn>
              </v-sheet>

              <v-sheet v-else class="pa-3 mt-3 text-center bg-red-lighten-5 rounded-lg">
                <v-icon color="red" size="40">mdi-alert-circle</v-icon>
                <p class="mt-2 text-body-1 font-weight-medium">Método de pagamento inválido.</p>
              </v-sheet>
            </v-sheet>
          </v-col>

          <v-col cols="12" md="6">
            <v-sheet class="mb-4 pa-4" rounded="lg" elevation="2">
              <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center text-secondary">
                <v-icon class="mr-2">mdi-cart</v-icon>
                Itens do Pedido
              </h3>
              
             <div class="items-list-enhanced">
  <v-sheet
    v-for="(item, index) in carrinhoUser"
    :key="index"
    class="pa-3 mb-3 border rounded-lg"
    :class="{
      'border-opacity-100': index % 2 === 0, 
      'border-opacity-75': index % 2 !== 0,
      'd-flex flex-column flex-sm-row align-sm-center': true 
    }"
  >
    <v-avatar size="64" rounded="lg" class="mr-sm-4 mb-3 mb-sm-0 flex-shrink-0">
      <v-img :src="getProdutoImage(item.imagem)" alt="Imagem do Produto" cover>
        <template #error>
          <v-icon size="40" color="grey-lighten-1">mdi-image-off</v-icon>
        </template>
      </v-img>
    </v-avatar>

    <div class="flex-grow-1 mr-sm-4 mb-3 mb-sm-0">
      <p class="text-subtitle-1 font-weight-bold mb-1 text-truncate">{{ item.nome }}</p>
      <p class="text-body-2 text-medium-emphasis">
        Qtd: {{ item.quantidade }} <span class="mx-1">|</span> R$ {{ (item.preco / 100).toFixed(2) }} (un.)
      </p>
    </div>

    <div class="text-left text-sm-right flex-shrink-0 pt-2 pt-sm-0 border-t border-t-sm-0 w-100 w-sm-auto">
      <p class="text-h6 font-weight-bold text-success">
        R$ {{ ((item.preco * item.quantidade) / 100).toFixed(2) }}
      </p>
      <p class="text-caption text-medium-emphasis">Total do Item</p>
    </div>
  </v-sheet>
</div>
              <v-divider class="my-3"></v-divider>

              <div class="d-flex justify-space-between text-body-1" v-if="metodoEntrega === 'entrega'">
                <span>Frete:</span>
                <span class="font-weight-medium">R$ 15,00</span>
              </div>

              <div class="d-flex justify-space-between text-h6 font-weight-bold mt-2 pt-2 border-t">
                <span>TOTAL A PAGAR:</span>
                <span class="text-primary">R$ {{ ((ordemCompra?.valor_total || subtotal + frete) / 100).toFixed(2) }}</span>
              </div>
            </v-sheet>

            <v-sheet class="pa-4" rounded="lg" elevation="2">
              <h3 class="text-h6 font-weight-bold mb-3 d-flex align-center">
                <v-icon class="mr-2">mdi-map-marker-distance</v-icon>
                Local da Entrega
              </h3>
              
              <v-sheet
                v-if="metodoEntrega === 'entrega' && enderecoUsuario"
                class="pa-3 bg-blue-lighten-5 rounded-lg border-s-lg border-blue"
              >
                <p class="text-body-1 font-weight-medium text-blue-darken-2">
                  <v-icon left size="20">mdi-truck-delivery</v-icon>
                  Entrega em domicílio:
                </p>
                <p class="mt-1 text-body-2 ml-6 text-wrap">
                  {{ `${enderecoUsuario.rua}, ${enderecoUsuario.numero} - ${enderecoUsuario.cidade}, ${enderecoUsuario.estado} (CEP: ${enderecoUsuario.cep})` }}
                </p>
              </v-sheet>
              
              <v-sheet v-else class="pa-3 bg-red-lighten-5 rounded-lg border-s-lg border-red">
                <p class="text-body-1 font-weight-bold text-red-darken-2">
                  <v-icon left size="20">mdi-handshake-outline</v-icon>
                  Retirada ou Envio:
                </p>
                <p class="mt-1 text-body-2 ml-6">
                  Combinação de entrega com o vendedor após a confirmação do pagamento.
                </p>
              </v-sheet>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row class="mt-6" justify="center" dense>
          <v-col cols="12" sm="6">
            <v-btn 
              color="grey-darken-1" 
              block 
              size="large" 
              @click="sairDoPagamento" 
              :disabled="loadingCancelamento"
              variant="tonal"
            >
              Sair do Pagamento
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn 
              color="error" 
              block 
              size="large" 
              @click="abrirModalCancelamento" 
              :loading="loadingCancelamento"
              variant="flat"
            >
              <v-icon left>mdi-close-circle</v-icon> Cancelar Pedido
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-sheet>

    <v-dialog v-model="dialogCancelar" max-width="480">
      <v-card rounded="lg">
        <v-card-title class="text-h6 d-flex align-center text-error">
          <v-icon class="mr-2">mdi-alert</v-icon>
          Confirmação de Cancelamento
        </v-card-title>
        <v-card-text class="py-4 text-subtitle-1">
          Tem certeza que deseja cancelar este pagamento e pedido? Todos os itens serão devolvidos ao estoque.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="dialogCancelar = false" :disabled="loadingCancelamento">
            Não, Voltar
          </v-btn>
          <v-btn color="error" variant="flat" @click="cancelarPagamento" :loading="loadingCancelamento">
            Sim, Cancelar Pedido
          </v-btn>
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
import QRCode from "qrcode";


const STATUS = {
  pendente: 1,
  pago: 2,
  rejeitado: 3,
  erro: 4,
  expirado: 5
};

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
const statusPagamento = ref(STATUS.pendente);
const dialogCancelar = ref(false);

const frete = computed(() => metodoEntrega.value.toLowerCase() === "entrega" ? 1500 : 0);
const totalComFrete = computed(() => subtotal.value + frete.value);

const metodoPagamentoNormalizado = computed(() => {
  if (!metodoPagamento.value) return null;
  const mp = metodoPagamento.value.toString().trim().toLowerCase();
  console.log(mp, "mp")
  if (["pix", "cartao", "boleto"].includes(mp)) return mp;
  else{
    return "outro";
  }
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


async function gerarQrCodePix(codigoPix) {
  try {
    return await QRCode.toDataURL(codigoPix);
  } catch (err) {
    console.error("Erro ao gerar QR Code do Pix:", err);
    return null;
  }
}


const tempoRestante = ref("00:00");
const percentualRestante = ref(100);
const timerExpirado = ref(false);
const copiado = ref(false);
const loadingPolling = ref(false);


let intervaloTimer = null;
let pollingInterval = null;
const POLLING_DELAY_MS = 5000;


async function getPagamento() {
  loadingPagamento.value = true;

  try {
  
    const res = await connection.get(`/desapega/pagamentos/usuario/${retrieve?.value.id}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const pagamentos = res.data;

    if (!pagamentos || pagamentos.length === 0) {
      toast.error("Nenhum pagamento encontrado.");
      loadingPagamento.value = false;
      return;
    }

    
    const pagamentoAtual = pagamentos[0];
    statusPagamento.value = pagamentoAtual.status_pagamento_id;


    const resFormas = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    const formas = resFormas.data;

   
    const formaSelecionada = formas.find(f => f.id === pagamentoAtual.forma_pagamento_id);
    metodoPagamento.value = formaSelecionada?.forma?.toLowerCase() || "outro";

    
    if (isPix.value) {
      pixQrCode.value = pagamentoAtual.pix_qr_code
        ? `data:image/png;base64,${pagamentoAtual.pix_qr_code}`
        : null;

      pixCopiaCodigo.value = pagamentoAtual.pix_copia_codigo || null;

      if (!pixQrCode.value && pixCopiaCodigo.value) {
        gerarQrCodePix(pixCopiaCodigo.value).then(dataUrl => {
          if (dataUrl) pixQrCode.value = dataUrl;
        });
      }

      if (pagamentoAtual.expiracao) {
        iniciarContagemRegressiva(new Date(pagamentoAtual.expiracao));
      }

      iniciarPollingStatus();
    }

   
    if (isBoleto.value) {
      boletoUrl.value = pagamentoAtual.boleto_url || null;
    }

    
    if (pagamentoAtual.status_pagamento_id === STATUS.pago) {
      toast.success("Pagamento já aprovado! Redirecionando...");
      setTimeout(() => router.push("/"), 800);
    }
  } catch (err) {
    console.error("Erro ao buscar pagamento:", err);
    toast.error("Erro ao carregar dados do pagamento");
  } finally {
    loadingPagamento.value = false;
  }
}



function iniciarContagemRegressiva(expiracaoISO) {
  clearInterval(intervaloTimer);
  timerExpirado.value = false;
  percentualRestante.value = 100;

  const fim = new Date(expiracaoISO).getTime();
  const totalDuracao = Math.max(1, fim - Date.now());

  intervaloTimer = setInterval(() => {
    const distancia = fim - Date.now();
    if (distancia <= 0) {
      clearInterval(intervaloTimer);
      tempoRestante.value = "00:00";
      timerExpirado.value = true;
      percentualRestante.value = 0;
      return;
    }
    const minutos = Math.floor((distancia / 1000 / 60) % 60);
    const segundos = Math.floor((distancia / 1000) % 60);
    tempoRestante.value = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

   
    percentualRestante.value = Math.max(0, Math.floor((distancia / totalDuracao) * 100));
  }, 1000);
}


function iniciarPollingStatus() {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(checarStatusPagamento, POLLING_DELAY_MS);
  
  checarStatusPagamento();
}



async function checarStatusPagamento() {
  if (!retrieve?.value?.id) return;
  loadingPolling.value = true;
  try {
    const res = await connection.get(`/desapega/pagamentos/usuario/${retrieve.value.id}`, { 
      headers: { Authorization: `Bearer ${token.value}` } 
    });

    const pagamentos = res.data; 
    if (!pagamentos || pagamentos.length === 0) return;

    const pagamentoAtual = pagamentos[0]; 
    statusPagamento.value = pagamentoAtual.status_pagamento_id;

    if (pagamentoAtual.status_pagamento_id === STATUS.pago) {
      clearInterval(pollingInterval);
      toast.success("Pagamento aprovado!");
      setTimeout(() => router.push("/"), 900);
    }

    if ([STATUS.rejeitado, STATUS.erro].includes(pagamentoAtual.status_pagamento_id)) {
      clearInterval(pollingInterval);
      toast.error("Pagamento recusado ou erro no processamento.");

      pixQrCode.value = null;
      pixCopiaCodigo.value = null;
      boletoUrl.value = null;

      timerExpirado.value = true;
      tempoRestante.value = "00:00";
      percentualRestante.value = 0;

      await cancelarPagamento();
      setTimeout(() => router.push("/carrinho"), 1200);
      return;
    }

  } catch (err) {
    console.error("Erro polling pagamento:", err);
    clearInterval(pollingInterval);
    toast.error("Erro ao consultar status do pagamento.");
  } finally {
    loadingPolling.value = false;
  }
}



function abrirModalCancelamento() {
  dialogCancelar.value = true;
}
async function cancelarPagamento() {
  if (!ordemCompra.value) return;
  try {
    loadingCancelamento.value = true;
    dialogCancelar.value = false;
    await connection.delete(`/desapega/pagamentos/usuario/${retrieve.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
    toast.success("Pagamento cancelado com sucesso.");
   
    metodoPagamento.value = "";
    pixQrCode.value = null;
    pixCopiaCodigo.value = null;
    boletoUrl.value = null;
    setTimeout(() => router.push("/carrinho"), 800);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Erro ao cancelar pagamento.");
  } finally {
    loadingCancelamento.value = false;
  }
}


function sairDoPagamento() {
  router.push("/"); 
}


async function copiarPix() {
  if (!pixCopiaCodigo.value) return toast.error("Código Pix não encontrado.");
  try {
    await navigator.clipboard.writeText(pixCopiaCodigo.value);
    copiado.value = true;
    toast.success("Código Pix copiado!");
    setTimeout(() => (copiado.value = false), 1500);
  } catch (err) {
    console.error("Erro ao copiar Pix:", err);
    toast.error("Erro ao copiar código Pix.");
  }
}


onMounted(async () => {
  if(!localStorage.getItem("token")){
    router.push("/:pathMatch(.*)*")
    return
  }

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

 
    const resEndereco = await connection.get(`/desapega/enderecos/usuario/ativo/${retrieve.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
    enderecoUsuario.value = resEndereco.data;

    const resOrdem = await connection.get(`/desapega/ordemCompra/usuario/${retrieve.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
    ordemCompra.value = resOrdem.data;
    metodoEntrega.value = ordemCompra.value.metodo_entrega || "combinar";

   
    await getPagamento();
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao carregar dados do pagamento");
    console.error(err);
  } finally {
    loadingPagamento.value = false;
  }
});


onUnmounted(() => {
  if (intervaloTimer) clearInterval(intervaloTimer);
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
@import "../css/paginaPagamento/pagamento.css";
</style>

