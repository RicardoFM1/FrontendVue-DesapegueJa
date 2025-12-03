<template>
  <v-container class="pagamento-container" fluid>
    <v-sheet class="pa-6 mx-auto" max-width="900" elevation="3" rounded="lg">
      <h2 class="text-h4 font-weight-bold mb-6 text-center">Confirmação de Pagamento</h2>

      <!-- Loading (skeleton) -->
      <div v-if="loadingPagamento" class="text-center pa-6">
        <v-skeleton-loader type="image, heading, paragraph" class="mb-4" />
        <v-progress-circular indeterminate size="56"></v-progress-circular>
        <p class="mt-3 text-subtitle-1">Carregando detalhes do pagamento...</p>
      </div>

      <!-- Conteúdo -->
      <div v-else>
        <!-- STATUS ALERT -->
        <div class="mb-4">
          <v-alert
            v-if="statusPagamento === STATUS.pendente"
            variant="tonal"
            border="start"
            color="info"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <v-icon size="28">mdi-timer-sand</v-icon>
            </div>
            <div>
              Aguardando confirmação do pagamento. Atualizando automaticamente...
              <div class="mt-1 text-caption">Você também pode recarregar manualmente.</div>
            </div>

            <v-spacer></v-spacer>
            <v-btn icon small @click="checarStatusPagamento" :disabled="loadingPolling" title="Atualizar agora">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-alert>

          <v-alert
            v-else-if="statusPagamento === STATUS.pago"
            variant="tonal"
            border="start"
            color="success"
            class="d-flex align-center"
          >
            <v-icon class="mr-3" size="28">mdi-check-circle</v-icon>
            Pagamento confirmado! Redirecionando...
          </v-alert>

          <v-alert
            v-else-if="statusPagamento === STATUS.rejeitado || statusPagamento === STATUS.erro"
            variant="tonal"
            border="start"
            color="error"
            class="d-flex align-center"
          >
            <v-icon class="mr-3" size="28">mdi-alert-circle</v-icon>
            Pagamento não autorizado. Verifique com seu banco ou tente outra forma de pagamento.
          </v-alert>

          <v-alert
            v-else-if="timerExpirado"
            variant="outlined"
            border="start"
            color="warning"
            class="d-flex align-center"
          >
            <v-icon class="mr-3" size="28">mdi-clock-alert</v-icon>
            O tempo para pagamento expirou. Você pode voltar ao carrinho ou gerar um novo pedido.
          </v-alert>
        </div>

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
          <h3
            class="text-h6 font-weight-bold mb-3"
            :class="{
              'text-green-darken-2': isPix,
              'text-blue-darken-2': isCartao,
              'text-orange-darken-2': isBoleto
            }"
          >
            Forma de Pagamento
          </h3>
          <p>{{ metodoPagamento?.toUpperCase() || "Não selecionado" }}</p>

         
          <v-sheet v-if="isPix" class="pa-3 mt-3 text-center bg-green-lighten-5 rounded-lg">
            <v-icon color="green" size="30">mdi-qrcode</v-icon>
            <p class="mt-2 text-body-1">Pagamento instantâneo pelo Pix</p>

            
            <v-progress-linear
              v-if="!timerExpirado"
              :model-value="percentualRestante"
              height="6"
              rounded
              class="my-3"
            />

            <div class="my-3">
              <p class="text-caption text-grey-darken-1 mb-0">Tempo restante para pagar:</p>
              <h2 :class="{ 'text-red': timerExpirado, 'text-green-darken-2': !timerExpirado }">{{ tempoRestante }}</h2>
            </div>

          
          <transition name="fade" mode="out-in">

  <div v-if="pixQrCode" key="qr-loaded" class="text-center mb-2">
    <img :src="pixQrCode" alt="QR Code PIX" width="250" />
    <p class="mt-2 text-caption">Aguardando confirmação do pagamento...</p>
  </div>

  
  <div v-else-if="!timerExpirado" key="qr-loading" class="text-center mb-2">
    <v-skeleton-loader type="image" width="250" />
    <p class="mt-2 text-caption">Carregando QR Code...</p>
  </div>


  <div v-else key="qr-expired" class="text-center mb-2 text-error">
    <v-icon size="48">mdi-alert-circle</v-icon>
    <p class="mt-2 text-caption">Tempo expirado. Gere outro QR Code.</p>
  </div>
</transition>


        
            <div class="d-flex justify-center mt-2">
              <v-btn
                v-if="pixCopiaCodigo && !timerExpirado"
                small
                variant="outlined"
                color="green"
                @click="copiarPix"
              >
                <template v-if="!copiado">
                  <v-icon left small>mdi-content-copy</v-icon> Copiar código Pix
                </template>
                <template v-else>
                  <v-icon left small>mdi-check</v-icon> Copiado!
                </template>
              </v-btn>

              <v-btn
                v-if="!timerExpirado"
                small
                class="ml-2"
                variant="tonal"
                color="blue"
                @click="checarStatusPagamento"
                :loading="loadingPolling"
              >
                <v-icon left small>mdi-refresh</v-icon> Atualizar status
              </v-btn>
            </div>

            <!-- Actions after expiration -->
            <div v-if="timerExpirado" class="mt-4 d-flex justify-center gap-3">
              <v-btn color="primary" @click="router.push('/carrinho')">Voltar ao carrinho</v-btn>
              <v-btn color="secondary" variant="outlined" @click="router.push('/')">Continuar navegando</v-btn>
            </div>
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


          <v-sheet v-else class="pa-3 mt-3 text-center bg-red-lighten-5 rounded-lg">
            <v-icon color="red" size="30">mdi-alert-circle</v-icon>
            <p class="mt-2 text-body-1">Método de pagamento inválido. Contate o suporte.</p>
          </v-sheet>
        </v-sheet>

        <!-- Ações: Sair / Cancelar -->
        <v-row class="mt-4" justify="center" align="center" dense>
          <v-col cols="12" md="6">
            <v-btn color="grey" block large @click="sairDoPagamento" :disabled="loadingCancelamento">
              Sair do pagamento
            </v-btn>
          </v-col>

          <v-col cols="12" md="6">
            <v-btn color="red" block large @click="abrirModalCancelamento" :loading="loadingCancelamento">
              Cancelar Pagamento
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-sheet>

    <!-- Modal Cancelamento -->
    <v-dialog v-model="dialogCancelar" max-width="480">
      <v-card>
        <v-card-title class="text-h6">Cancelar pagamento</v-card-title>
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

   
    <v-overlay :model-value="loadingCancelamento" absolute>
      <v-card class="pa-6" elevation="8">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <div class="mt-3">Cancelando pagamento...</div>
      </v-card>
    </v-overlay>
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

 
    const resEndereco = await connection.get(`/desapega/enderecos/${retrieve.value.id}`, { headers: { Authorization: `Bearer ${token.value}` } });
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

