<template>
  <v-container class="pagamento-container" fluid>
    <v-sheet class="pa-6 mx-auto" max-width="800" elevation="3" rounded="lg">
      <h2 class="text-h4 font-weight-bold mb-6 text-center">Confirmação de Pagamento</h2>

      <div v-if="loadingPagamento" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-subtitle-1">Carregando detalhes do pagamento...</p>
      </div>

      <div v-else>
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

        <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
          <h3 class="text-h6 font-weight-bold mb-3">Endereço de entrega</h3>
          <v-sheet v-if="metodoEntrega === 'entrega'" class="pa-3 text-center bg-blue-lighten-5 rounded-lg">
            <v-icon color="blue" size="30">mdi-map-marker</v-icon>
            <p class="mt-2 text-body-1 font-weight-bold">
              Entrega em:
              {{ enderecoUsuario ? `${enderecoUsuario.rua}, ${enderecoUsuario.numero} - ${enderecoUsuario.cidade}, ${enderecoUsuario.estado}` : "Carregando endereço..." }}
            </p>
          </v-sheet>

          <v-sheet v-else class="pa-3 text-center bg-red-lighten-5 rounded-lg">
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

    <div class="my-3">
        <p class="text-caption text-grey-darken-1 mb-0">Tempo restante para pagar:</p>
        <h2 class="text-h4 font-weight-bold" :class="{'text-red': timerExpirado, 'text-green-darken-2': !timerExpirado}">
            {{ tempoRestante }}
        </h2>
        <p v-if="timerExpirado" class="text-caption text-red font-weight-bold">
            Pedido expirado.
        </p>
    </div>
    <v-img v-if="pixQrCode && !timerExpirado" :src="pixQrCode" max-width="250" class="mx-auto my-2" />
    
    <p v-else-if="!timerExpirado">Carregando QR Code...</p>

    <v-btn v-if="pixCopiaCodigo && !timerExpirado" small outlined color="green" @click="copiarPix">
        Copiar código Pix
    </v-btn>
</v-sheet>
          
          <v-sheet v-else-if="isCartao" class="pa-3 mt-3 text-center bg-blue-lighten-5 rounded-lg">
            <v-icon color="blue" size="30">mdi-credit-card</v-icon>
            <p class="mt-2 text-body-1">Pagamento com cartão no próximo passo</p>
          </v-sheet>

          <v-sheet v-else-if="isBoleto" class="pa-3 mt-3 text-center bg-yellow-lighten-5 rounded-lg">
            <v-icon color="orange" size="30">mdi-file-document-box</v-icon>
            <p class="mt-2 text-body-1">Gerar boleto bancário</p>

            <v-btn v-if="boletoUrl" small outlined color="orange" :href="boletoUrl" target="_blank">
                Abrir Boleto
            </v-btn>
          </v-sheet>

          <v-sheet v-else class="pa-3 mt-3 text-center bg-red-lighten-5 rounded-lg">
            <v-icon color="red" size="30">mdi-alert-circle</v-icon>
            <p class="mt-2 text-body-1">Método de pagamento inválido. Contate o suporte.</p>
          </v-sheet>
        </v-sheet>

        <v-row class="mt-4" justify="center" align="center" dense>
          <v-col cols="12" md="6">
            <v-btn color="red" block large @click="abrirModalCancelamento" :loading="loadingCancelamento">
              Cancelar Pagamento
            </v-btn>
          </v-col>
        </v-row>
      </div>

    </v-sheet>
    
    <v-dialog v-model="dialogCancelar" max-width="400">
      <v-card>
        <v-card-title class="text-h5 red lighten-2 white--text">
          Confirmação de Cancelamento
        </v-card-title>
        <v-card-text class="py-4">
          Tem certeza que deseja cancelar este pagamento e pedido? O carrinho será esvaziado.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="dialogCancelar = false" :disabled="loadingCancelamento">
            Não, Voltar
          </v-btn>
          <v-btn color="red" text @click="cancelarPagamento" :loading="loadingCancelamento">
            Sim, Cancelar
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

const router = useRouter();
const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

const carrinhoUser = ref([]);
const subtotal = ref(0);
const metodoPagamento = ref("");
const formaPagamento = ref(null);
const loadingPagamento = ref(false); 
const loadingCancelamento = ref(false);
const enderecoUsuario = ref();
const ordemCompra = ref();
const retrieve = ref(null);
const metodoEntrega = ref("combinar");
const pixQrCode = ref();
const boletoUrl = ref();
const pixCopiaCodigo = ref(); 
const dialogCancelar = ref(false); 

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
    } catch {
        ordemCompra.value = null;
    }
}

async function getPagamento() {
    console.log("--- INICIANDO GET PAGAMENTO ---");
    try {
        const resPagamentos = await connection.get(
            `/desapega/pagamentos/usuario/${retrieve?.value.id}`,
            { headers: { Authorization: `Bearer ${token.value}` } }
        );
        const pagamento = resPagamentos.data;

        if (!pagamento || !pagamento.ordem_id) {
            metodoPagamento.value = null;
            formaPagamento.value = null;
            return;
        }

        const resFormas = await connection.get("/desapega/formasPagamento", {
            headers: { Authorization: `Bearer ${token.value}` },
        });

        const formas = Array.isArray(resFormas.data) ? resFormas.data : resFormas.data.formas || [];
        const forma = formas.find(f => String(f.id) === String(pagamento.forma_pagamento_id));

        if (forma && forma.forma) {
            formaPagamento.value = forma.forma;
            metodoPagamento.value = forma.forma.toString().trim().toLowerCase();
        } else {
            metodoPagamento.value = "outro";
        }

        if (metodoPagamento.value === "pix") {
            const codigoPixCompleto = pagamento.pix_copia_codigo;
          
            if (codigoPixCompleto) {
                pixCopiaCodigo.value = codigoPixCompleto;
                pixQrCode.value = await QRCode.toDataURL(codigoPixCompleto);

                
                if (pagamento.created_at) { 
                    iniciarContagemRegressiva(pagamento.created_at);
                }
            } else {
                console.error("ERRO: O Backend não retornou o código Pix.");
            }
        }

        if (metodoPagamento.value === "boleto") {
            boletoUrl.value = pagamento.boleto_url;
        }

    } catch (err) {
        console.error("ERRO AO PROCESSAR PAGAMENTO:", err);
        metodoPagamento.value = "outro";
        formaPagamento.value = null;
    }
}

const tempoRestante = ref("15:00"); 
const timerExpirado = ref(false);
let intervaloTimer = null;


const MINUTOS_EXPIRACAO = 15; 

function iniciarContagemRegressiva(dataCriacao) {
    
    const inicio = dataCriacao ? new Date(dataCriacao).getTime() : new Date().getTime();
    const fim = inicio + (MINUTOS_EXPIRACAO * 60 * 1000); 

    
    if (intervaloTimer) clearInterval(intervaloTimer);

    intervaloTimer = setInterval(() => {
        const agora = new Date().getTime();
        const distancia = fim - agora;

        if (distancia < 0) {
           
            clearInterval(intervaloTimer);
            tempoRestante.value = "00:00";
            timerExpirado.value = true;
            
            
            if (metodoPagamento.value === 'pix' && !loadingCancelamento.value) {
                toast.warning("Tempo expirado! Cancelando pedido...");
                cancelarPagamento(); 
            }
            return;
        }

     
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

       
        tempoRestante.value = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

    }, 1000);
}

function abrirModalCancelamento() {
    dialogCancelar.value = true;
}

async function cancelarPagamento() {
    if (!ordemCompra.value) return;
    try {
        loadingCancelamento.value = true;
        dialogCancelar.value = false; // Fecha o modal ao iniciar o processo
        await connection.delete(`/desapega/pagamentos/usuario/${retrieve?.value.id}`, {
            headers: { Authorization: `Bearer ${token.value}` },
        });

        toast.success("Pagamento cancelado com sucesso. Você será redirecionado em breve.");
        
       
        metodoPagamento.value = "";
        pixQrCode.value = null;
        pixCopiaCodigo.value = null;
        boletoUrl.value = null;
        
       
        setTimeout(() => router.push("/"), 2000); 

    } catch (err) {
        console.error(err);
        toast.error("Erro ao cancelar pagamento. Verifique o console.");
    } finally {
        loadingCancelamento.value = false;
    }
}

function copiarPix() {
    if (!pixCopiaCodigo.value) {
        toast.error("Código Pix não encontrado.");
        return;
    }
    
    try {
       
        navigator.clipboard.writeText(pixCopiaCodigo.value);
        toast.success("Código Pix copiado!");
    } catch (err) {
        console.error("Erro ao copiar Pix:", err);
       
        
        toast.error("Erro na cópia automática. Tente copiar manualmente!");
    }
}
onMounted(async () => {
    if (!tokenExiste.value) return router.push("/");
    
    loadingPagamento.value = true; // Inicia o loading
    
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

        await getEndereco();
        await getOrdemCompra();
        await getPagamento(); 

    } catch (err) {
        toast.error(err.response?.data?.message || "Erro ao carregar dados do pagamento");
    } finally {
        loadingPagamento.value = false;
    }


});

onUnmounted(() => {
    if (intervaloTimer) clearInterval(intervaloTimer);
});
</script>


<style scoped>
@import "../css/paginaPagamento/pagamento.css";
</style>
