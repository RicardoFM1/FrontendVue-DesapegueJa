<template>
  <v-layout v-if="tokenExiste" class="bg-grey-lighten-5 d-flex flex-column">
    <v-container class="py-6" style="max-width: 1400px">
      <v-row align="center">
        <v-col cols="12">
          <v-btn
            variant="text"
            color="primary"
            prepend-icon="mdi-arrow-left"
            @click="voltar"
            class="text-body-1 font-weight-bold pa-0 ml-n2 text-capitalize mb-4"
          >
            Voltar às compras
          </v-btn>
          <h1
            class="text-h4 font-weight-bold text-grey-darken-3 d-flex align-center"
          >
            <v-icon size="36" color="primary" class="mr-2"
              >mdi-cart-outline</v-icon
            >
            Seu Carrinho
          </h1>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="pb-10 pt-0" style="max-width: 1400px">
      <v-row v-if="carregandoCarrinho" justify="center">
        <v-col cols="12" class="text-center py-12">
          <v-progress-circular
            size="64"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <p class="mt-4 text-h6 text-grey-darken-1">
            Carregando seu carrinho... aguarde
          </p>
        </v-col>
      </v-row>

      <v-row v-else-if="erroGetProduto" justify="center">
        <v-col cols="12" md="6">
          <v-alert
            type="error"
            variant="tonal"
            title="Erro ao listar seu carrinho 😢"
            text="Não foi possível carregar os itens. Verifique sua conexão e tente novamente."
            icon="mdi-wifi-off"
            class="my-8"
          >
            <template #append>
              <v-btn
                color="error"
                variant="outlined"
                size="small"
                prepend-icon="mdi-refresh"
                @click="carregarCarrinhoCompleto"
                :disabled="carregandoCarrinho"
              >
                Tentar novamente
              </v-btn>
            </template>
          </v-alert>
        </v-col>
      </v-row>

      <v-row v-else-if="carrinhoUser.length === 0" justify="center">
        <v-col cols="12" md="6" class="text-center py-12">
          <v-icon size="80" color="grey-lighten-1"
            >mdi-basket-remove-outline</v-icon
          >
          <h2 class="text-h5 font-weight-medium mt-4 mb-3">
            Seu carrinho está vazio 😢
          </h2>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            Parece que você ainda não adicionou nenhum produto.
          </p>
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            @click="voltar"
            rounded="lg"
          >
            Começar a Comprar
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" md="8">
          <v-card class="pa-4 pa-md-6 rounded-xl elevation-2">
            <h2 class="text-h6 font-weight-bold mb-4">
              Produtos ({{ carrinhoUser.length }} item(ns))
            </h2>
            <v-divider class="mb-4"></v-divider>

            <div
              v-for="(item, index) in carrinhoUser"
              :key="item.id"
              class="mb-4"
            >
              <v-card
                variant="outlined"
                class="pa-3 rounded-lg d-flex align-center"
                :class="{ 'bg-red-lighten-5': item.estoque === 0 }"
              >
                <v-avatar size="100" rounded="lg" class="mr-4 flex-shrink-0">
                  <v-img
                    :src="getProdutoImage(item.imagem)"
                    cover
                    :alt="item?.nome"
                  >
                    <template #error>
                      <v-icon size="40" color="grey-lighten-1"
                        >mdi-image-off-outline</v-icon
                      >
                    </template>
                  </v-img>
                </v-avatar>

                <div class="flex-grow-1 mr-4">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <div
                        v-bind="props"
                        class="text-subtitle-1 font-weight-bold mb-1 text-truncate"
                        style="max-width: 300px"
                      >
                        {{ item?.nome || "Produto indisponível" }}
                      </div>
                    </template>
                    <span>{{ item?.nome || "Produto indisponível" }}</span>
                  </v-tooltip>

                  <div class="text-h6 font-weight-black text-success">
                    {{
                      ((item?.preco * item?.quantidade) / 100).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                      )
                    }}
                  </div>
                  <div class="text-h6 text-grey-darken-1">
                    ({{
                      (item?.preco / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    }}
                    por unidade)
                  </div>

                  <v-chip
                    v-if="item.estoque === 0"
                    color="error"
                    size="small"
                    variant="flat"
                    class="mt-2 text-h6"
                    prepend-icon="mdi-alert-octagon"
                  >
                    Última unidade!!
                  </v-chip>
                </div>

                <div
                  class="d-flex flex-column align-end flex-shrink-0"
                  style="width: 150px"
                >
                  <v-select
                    v-model="item.quantidade"
                    :items="
                      Array.from(
                        {
                          length: Math.min(
                            item.estoque > 0 ? item.estoque : 1,
                            100
                          ),
                        } /* Limita a quantidade máxima razoável */,
                        (_, i) => i + 1
                      )
                    "
                    @update:modelValue="atualizarQuantidade(item)"
                    density="compact"
                    hide-details
                    label="Qtd."
                    variant="outlined"
                    :disabled="item.estoque === 0"
                    class="mb-3"
                  ></v-select>

                  <div class="d-flex">
                    <v-btn
                      variant="tonal"
                      color="primary"
                      size="small"
                      class="mr-2"
                      @click="toDetalhes(item.id)"
                      :disabled="carregandoInformacoes"
                    >
                      Ver Detalhes
                    </v-btn>

                    <v-btn
                      icon
                      variant="text"
                      color="error"
                      size="small"
                      @click="clickRemover(item)"
                    >
                      <v-icon>mdi-trash-can-outline</v-icon>
                      <v-tooltip activator="parent" location="top"
                        >Remover</v-tooltip
                      >
                    </v-btn>
                  </div>
                </div>
              </v-card>

              <v-divider
                v-if="index < carrinhoUser.length - 1"
                class="my-4"
              ></v-divider>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            class="cart-summary pa-4 pa-md-6 rounded-xl elevation-4 sticky-summary"
          >
            <h2 class="text-h5 font-weight-bold mb-4">Resumo da Compra</h2>
            <v-divider class="mb-4"></v-divider>

            <div class="d-flex justify-space-between text-body-1 mb-2">
              <span>Subtotal:</span>
              <span class="font-weight-bold">{{
                (subtotal / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}</span>
            </div>
            <div class="d-flex justify-space-between text-body-1 mb-4">
              <span>Frete (Entrega):</span>
              <span
                :class="{
                  'text-orange font-weight-bold': metodoEntrega === 'entrega',
                  'text-grey': metodoEntrega !== 'entrega',
                }"
              >
                {{
                  metodoEntrega === "entrega"
                    ? (15).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "Grátis/Combinar"
                }}
              </span>
            </div>

            <v-divider class="mb-4"></v-divider>

            <div class="d-flex justify-space-between text-h6 mb-6">
              <span>Total:</span>
              <span class="font-weight-black text-primary">{{
                (totalComFrete / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}</span>
            </div>

            <v-card variant="outlined" class="pa-4 mb-4 rounded-lg">
              <h3
                class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center"
              >
                <v-icon size="20" color="primary" class="mr-2"
                  >mdi-truck-outline</v-icon
                >
                Método de Entrega
              </h3>

              <v-radio-group
                v-model="metodoEntrega"
                :disabled="existePagamento || loadingComprar"
                hide-details
              >
                <v-radio
                  label="Combinar com o vendedor"
                  value="combinar"
                  color="success"
                ></v-radio>
                <v-radio
                  label="Entrega (adiciona R$15)"
                  value="entrega"
                  color="success"
                />
              </v-radio-group>

              <v-expand-transition>
                <v-alert
                  v-if="
                    (metodoEntrega === 'entrega' ||
                      metodoPagamento.toLowerCase() === 'boleto') &&
                    enderecoIncompleto(enderecoUsuario)
                  "
                  type="warning"
                  icon="mdi-map-marker-alert"
                  class="my-3"
                  variant="tonal"
                  density="compact"
                >
                  <p class="font-weight-bold">Endereço Incompleto!</p>
                  <p>
                    Complete seu endereço para a entrega.
                    <v-btn
                      variant="text"
                      size="small"
                      class="pa-0 text-decoration-underline"
                      @click="modalEndereco = true"
                      >Clique aqui</v-btn
                    >
                  </p>
                </v-alert>
              </v-expand-transition>

              <v-expand-transition>
                <v-sheet
                  v-if="metodoEntrega === 'combinar'"
                  class="pa-3 mt-3 bg-blue-lighten-5"
                  rounded="lg"
                  variant="flat"
                >
                  <div class="d-flex align-center">
                    <v-icon color="blue" class="mr-2"
                      >mdi-handshake-outline</v-icon
                    >
                    <p class="text-body-2">
                      Você combinará a retirada/entrega diretamente com o
                      vendedor após a compra.
                    </p>
                  </div>
                </v-sheet>
              </v-expand-transition>
            </v-card>

            <v-card variant="outlined" class="pa-4 mb-6 rounded-lg">
              <h3
                class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center"
              >
                <v-icon size="20" color="primary" class="mr-2"
                  >mdi-credit-card-settings-outline</v-icon
                >
                Forma de Pagamento
              </h3>

              <v-radio-group
                v-if="formasPagamento.length"
                v-model="metodoPagamento"
                :disabled="existePagamento || loadingComprar"
                hide-details
              >
                <v-radio
                  v-for="forma in formasPagamento"
                  :key="forma.id"
                  :label="forma.forma"
                  :value="forma.forma"
                  color="success"
                />
              </v-radio-group>

              <div v-else class="text-body-2 text-red-darken-2">
                Nenhuma forma de pagamento disponível.
              </div>
            </v-card>

            <v-expand-transition>
              <v-alert
                v-if="
                  metodoPagamento.toLowerCase() === 'boleto' && subtotal < 500
                "
                type="error"
                icon="mdi-alert"
                class="my-4"
                variant="tonal"
                density="compact"
              >
                <p class="font-weight-bold"></p>
                <p class="text-caption">
                  Para continuar com o pagamento com boleto, o total precisa ser
                  no mínimo R$5,00.
                </p>
              </v-alert>
            </v-expand-transition>

            <v-expand-transition>
              <v-alert
                v-if="existePagamento"
                type="info"
                icon="mdi-cash-lock-open"
                class="my-4"
                color="blue-darken-1"
                variant="tonal"
                density="compact"
              >
                <p class="font-weight-bold">Pagamento em Andamento</p>
                <p class="text-caption">
                  Você já tem um pedido pendente. Clique em "Verificar
                  Pagamento" abaixo.
                </p>
              </v-alert>
            </v-expand-transition>

            <v-btn
              v-if="existePagamento"
              color="blue-darken-1"
              variant="flat"
              block
              size="large"
              prepend-icon="mdi-barcode-scan"
              @click="irParaPagamento"
              class="font-weight-bold mb-3"
              rounded="lg"
            >
              Verificar Pagamento
            </v-btn>

            <v-btn
              v-else
              color="success"
              variant="flat"
              block
              size="large"
              :loading="loadingComprar"
              @click="comprar"
              :disabled="
                loadingComprar ||
                existePagamento ||
                !metodoPagamento ||
                (metodoEntrega === 'entrega' &&
                  enderecoIncompleto(enderecoUsuario)) ||
                (metodoPagamento.toLowerCase() === 'boleto' &&
                  subtotal < 500) ||
                (metodoPagamento.toLowerCase() === 'boleto' &&
                  enderecoIncompleto(enderecoUsuario))
              "
              class="font-weight-bold"
              rounded="lg"
            >
              <v-icon left>mdi-cash-check</v-icon>
              Finalizar Compra
            </v-btn>

            <v-btn
              variant="text"
              color="grey-darken-1"
              block
              class="mt-3 text-capitalize"
              @click="voltar"
            >
              Continuar Comprando
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>



<v-dialog v-model="modalCartaoOpen" max-width="600px" persistent>
  <v-card class="pa-6 rounded-xl">
    <v-card-title class="text-h5 font-weight-bold mb-4">
      Dados do Cartão
    </v-card-title>

    <div id="cardPaymentBrickContainer" style="min-height: 350px;"></div>

    <p class="mt-4 text-caption text-grey-darken-1">
      Pagamento seguro processado diretamente pelo Mercado Pago.
    </p>

    <v-card-actions class="justify-end pt-4">
      <v-btn
        color="grey"
        variant="text"
        @click="
          modalCartaoOpen = false;
          metodoPagamento = 'Pix';
        "
      >
        Cancelar
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>




    <v-dialog max-width="450" v-model="modalConfirmacaoOpen" persistent>
      <v-card class="pa-6 rounded-xl elevation-10 text-center">
        <v-avatar color="red-lighten-5" size="70" class="mb-4">
          <v-icon color="error" size="40">mdi-trash-can-outline</v-icon>
        </v-avatar>
        <v-card-title class="text-h5 font-weight-bold mb-2">
          Remover Produto?
        </v-card-title>

        <v-card-text class="text-body-1 text-medium-emphasis">
          Tem certeza que deseja remover este item do seu carrinho?
        </v-card-text>

        <v-card-actions class="justify-center mt-4">
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

    <v-dialog v-model="modalEndereco" max-width="600px" max-height="900px">
      <v-card class="pa-6 rounded-xl">
        <v-card-title class="text-h5 font-weight-bold pa-0 mb-4 text-center">
          <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
          Atualizar Endereço
        </v-card-title>
        <v-divider class="mb-6"></v-divider>
        <v-form @submit.prevent="salvarAlteracoesEndereco">
          <v-text-field
            label="CEP"
            v-model="enderecoForm.Cep"
            append-inner-icon="mdi-close-circle"
            @click:append-inner="
              (enderecoForm.Cep = ''),
                (enderecoForm.Bairro = ''),
                (enderecoForm.Cidade = ''),
                (enderecoForm.Estado = ''),
                (enderecoForm.Rua = '')
            "
            placeholder="00000-000"
            @input="onInputCep"
            variant="outlined"
            density="comfortable"
          ></v-text-field>

          <v-select
            label="Estado"
            v-model="enderecoForm.Estado"
            :readonly="readOnlyComCEP"
            :items="[
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
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
          ></v-select>

          <v-text-field
            label="Cidade"
            v-model="enderecoForm.Cidade"
            :readonly="readOnlyComCEP"
            variant="outlined"
            density="comfortable"
          ></v-text-field>

          <v-text-field
            label="Bairro"
            v-model="enderecoForm.Bairro"
            :readonly="readOnlyComCEP"
            variant="outlined"
            density="comfortable"
          ></v-text-field>

          <v-row>
            <v-col cols="9" class="py-0">
              <v-text-field
                label="Rua"
                v-model="enderecoForm.Rua"
                :readonly="readOnlyComCEP"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0">
              <v-text-field
                label="Número"
                v-model="enderecoForm.Numero"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-select
            label="Tipo de logradouro"
            v-model="enderecoForm.Logradouro"
            :items="[
              { title: 'Rua', value: 'rua' },
              { title: 'Avenida', value: 'avenida' },
              { title: 'Praça', value: 'praca' },
              { title: 'Travessa', value: 'travessa' },
              { title: 'Outros', value: 'outros' },
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
          ></v-select>

          <v-text-field
            label="Complemento"
            v-model="enderecoForm.Complemento"
            variant="outlined"
            density="comfortable"
          ></v-text-field>

          <v-card-actions class="justify-end pt-4">
            <v-btn
              color="grey"
              variant="outlined"
              @click="modalEndereco = false"
              class="text-capitalize"
            >
              Fechar
            </v-btn>
            <v-btn
              color="primary"
              :loading="loadingEndereco"
              type="submit"
              variant="flat"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script setup>
import { connection } from "@/connection/axiosConnection";
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
console.log(token.value);
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
const modalEndereco = ref(false);

const enderecoForm = ref({
  Cep: "",
  Estado: "",
  Cidade: "",
  Bairro: "",
  Rua: "",
  Numero: "",
  Logradouro: "",
  Complemento: "",
  Status: "",
});

const enderecoUsuario = ref(null);
const pagamentoUUID = ref("");
const existePagamento = ref(false);
const pagamentoUsuarioStatus = ref();

const frete = computed(() => (metodoEntrega.value === "entrega" ? 1500 : 0));
const subtotal = computed(() =>
  carrinhoUser.value.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  )
);
const totalComFrete = computed(() => subtotal.value + frete.value);
const readOnlyComCEP = computed(() => {
  const numeros = (enderecoForm.value.Cep || "").replace(/\D/g, "");
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

async function verificarStatusPagamentoPendende() {
  const pagamentos = await buscarPagamentoUsuario();

  const pagamentoPendente = (pagamentos || []).find(
    (p) => p.status_pagamento_id === 1
  );

  if (pagamentoPendente) {
    existePagamento.value = true;
    pagamentoUUID.value = pagamentoPendente.pagamento_uuid;
  } else {
    existePagamento.value = false;
    pagamentoUUID.value = "";
  }
}
const salvarAlteracoesEndereco = async () => {
  loadingEndereco.value = true;
  try {
    const body = {
      cep: enderecoForm.value.Cep,
      estado: enderecoForm.value.Estado,
      cidade: enderecoForm.value.Cidade,
      bairro: enderecoForm.value.Bairro,
      rua: enderecoForm.value.Rua,
      numero: enderecoForm.value.Numero,
      logradouro: enderecoForm.value.Logradouro,
      complemento: enderecoForm.value.Complemento,
      status: enderecoForm.value.Status,
    };
    const res = await connection.patch(
      `/desapega/enderecos/${retrieve.value.id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    if (res.status === 200 || res.status === 204) {
      toast.success("Alterações salvas com sucesso!", { autoClose: 2000 });
      setTimeout(() => {
        router.go(0);
      }, 2000);
    } else {
      toast.error(res.data?.message || "Erro ao salvar alterações");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao atualizar perfil");
  } finally {
    loadingEndereco.value = false;
  }
};
const MP_PUBLIC_KEY = "APP_USR-842098d7-130d-481a-a80a-0925855f6f12";
const cardTokenGerado = ref("");
const paymentMethodIdCartao = ref("");
const modalCartaoOpen = ref(false);
watch(metodoPagamento, (m) => {
  if (metodoPagamento.value.toLowerCase() === "cartão") {
    modalCartaoOpen.value = true;
  }
 
});
const cardToken = ref(null);
const paymentMethodId = ref(null);
const mpInstance = ref(null);
const cardPaymentBrick = ref(null);

watch(modalCartaoOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    setTimeout(() => {
      if (!mpInstance.value) {
        console.error("MP não carregou ainda");
        return;
      }
      renderizarCardPaymentBrick();
    }, 300);
  } else {
    try {
      mpInstance.value?.bricks()?.destroy(cardPaymentBrick.value);
    } catch(e) {}
    cardPaymentBrick.value = null;
  }
});





function renderizarCardPaymentBrick() {
  const brickContainer = document.getElementById("cardPaymentBrickContainer");
  if (!brickContainer || !mpInstance.value) return;
  if (cardPaymentBrick.value) return;


  const valorCompra = Math.round(Number(totalComFrete.value)); 

  cardPaymentBrick.value = mpInstance.value.bricks().create("cardPayment", "cardPaymentBrickContainer", {
    initialization: {
      amount: valorCompra,
      accessToken: 'APP_USR-5088250160831492-112622-78f1e9f3fe417468dea4362a85e3f1a2-3009140010',
      payer: {
        email: retrieve.value.email, 
      },
    },
    customization: {
      visual: {
        style: {
          theme: "default", 
        },
      },
    },
    callbacks: {
      onReady: () => {
        console.log("✅ Card Payment Brick PRONTO.");
      },
      onSubmit: (cardFormData) => {
        console.log("Token gerado:", cardFormData.token);
        cardToken.value = cardFormData.token;
        paymentMethodId.value = cardFormData.payment_method_id;
        modalCartaoOpen.value = false;
        comprar();
      },
      onError: (error) => {
        console.error("Erro Brick:", error);
      },
    },
  });
}

async function comprar() {
  if (!carrinhoUser.value.length) {
    toast.error("Seu carrinho está vazio");
    return;
  }

  if (
    (metodoEntrega.value === "entrega" ||
      metodoPagamento.value.toLowerCase() === "boleto") &&
    enderecoIncompleto(enderecoUsuario.value)
  ) {
    modalEndereco.value = true;
    toast.warning("Para 'Entrega', complete seu endereço!", {
      autoClose: 3000,
    });
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
      card_token: cardTokenGerado.value,
      payment_method_id: paymentMethodIdCartao.value,
      parcelas: 1,
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

async function atualizarQuantidade(item) {
  item.quantidade = Number(item.quantidade);
  carrinhoUser.value = [...carrinhoUser.value];
  try {
    const body = {
      quantidade: item.quantidade,
    };
    const res = await connection.patch(
      `/desapega/carrinho/${retrieve?.value.id}/${item.id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    if (res.status === 200 || res.status === 201) {
      toast.success("Quantidade atualizada com sucesso!", { autoClose: 2000 });
    } else {
      toast.error("Erro ao tentar atualizar essa quantidade", {
        autoClose: 2000,
      });
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Erro ao tentar atualizar essa quantidade do produto"
    );
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
    setTimeout(async () => {
      router.go(0);
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
function toDetalhes(id) {
  router.push(`/produto/${id}`);
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
  enderecoForm.value.Cep = formatCep(event.target.value);
};
function debounce(fn, ms = 500) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
async function buscarEnderecoViaCep() {
  const cepNumeros = (enderecoForm.value.Cep || "").replace(/\D/g, "");
  if (!cepNumeros || cepNumeros.length !== 8) return;
  try {
    const res = await connection.get(
      `https://viacep.com.br/ws/${cepNumeros}/json/`
    );
    if (res.data.erro) return toast.error("CEP não encontrado");
    enderecoForm.value.Rua = res.data.logradouro || "";
    enderecoForm.value.Bairro = res.data.bairro || "";
    enderecoForm.value.Cidade = res.data.localidade || "";
    enderecoForm.value.Estado = res.data.uf || "";
  } catch (err) {
    toast.error("Erro ao buscar endereço via CEP");
  }
}
const buscarEnderecoViaCepDebounced = debounce(buscarEnderecoViaCep, 500);
watch(() => enderecoForm.value.Cep, buscarEnderecoViaCepDebounced);

async function getPagamentos() {
  try {
    const res = await connection.get(
      `/desapega/pagamentos/usuario/${retrieve?.value.id}`
    );
    if (res.status === 200) {
      pagamentoUUID.value = res.data.pagamento_uuid;
      pagamentoUsuarioStatus.value = res.data.status_pagamento_id;
    }
  } catch (err) {
    console.log(err);
  }
}

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    router.push("/:pathMatch(.*)*");
    return;
  }

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
  verificarStatusPagamentoPendende();

  const pagamento = await buscarPagamentoUsuario();
  if (pagamento?.id) {
    if (pagamentoUsuarioStatus.value == 1) {
      existePagamento.value = true;
    }
    pagamentoUUID.value =
      pagamento.pagamento_uuid ||
      pagamento.uuid ||
      pagamento.pagamentoUuid ||
      "";
  }
   if (window.MercadoPago) {
    mpInstance.value = new window.MercadoPago(MP_PUBLIC_KEY, {
     
    });
    console.log("MP Instance inicializada:", mpInstance.value);
  } else {
    console.error("Mercado Pago SDK não encontrado na janela.");
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
      verificarStatusPagamentoPendende(),
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
  if (
    (novo === "entrega" || metodoPagamento.value.toLowerCase() === "boleto") &&
    enderecoIncompleto(enderecoForm.value)
  ) {
    modalEndereco.value = true;
    toast.warning("Complete seu endereço para usar a opção 'Entrega'.", {
      autoClose: 3000,
    });
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
