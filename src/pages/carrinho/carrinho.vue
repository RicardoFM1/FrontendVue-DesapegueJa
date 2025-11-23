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
        @click="carregarCarrinhoCompleto"
        :disabled="carregandoCarrinho"
      >
        Tentar novamente
      </v-btn>
    </v-sheet>
  </v-sheet>
  <v-dialog
    max-width="500"
    v-model="modalConfirmacaoOpen"
    v-if="modalConfirmacaoOpen"
  >
    <v-card class="pa-4" elevation="8" rounded="xl">
      <v-card-title class="text-center font-weight-bold text-h4">
        <v-icon color="error" size="32" class="mr-2"
          >mdi-alert-circle-outline</v-icon
        >
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
                  R$
                  {{
                    (item?.preco * item?.quantidade) / 100 ||
                    "Preço indisponível"
                  }}
                </div>
              </template>
              <span
                >R$
                {{
                  (item?.preco * item?.quantidade) / 100 || "Preço indisponível"
                }}</span
              >
            </v-tooltip>
          </div>

          <div class="item-actions">
            <v-select
              v-model="item.quantidade"
              :items="
                Array.from(
                  {
                    length: Math.max(item.estoque, item.quantidade),
                  },
                  (_, i) => i + 1
                )
              "
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
      class="cart-summary"
      v-if="!erroGetProduto && carrinhoUser.length > 0 && !carregandoCarrinho"
    >
      <p><strong>Subtotal:</strong> R$ {{ subtotal / 100 }}</p>
      <p v-if="metodoEntrega === 'entrega'" class="text-orange">
        Frete de R$15 adicionado automaticamente
      </p>
      <p><strong>Total:</strong> R$ {{ totalComFrete / 100 }}</p>

      <v-sheet class="pa-4 mt-4" rounded="lg" elevation="2">
        <h3 class="text-h6 mb-3 font-weight-bold">Método de Entrega</h3>

        <v-radio-group
          v-model="metodoEntrega"
          :disabled="existePagamento || loadingComprar"
        >
          <v-radio label="Combinar com o vendedor" value="combinar"></v-radio>
          <v-radio label="Entrega" value="entrega" />
        </v-radio-group>

        <v-expand-transition>
          <v-sheet
            v-if="metodoEntrega === 'combinar'"
            class="pa-3 mt-3 text-center bg-blue-lighten-5"
            rounded="lg"
          >
            <v-icon color="blue" size="30">mdi-account-voice</v-icon>
            <p class="mt-2 text-body-1">
              Após finalizar a compra, você receberá os dados para combinar
              local e horário com o vendedor.
            </p>
          </v-sheet>
        </v-expand-transition>
      </v-sheet>

      <v-sheet class="pa-4 mt-4" rounded="lg" elevation="2">
        <h3 class="text-h6 mb-3 font-weight-bold">Forma de Pagamento</h3>

        <v-radio-group
          v-if="formasPagamento.length"
          v-model="metodoPagamento"
          :disabled="existePagamento || loadingComprar"
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
            v-if="metodoPagamento"
            class="pa-3 mt-3 text-center bg-grey-lighten-4"
            rounded="lg"
          >
            <v-icon size="30">mdi-cash-multiple</v-icon>
            <p class="mt-2 text-body-1">
              Você selecionou: <strong>{{ metodoPagamento }}</strong>
            </p>
            <small>O pagamento será finalizado na próxima etapa.</small>
          </v-sheet>
        </v-expand-transition>

        <v-expand-transition>
          <v-sheet
            v-if="metodoPagamento && metodoPagamento.toLowerCase() === 'cartao'"
            class="pa-3 mt-3 text-center bg-blue-lighten-5"
            rounded="lg"
          >
            <v-icon color="blue" size="30">mdi-credit-card</v-icon>
            <p class="mt-2 text-body-1">
              Pagamento com cartão no próximo passo
            </p>
          </v-sheet>
        </v-expand-transition>
      </v-sheet>
      <v-expand-transition>
        <v-alert
          v-if="existePagamento"
          type="info"
          icon="mdi-information"
          class="my-4 text-center"
          color="blue-darken-1"
          variant="tonal"
        >
          <p class="font-weight-bold">Pagamento em Andamento</p>
          <p>
            Você já tem um pedido e pagamento pendente. Clique em "Verificar
            Pagamento" para continuar onde parou.
          </p>
        </v-alert>
      </v-expand-transition>
      <div class="cart-buttons">
        <v-btn class="btn-voltar" @click="voltar"> ← Voltar às compras </v-btn>

        <v-btn
          v-if="existePagamento"
          color="green"
          class="btn-verificar"
          prepend-icon="mdi-barcode-scan"
          @click="irParaPagamento"
        >
          Verificar Pagamento
        </v-btn>

        <v-btn
          class="btn-comprar"
          :loading="loadingComprar"
          @click="comprar"
          :disabled="existePagamento || loadingComprar"
        >
          Finalizar compra
        </v-btn>
      </div>
    </v-sheet>

    <v-sheet
      v-if="!erroGetProduto && !carregandoCarrinho && carrinhoUser.length <= 0"
      class="empty-cart"
    >
      <p>Seu carrinho está vazio 😢</p>
      <button class="btn-voltar" @click="voltar">Voltar às compras</button>
    </v-sheet>

    <v-dialog v-model="modalEndereco" max-width="600px" max-height="900px">
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-5 text-center">
          Endereço do usuário
        </v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-form @submit.prevent="salvarAlteracoesEndereco">
          <v-text-field
            label="CEP"
            v-model="enderecoForm.cep"
            append-inner-icon="mdi-delete"
            @click:append-inner="
              (enderecoForm.cep = ''),
                (enderecoForm.bairro = ''),
                (enderecoForm.cidade = ''),
                (enderecoForm.estado = ''),
                (enderecoForm.rua = '')
            "
            placeholder="00000-00"
            @input="onInputCep"
          >
          </v-text-field>
          <v-select
            label="Estado"
            v-model="enderecoForm.estado"
            :readonly="readOnlyComCEP"
            :items="[
              { title: '', value: '' },
              { title: 'Acre', value: 'AC' },
              { title: 'Alagoas', value: 'AL' },
              { title: 'Amapá', value: 'AP' },
              { title: 'Amazonas', value: 'AM' },
              { title: 'Bahia', value: 'BA' },
              { title: 'Ceará', value: 'CE' },
              { title: 'Distrito Federal', value: 'DF' },
              { title: 'Espírito Santo', value: 'ES' },
              { title: 'Goiás', value: 'GO' },
              { title: 'Maranhão', value: 'MA' },
              { title: 'Mato Grosso', value: 'MT' },
              { title: 'Mato Grosso do Sul', value: 'MS' },
              { title: 'Minas Gerais', value: 'MG' },
              { title: 'Pará', value: 'PA' },
              { title: 'Paraíba', value: 'PB' },
              { title: 'Paraná', value: 'PR' },
              { title: 'Pernambuco', value: 'PE' },
              { title: 'Piauí', value: 'PI' },
              { title: 'Rio de Janeiro', value: 'RJ' },
              { title: 'Rio Grande do Norte', value: 'RN' },
              { title: 'Rio Grande do Sul', value: 'RS' },
              { title: 'Rondônia', value: 'RO' },
              { title: 'Roraima', value: 'RR' },
              { title: 'Santa Catarina', value: 'SC' },
              { title: 'São Paulo', value: 'SP' },
              { title: 'Sergipe', value: 'SE' },
              { title: 'Tocantins', value: 'TO' },
            ]"
            :item-title="title"
            :item-value="value"
          >
          </v-select>
          <v-text-field
            label="Cidade"
            v-model="enderecoForm.cidade"
            :readonly="readOnlyComCEP"
          >
          </v-text-field>
          <v-text-field
            label="Bairro"
            v-model="enderecoForm.bairro"
            :readonly="readOnlyComCEP"
          >
          </v-text-field>
          <v-row>
            <v-text-field
              label="Rua"
              class="ml-3 mr-3"
              v-model="enderecoForm.rua"
              :readonly="readOnlyComCEP"
            >
            </v-text-field>

            <v-text-field
              label="Número"
              class="mr-3"
              max-width="50%"
              v-model="enderecoForm.numero"
            >
            </v-text-field>
          </v-row>
          <v-select
            label="Tipo de logradouro"
            v-model="enderecoForm.logradouro"
            :items="[
              { title: '', value: '' },
              { title: 'Rua', value: 'rua' },
              { title: 'Avenida', value: 'avenida' },
              { title: 'Praça', value: 'praca' },
              { title: 'Travessa', value: 'travessa' },
              { title: 'Outros', value: 'outros' },
            ]"
            item-title="title"
            item-value="value"
          >
          </v-select>
          <v-text-field label="Complemento" v-model="enderecoForm.complemento">
          </v-text-field>

          <v-row class="mt-6" justify="center" align="center">
            <v-btn
              color="primary"
              :loading="loadingEndereco"
              class="mr-3"
              type="submit"
            >
              Salvar Alterações
            </v-btn>
            <v-btn
              color="grey"
              variant="outlined"
              type="button"
              @click="router.go(0)"
            >
              Cancelar
            </v-btn>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { connection } from "@/connection/axiosConnection";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
console.log(token.value)
const tokenExiste = ref(!!token.value);

const retrieve = ref(null);
const carrinho = ref([]);
const produtos = ref([]);
const carrinhoUser = ref([]);
const totalItems = ref(0);

const erroGetProduto = ref(false);
const carregandoProdutos = ref(true);
const carregandoCarrinho = ref(true);

const modalConfirmacaoOpen = ref(false);
const itemASerRemovido = ref(null);
const loadingRemover = ref(false);

const metodoEntrega = ref("combinar");
const formasPagamento = ref([]);
const metodoPagamento = ref("");

const loadingComprar = ref(false);
const loadingEndereco = ref(false);


const enderecoForm = ref({
  cep: "",
  estado: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
  complemento: "",
  logradouro: "",
});

const enderecoUsuario = ref(null);
const pagamentoUUID = ref("");
const existePagamento = ref(false);
const pagamentoUsuarioStatus = ref()

const frete = computed(() => (metodoEntrega.value === "entrega" ? 1500 : 0));
const subtotal = computed(() =>
  carrinhoUser.value.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  )
);
const totalComFrete = computed(() => subtotal.value + frete.value);
const readOnlyComCEP = computed(() => {
  const numeros = (enderecoForm.value.cep || "").replace(/\D/g, "");
  return numeros.length === 8;
});


async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res?.status === 200 && res.data) retrieve.value = res.data;
    else throw new Error("Resposta inesperada ao buscar usuário");
  } catch (err) {
    console.error("getRetrieve:", err);
    toast.error(err.response?.data?.message || "Erro ao buscar o usuário");
  }
}

async function getCarrinho() {
  try {
    const res = await connection.get(`/desapega/carrinho/${retrieve.value.id}`);
    if (res?.status === 200 || res?.status === 201) carrinho.value = res.data;
    else throw new Error("Erro ao buscar carrinho");
  } catch (err) {
    console.error("getCarrinho:", err);
    toast.error(err.response?.data?.message || "Erro ao listar seus produtos");
  }
}

async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;
  try {
    const url = retrieve.value?.admin
      ? "/desapega/produtos"
      : "/desapega/produtos?status=ativo";
    const res = await connection.get(url);
    if (res?.status === 200) produtos.value = res.data.produtos || [];
    else throw new Error("Erro ao buscar produtos");
  } catch (err) {
    console.error("getProdutos:", err);
    toast.error(err.response?.data?.message || "Erro ao buscar produtos");
    erroGetProduto.value = true;
  } finally {
    setTimeout(() => (carregandoProdutos.value = false), 300);
  }
}

function getProdutoImage(imagem) {
  if (!imagem || imagem === "Sem imagem" || imagem === "null") {
    return "/png-triste-erro.png";
  }

  if (imagem.startsWith("data:image")) {
    return imagem;
  }

  if (imagem.startsWith("/9j/")) {
    return `data:image/jpeg;base64,${imagem}`;
  }

  if (imagem.startsWith("iVBORw0KGgo")) {
    return `data:image/png;base64,${imagem}`;
  }

  if (imagem.startsWith("R0lGODlh") || imagem.startsWith("R0lGODdh")) {
    return `data:image/gif;base64,${imagem}`;
  }

  if (imagem.startsWith("UklGR")) {
    return `data:image/webp;base64,${imagem}`;
  }

  return `data:image/png;base64,${imagem}`;
}

function setarCarrinhoUser() {
  carregandoCarrinho.value = true;
  try {
    const list = [];
    for (const itemCarrinho of carrinho.value || []) {
      const produto = (produtos.value || []).find(
        (p) => p.id === itemCarrinho.produto_id
      );
      if (produto)
        list.push({ ...produto, quantidade: itemCarrinho.quantidade });
    }
    carrinhoUser.value = list.reverse();
    totalItems.value = list.length;
  } catch (err) {
    console.error("setarCarrinhoUser:", err);
    toast.error("Erro ao carregar carrinho, tente novamente!");
  } finally {
    carregandoCarrinho.value = false;
  }
}

async function carregarFormasPagamento() {
  try {
    const res = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (Array.isArray(res.data)) {
      formasPagamento.value = res.data.filter(
        (f) => f.status === "ativo" && f.forma
      );
      if (formasPagamento.value.length)
        metodoPagamento.value = formasPagamento.value[0].forma;
    }
  } catch (err) {
    console.error("carregarFormasPagamento:", err);
    toast.error(
      err.response?.data?.message || "Erro ao buscar formas de pagamento"
    );
  }
}

async function getEndereco() {
  try {
    const res = await connection.get(
      `/desapega/enderecos/${retrieve.value.id}`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    if (res?.status === 200 || res?.status === 201) {
      enderecoUsuario.value = res.data;
      Object.assign(enderecoForm.value, {
        bairro: res.data.bairro || "",
        cep: res.data.cep || "",
        cidade: res.data.cidade || "",
        estado: res.data.estado || "",
        rua: res.data.rua || "",
        complemento: res.data.complemento || "",
        numero: res.data.numero || "",
      });
    }
  } catch (err) {
    enderecoUsuario.value = null;
  }
}

async function buscarPagamentoUsuario() {
  try {
    const res = await connection.get(
      `/desapega/pagamentos/usuario/${retrieve.value.id}`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    return res?.data || null;
  } catch (err) {
    return null;
  }
}

async function buscarOrdemUsuario() {
  try {
    const res = await connection.get(
      `/desapega/ordemCompra/usuario/${retrieve.value.id}`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    return res?.data || null;
  } catch (err) {
    return null;
  }
}

async function comprar() {
  if (!carrinhoUser.value.length) {
    toast.error("Seu carrinho está vazio");
    return;
  }

  if (!metodoPagamento.value) {
    toast.error("Selecione uma forma de pagamento");
    return;
  }
  if (!token.value) {
    toast.error("Sua sessão expirou. Faça login novamente.");
    router.push("/login");
    return;
  }

  loadingComprar.value = true;

  try {
    const ordemExistente = await buscarOrdemUsuario();
    if (ordemExistente?.id && ordemExistente.pagamento_uuid) {
      router.push(`/pagamento/${ordemExistente.pagamento_uuid}`);
      return;
    }

    const statusOrdemRes = await connection.get("/desapega/statusOrdem", {
      headers: { Authorization: `Bearer ${token?.value}` },
      timeout: 15000,
    });

    const statusOrdemPendente = statusOrdemRes.data.find(
      (s) => s.descricao?.toLowerCase() === "pendente"
    );

    if (!statusOrdemPendente) {
      toast.error("Status de ordem 'pendente' não encontrado");
      return;
    }

    const ordemBody = {
      usuario_id: retrieve.value.id,
      status_ordem_id: statusOrdemPendente.id,
      metodo_entrega: metodoEntrega.value,
      itens: carrinhoUser.value.map((i) => ({
        produto_id: i.id,
        quantidade: i.quantidade,
      })),
    };

    const ordemRes = await connection.post("/desapega/ordemCompra", ordemBody, {
      headers: { Authorization: `Bearer ${token?.value}` },
      timeout: 15000,
    });

    const ordemId = ordemRes.data?.id;

    if (!ordemId) {
      toast.error("Erro ao criar ordem de compra");
      return;
    }

    const formaSelecionada = formasPagamento.value.find(
      (f) => f.forma.toLowerCase() === metodoPagamento.value.toLowerCase()
    );

    if (!formaSelecionada) {
      toast.error("Forma de pagamento inválida");
      return;
    }

    const statusPagRes = await connection.get("/desapega/statusPagamento", {
      headers: { Authorization: `Bearer ${token?.value}` },
      timeout: 15000,
    });

    const statusPagamentoPendente = statusPagRes.data.find(
      (s) => s.descricao?.toLowerCase() === "pendente"
    );

    if (!statusPagamentoPendente) {
      toast.error("Status de pagamento 'pendente' não encontrado");
      return;
    }

    const pagamentoBody = {
      ordem_id: ordemId,
      usuario_id: retrieve.value.id,
      forma_pagamento_id: formaSelecionada.id,
      status_pagamento_id: statusPagamentoPendente.id,
      valor: totalComFrete.value,
      observacao: "",
    };

    
    const pagamentoRes = await connection.post(
      "/desapega/pagamentos",
      pagamentoBody,
      {
        headers: { Authorization: `Bearer ${token?.value}` },
        timeout: 15000,
      }
    );

    const novoPagamentoUUID = pagamentoRes.data?.pagamento_uuid; 

    if (!novoPagamentoUUID) {
        toast.error("Erro: Pagamento criado mas UUID não retornado.");
        return;
    }
    
    
    pagamentoUUID.value = novoPagamentoUUID; 
    
    
    router.push(`/pagamento/${novoPagamentoUUID}`); 
  
  } catch (err) {
    console.error("comprar erro:", err);

    if (err.response?.status === 403 || err.response?.status === 401) {
      toast.error("Sua sessão expirou. Por favor, faça login novamente.");

      router.push("/login");
    } else {
      toast.error(
        err.response?.data?.message ||
          "Erro ao finalizar compra. Tente novamente."
      );
    }
  } finally {
    loadingComprar.value = false;
  }
}

function clickRemover(item) {
  itemASerRemovido.value = item;
  modalConfirmacaoOpen.value = true;
}

async function removerItem() {
  if (!itemASerRemovido.value) return;
  loadingRemover.value = true;
  try {
    await connection.delete(
      `/desapega/carrinho/${retrieve.value.id}/${itemASerRemovido.value.id}`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    toast.success("Item removido do carrinho!", { autoClose: 2000 });
    setTimeout(async() => {
    router.go(0)
    }, 1000);
  } catch (err) {
    console.error("removerItem:", err);
    toast.error(
      err.response?.data?.message || "Erro ao remover item do carrinho!"
    );
  } finally {
    loadingRemover.value = false;
    modalConfirmacaoOpen.value = false;
  }
}

function voltar() {
  router.push("/");
}

function irParaPagamento() {
  if (pagamentoUUID.value) {
    router.push(`/pagamento/${pagamentoUUID.value}`);
  } else {
    toast.error("Pagamento não encontrado");
  }
}

function formatCep(value = "") {
  const numeros = value.replace(/\D/g, "").slice(0, 8);
  const parte1 = numeros.slice(0, 5);
  const parte2 = numeros.slice(5, 8);
  return parte2 ? `${parte1}-${parte2}` : parte1;
}
const onInputCep = (event) => {
  endereco.value.Cep = formatCep(event.target.value);
};
function debounce(fn, ms = 500) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
async function buscarEnderecoViaCep() {
  const cepNumeros = (enderecoForm.value.cep || "").replace(/\D/g, "");
  if (!cepNumeros || cepNumeros.length !== 8) return;
  try {
    const res = await connection.get(
      `https://viacep.com.br/ws/${cepNumeros}/json/`
    );
    if (res.data.erro) return toast.error("CEP não encontrado");
    enderecoForm.value.rua = res.data.logradouro || "";
    enderecoForm.value.bairro = res.data.bairro || "";
    enderecoForm.value.cidade = res.data.localidade || "";
    enderecoForm.value.estado = res.data.uf || "";
  } catch (err) {
    toast.error("Erro ao buscar endereço via CEP");
  }
}
const buscarEnderecoViaCepDebounced = debounce(buscarEnderecoViaCep, 500);
watch(() => enderecoForm.value.cep, buscarEnderecoViaCepDebounced);

async function getPagamentos() {
  try {
    const res = await connection.get(
      `/desapega/pagamentos/usuario/${retrieve?.value.id}`
    );
    if (res.status === 200) {
      pagamentoUUID.value = res.data.pagamento_uuid;
      pagamentoUsuarioStatus.value = res.data.status_pagamento_id
    }
  } catch (err) {
    console.log(err);
  }
}

onMounted(async () => {
  if (!tokenExiste.value) return router.push("/");

  await getRetrieve();
  if (!retrieve.value) return;
  await Promise.all([
    getCarrinho(),
    getProdutos(),
    carregarFormasPagamento(),
    getEndereco(),
  ]);
  setarCarrinhoUser();
  getPagamentos();

  const pagamento = await buscarPagamentoUsuario();
  if (pagamento?.id) {
    if(pagamentoUsuarioStatus.value == 1){
      existePagamento.value = true;
    }
    pagamentoUUID.value =
      pagamento.pagamento_uuid ||
      pagamento.uuid ||
      pagamento.pagamentoUuid ||
      "";
  }
});

async function carregarCarrinhoCompleto() {

  carregandoCarrinho.value = true;
  erroGetProduto.value = false;

  try {
    if (!retrieve.value) {
      await getRetrieve();
      if (!retrieve.value) throw new Error("Usuário não logado/encontrado.");
    }


    await Promise.all([
      getCarrinho(),
      getProdutos(), 
      carregarFormasPagamento(),
      getEndereco(),
      getPagamentos(),
    ]);

 
    setarCarrinhoUser();

   
    const pagamento = await buscarPagamentoUsuario();
    if (pagamento?.id) {
      existePagamento.value = true;
      pagamentoUUID.value = pagamento.pagamento_uuid || pagamento.uuid || "";
    }
  } catch (err) {
    console.error("carregarCarrinhoCompleto erro:", err);
    erroGetProduto.value = true;
    toast.error(
      err.response?.data?.message ||
        "Erro ao carregar dados do carrinho/produtos"
    );
  } finally {
 
    carregandoCarrinho.value = false;
  }
}
watch(metodoEntrega, (novo, antigo) => {
  if (novo === "entrega" && enderecoIncompleto(enderecoUsuario.value)) {
    metodoEntrega.value = antigo;
    modalConfirmacaoOpen.value = false;

    setTimeout(
      () => enderecoForm.value && (modalConfirmacaoOpen.value = false),
      0
    );
  }
});

function enderecoIncompleto(end) {
  if (!end) return true;
  const obrigatorios = ["cep", "estado", "cidade", "bairro", "rua", "numero"];
  return obrigatorios.some(
    (campo) => !end[campo] || end[campo].toString().trim() === ""
  );
}
</script>

<style scoped>
@import "../css/paginaCarrinho/carrinho.css";
</style>
