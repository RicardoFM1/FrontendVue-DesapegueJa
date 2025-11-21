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

      <!-- Endereço de entrega -->
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

      <!-- Forma de Pagamento -->
      <v-sheet class="mb-6 pa-4" rounded="lg" elevation="2">
        <h3 class="text-h6 font-weight-bold mb-3">Forma de Pagamento</h3>
        <p>{{ metodoPagamento?.toUpperCase() || "Não selecionado" }}</p>

        <v-sheet v-if="isPix" class="pa-3 mt-3 text-center bg-green-lighten-5 rounded-lg">
          <v-icon color="green" size="30">mdi-qrcode</v-icon>
          <p class="mt-2 text-body-1">Pagamento instantâneo pelo Pix</p>

          <v-img v-if="pixQrCode" :src="pixQrCode" max-width="250" class="mx-auto my-2" />
          <p v-else>QR Code não disponível ou erro no carregamento da imagem.</p>

          <v-btn v-if="pixCopiaCodigo" small outlined color="green" @click="copiarPix">
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

      <!-- Cancelamento do pagamento -->
      <v-row class="mt-4" justify="center" align="center" dense>
        <v-col cols="12" md="6">
          <v-btn color="red" block large @click="cancelarPagamento" :loading="loadingCancelamento">
            Cancelar Pagamento
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
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

// Campos gerados para Pix/Boleto
const pixQrCode = ref(null);
const pixCopiaCodigo = ref(null);
const boletoUrl = ref(null);

// --- CONFIGURAÇÃO DO PIX (EDITAR AQUI) ---
const chavePixRecebedor = "51984018587"; // Ex: 55 + DDD + Celular (Apenas números)
const nomeRecebedor = "RICARDO FERNANDES DE MOURA"; // Nome sem acentos
const cidadeRecebedor = "RIO GRANDE DO SUL"; // Cidade sem acentos

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

// --- FUNÇÕES AUXILIARES (NÃO REMOVA) ---

// 1. Formata os campos do Pix (ID + Tamanho + Valor)
function formatarCampo(id, valor) {
    const strValor = String(valor || '');
    const comprimento = String(strValor.length).padStart(2, '0');
    return `${id}${comprimento}${strValor}`;
}

// 2. Calcula o CRC16 (Obrigatório para o Pix ser válido)
function crc16(data) {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < data.length; i++) {
        let byte = data.charCodeAt(i);
        crc ^= (byte << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) > 0) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// 3. Limpa acentos e caracteres especiais
function limparTexto(str, maxLen) {
  if (!str) return "";
  let limpo = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  limpo = limpo.replace(/[^A-Z0-9 ]/g, "");
  if (maxLen && limpo.length > maxLen) {
    limpo = limpo.substring(0, maxLen);
  }
  return limpo.trim();
}

// --- REQUISIÇÕES ---

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
    
    // Compara convertendo ambos para String para evitar erros de tipo
    const forma = formas.find(f => String(f.id) === String(pagamento.forma_pagamento_id));

    if (forma && forma.forma) {
      formaPagamento.value = forma.forma;
      metodoPagamento.value = forma.forma.toString().trim().toLowerCase();
    } else {
      formaPagamento.value = "Desconhecida";
      metodoPagamento.value = "outro";
    }

    // --- LÓGICA DE GERAÇÃO DO PIX ---
    if (metodoPagamento.value === "pix") {
        if (!ordemCompra.value) {
            console.error("Ordem de compra não carregada ainda.");
            return;
        }

        // Prepara os dados
        const valor = (ordemCompra.value.valor_total / 100).toFixed(2);
        let txid = `PEDIDO${ordemCompra.value.id}`; 
        txid = txid.replace(/[^a-zA-Z0-9]/g, ''); // Apenas letras e números no TXID

        const chaveLimpa = chavePixRecebedor.trim(); 
        const nomeLimpo = limparTexto(nomeRecebedor, 25);
        const cidadeLimpa = limparTexto(cidadeRecebedor, 15);

        // Monta o Payload
        const campo26Content = 
            formatarCampo("00", "br.gov.bcb.pix") +
            formatarCampo("01", chaveLimpa); // Sua chave Pix
            
        const campo26 = formatarCampo("26", campo26Content);

        let codigoPixSemCRC = 
            formatarCampo("00", "01") +
            formatarCampo("01", "12") + // QR Code Estático
            campo26 +
            formatarCampo("52", "0000") + // MCC
            formatarCampo("53", "986") +  // BRL
            formatarCampo("54", valor) +  // Valor
            formatarCampo("58", "BR") +
            formatarCampo("59", nomeLimpo) + // Nome
            formatarCampo("60", cidadeLimpa) + // Cidade
            formatarCampo("62", formatarCampo("05", txid)) + // TXID
            "6304"; // ID do CRC

        // Calcula o CRC
        const crc16Hex = crc16(codigoPixSemCRC);
        const codigoPixCompleto = `${codigoPixSemCRC}${crc16Hex}`;

        console.log("Payload Pix Válido:", codigoPixCompleto);
        
        pixCopiaCodigo.value = codigoPixCompleto;
        pixQrCode.value = await QRCode.toDataURL(codigoPixCompleto);
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

function copiarPix() {
  if (!pixCopiaCodigo.value) return;
  navigator.clipboard.writeText(pixCopiaCodigo.value);
  toast.success("Código Pix copiado!");
}

async function cancelarPagamento() {
  if (!ordemCompra.value) return;
  try {
    loadingCancelamento.value = true;
    await connection.delete(`/desapega/pagamentos/${ordemCompra.value.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    toast.success("Pagamento cancelado com sucesso");
    metodoPagamento.value = "";
    pixQrCode.value = null;
    pixCopiaCodigo.value = null;
    boletoUrl.value = null;

  } catch (err) {
    console.error(err);
    toast.error("Erro ao cancelar pagamento");
  } finally {
    loadingCancelamento.value = false;
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
