<template>
  <v-container style="display: flex" class="pa-6" v-if="tokenExiste">
    <v-container class="containerAllPerfil">
      <div v-if="loadingInit" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-3">Carregando informações...</p>
      </div>
      <v-card v-else class="mx-auto pa-6" max-width="600">
        <v-card-title class="text-h5 text-center"
          >Perfil do Usuário</v-card-title
        >
        <v-divider class="my-4"></v-divider>

        <v-row class="justify-center mb-4">
          <v-col cols="12" class="text-center">
            <v-avatar class="mr-3" size="120">
              <template v-if="!imagemPerfil || imagemPerfil == 'Sem imagem'">
                <v-icon size="80">mdi-account-circle</v-icon>
              </template>
              <template v-else>
                <v-img :src="imagemPerfil" alt="Foto de Perfil" cover />
              </template>
            </v-avatar>

            <v-btn
              variant="outlined"
              color="primary"
              class="mt-3"
              @click="abrirExplorador"
            >
              Alterar Foto
            </v-btn>
            <v-btn
              variant="outlined"
              color="red"
              class="mt-3 ml-3"
              @click="removerImagem"
            >
              Remover Foto
            </v-btn>

            <input
              type="file"
              ref="inputArquivo"
              accept="image/png, image/x-png"
              @change="carregarImagem"
              style="display: none"
            />
          </v-col>
        </v-row>

        <v-form ref="formRef" @submit.prevent="salvarAlteracoes">
          <v-text-field
            v-model="usuario.Nome"
            label="Nome de usuário"
            prepend-inner-icon="mdi-account"
          />

          <v-text-field
            v-model="usuario.email"
            label="Email"
            prepend-inner-icon="mdi-email"
            :rules="rulesEmail"
          />

          <v-text-field
            v-model="usuario.senha"
            :type="mostrarSenha ? 'text' : 'password'"
            label="Senha"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="mostrarSenha = !mostrarSenha"
            :rules="rulesSenha"
          />

          <v-text-field
            ref="inputCPF"
            v-model="usuario.CPF"
            label="CPF"
            prepend-inner-icon="mdi-card-account-details"
            placeholder="000.000.000-00"
            @input="usuario.CPF = formatCPF($event.target.value)"
          />

          <v-text-field
            ref="inputData"
            v-model="usuario.dataNascimento"
            label="Data de Nascimento"
            prepend-inner-icon="mdi-calendar"
            placeholder="DD/MM/AAAA"
            :rules="rulesDataNascimento"
            @input="usuario.dataNascimento = formatData($event.target.value)"
          />
         <div style="display: flex; gap: 10px; width: 100%;">
 <v-select
  :items="ddiOptions"
  v-model="usuario.ddi"
  item-title="text"
  item-value="value"
  variant="outlined"
  density="comfortable"
  hide-details="auto"
  base-color="#293559"
  style="max-width: 140px;"
  label="DDI"
  rounded="lg"
  :rules="rulesDDI"
  required
/>


  <v-text-field
    label="Telefone"
    v-model="usuario.Telefone"
    prepend-inner-icon="mdi-cellphone"
    :rules="rulesTelefone"
    base-color="#293559"
    density="comfortable"
    variant="outlined"
    rounded="lg"
  />
</div>

          <v-row class="mt-6" justify="center" align="center">
            <v-btn
              color="grey"
              class="mr-3"
              variant="outlined"
              type="button"
              @click="recarregarPagina"
            >
              Recarregar
            </v-btn>
            <v-btn
              color="primary"
              :loading="loading"
              class="mr-3"
              type="submit"
            >
              Salvar Alterações
            </v-btn>
            <v-btn
              color="grey"
              variant="outlined"
              type="button"
              @click="voltarHome"
            >
              Cancelar
            </v-btn>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
    <v-container class="pa-6" v-if="tokenExiste">
      <div v-if="loadingInit" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-3">Carregando informações...</p>
      </div>
      <v-card v-else class="mx-auto pa-6" max-width="600">
        <v-card-title class="text-h5 pa-5 text-center">
          Endereço do usuário
        </v-card-title>
        <v-divider class="my-4"></v-divider>
        <v-form @submit.prevent="salvarAlteracoesEndereco">
          <v-text-field
            label="CEP"
            v-model="endereco.Cep"
            append-inner-icon="mdi-delete"
            @click:append-inner="
              (endereco.Cep = ''),
                (endereco.Bairro = ''),
                (endereco.Cidade = ''),
                (endereco.Estado = ''),
                (endereco.Rua = '')
            "
            placeholder="00000-00"
            @input="onInputCep"
          >
          </v-text-field>
          <v-select
            label="Estado"
            v-model="endereco.Estado"
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
            v-model="endereco.Cidade"
            :readonly="readOnlyComCEP"
          >
          </v-text-field>
          <v-text-field
            label="Bairro"
            v-model="endereco.Bairro"
            :readonly="readOnlyComCEP"
          >
          </v-text-field>
          <v-row>
            <v-text-field
              label="Rua"
              class="ml-3 mr-3"
              v-model="endereco.Rua"
              :readonly="readOnlyComCEP"
            >
            </v-text-field>

            <v-text-field
              label="Número"
              class="mr-3"
              max-width="50%"
              v-model="endereco.Numero"
            >
            </v-text-field>
          </v-row>
          <v-select
            label="Tipo de logradouro"
            v-model="endereco.Logradouro"
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
          <v-text-field label="Complemento" v-model="endereco.Complemento">
          </v-text-field>
          <v-select
            label="Status"
            v-model="endereco.Status"
            :items="[
              { title: '', value: '' },
              { title: 'Ativo', value: 'ativo' },
              { title: 'Inativo', value: 'inativo' },
            ]"
            item-title="title"
            item-value="value"
          >
            >
          </v-select>

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
              @click="voltarHome"
            >
              Cancelar
            </v-btn>
          </v-row>
        </v-form>
      </v-card>
      <v-row class="mt-4" justify="center" align="center">
        <v-btn
          v-if="!loadingInit"
          text="Excluir conta"
          color="red"
          @click="confirmacaoSair = !confirmacaoSair"
        >
        </v-btn>
      </v-row>
      <div class="divItens">
            <v-card
              width="330"
              min-height="300"
              class="cardItem"
              v-for="(item, index) in produtos"
              :key="item + '-' + index"
            >
              <v-img
                :src="getProdutoImage(item.imagem)"
                width="330"
                position="center"
                height="330"
                cover
                class="imgItem"
              >
                <template #error>
                  <img src="/png-triste-erro.png" alt="Imagem não disponível" />
                </template>
              </v-img>

              <v-card-title class="ellipses mb-2 rounded font-weight-bold">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p v-bind="props">
                      {{ item.nome }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    {{ item.nome }}
                  </span>
                </v-tooltip>
              </v-card-title>
              <v-card-subtitle
                style="width: 50%"
                class="mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p
                      v-bind="props"
                      class="text-subtitle-1 ellipses bg-green text-white rounded px-2 py-1 d-inline-block"
                    >
                      R$ {{ item.preco / 100 }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    R$ {{ item.preco / 100 }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>
              <v-card-subtitle
                class="ellipses text-subtitle-1 mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p style="width: 50%" class="ellipses" v-bind="props">
                      Em estoque: {{ item.estoque }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Estoque : {{ item.estoque }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>
              <v-chip
                class="text-subtitle-1 mb-2 ml-3 rounded font-weight-bold elevation-1"
                size="small"
                text-color="white"
                :color="
                  categorias.find((c) => c.id == item.categoria_id)?.cor ||
                  '#808080'
                "
                pill
                outlined
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p
                      class="ellipses"
                      v-bind="props"
                      v-if="categorias.length > 0"
                    >
                      <v-icon left small class="mr-2">mdi-tag</v-icon>
                      {{
                        categorias.find((c) => c.id == item.categoria_id)
                          ?.nome || "Sem categoria"
                      }}
                    </p>
                    <p v-else>Carregando categoria...</p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Categoria :
                    {{
                      categorias.find((c) => c.id == item.categoria_id)?.nome ||
                      "Sem categoria"
                    }}
                  </span>
                </v-tooltip>
              </v-chip>

              <v-chip
                class="text-subtitle-1 mb-2 ml-3 rounded font-weight-bold elevation-1"
                size="small"
                text-color="white"
                pill
                outlined
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p
                      class="ellipses"
                      v-bind="props"
                      v-if="vendedor.length > 0"
                    >
                      <v-icon left small class="mr-2">mdi-account</v-icon>
                      {{
                        vendedor.find((v) => v.id == item.usuario_id)?.nome ||
                        "Sem vendedor "
                      }}
                    </p>
                    <p v-else>Carregando vendedor...</p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Vendedor :
                    {{
                      vendedor.find((v) => v.id == item.usuario_id)?.nome ||
                      "Sem vendedor"
                    }}
                  </span>
                </v-tooltip>
              </v-chip>

              <div class="divBtnAdicionar">
                <v-card-actions class="divBtnsAcoes">
                  <v-btn
                    variant="flat"
                    color="#2196F3"
                    class="btnDetalhes"
                    @click="toDetalhes(item.id)"
                    density="comfortable"
                    :disabled="carregandoInformacoes"
                  >
                    Detalhes
                  </v-btn>

                  <v-btn
                    variant="flat"
                    color="#3fa34f"
                    prepend-icon="mdi-cart"
                    density="comfortable"
                    class="btnAdicionar"
                    @click="addToCart(item)"
                    :disabled="carregandoInformacoes || item.estoque <= 0"
                  >
                    Adicionar ao carrinho
                  </v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </div>
      <v-dialog
        max-width="500"
        v-model="confirmacaoSair"
        v-if="confirmacaoSair"
      >
        <v-card class="pa-4" elevation="8" rounded="xl">
          <v-card-title class="text-center font-weight-bold text-h4">
            <v-icon color="error" size="32" class="mr-2"
              >mdi-alert-circle-outline</v-icon
            >
            Confirmar Exclusão
          </v-card-title>

          <v-card-text class="text-center text-h5 text-medium-emphasis">
            Deseja realmente excluir sua conta?
          </v-card-text>

          <v-card-actions class="justify-center mt-2">
            <v-btn
              color="grey"
              variant="outlined"
              rounded="xl"
              @click="confirmacaoSair = false"
              width="120"
            >
              Cancelar
            </v-btn>

            <v-btn
              color="error"
              variant="flat"
              rounded="xl"
              width="120"
              :loading="loadingExclusao"
              @click="ExcluirConta"
            >
              EXCLUIR
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { toast } from "vue3-toastify";
import { connection } from "@/connection/axiosConnection";
import { useRouter } from "vue-router";

const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

onMounted(async () => {
  if (!tokenExiste.value) {
    router.push("/");
  }
});

const formRef = ref(null);
const ddiOptions = [
  { text: "+1 EUA", value: "1" },
  { text: "+34 Espanha", value: "34" },
  { text: "+44 Reino Unido", value: "44" },
  { text: "+49 Alemanha", value: "49" },
  { text: "+52 México", value: "52" },
  { text: "+55 Brasil", value: "55" },
  { text: "+351 Portugal", value: "351" },
];

const usuario = ref({
  Nome: "",
  email: "",
  senha: "",
  dataNascimento: "",
  CPF: "",
  Telefone: "",
  ddi: "55"
});

const endereco = ref({
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

const mostrarSenha = ref(false);
const loading = ref(false);
const loadingEndereco = ref(false);
const imagemPerfil = ref(null);
const inputArquivo = ref(null);
const readOnlyComCEP = computed(() => {
  const numeros = endereco.value.Cep?.replace(/\D/g, "") || "";
  return numeros.length === 8;
});
const carregandoProdutos = ref(false)
const erroGetProduto = ref(false)
const produtos = ref([])
const rulesEmail = [
  (v) =>
    !v ||
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v) ||
    "E-mail inválido",
];
const rulesSenha = [
  (v) =>
    !v ||
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      v
    ) ||
    "Senha inválida, mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo",
];
const rulesDataNascimento = [
  (v) =>
    !v ||
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(v) ||
    "Data inválida",
];
const rulesTelefone = [(v) => !v];
const formatTelefone = (v) => v.replace(/\D/g, "");

const formatCep = (value) => {
  let numeros = value.replace(/\D/g, "").slice(0, 8);

  let parte1 = numeros.slice(0, 5);
  let parte2 = numeros.slice(5, 8);

  if (parte2) return `${parte1}-${parte2}`;
  return parte1;
};

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const buscarEnderecoViaCep = async () => {
  const cepNumeros = endereco.value.Cep.replace(/\D/g, "");

  if (cepNumeros.length === 0) return;

  if (cepNumeros.length !== 8) return;

  try {
    const res = await connection.get(
      `https://viacep.com.br/ws/${cepNumeros}/json/`
    );

    if (res.data.erro) {
      toast.error("CEP não encontrado");
      return;
    }

    endereco.value.Rua = res.data.logradouro || "";
    endereco.value.Bairro = res.data.bairro || "";
    endereco.value.Cidade = res.data.localidade || "";
    endereco.value.Estado = res.data.uf || "";
  } catch (err) {
    toast.error("Erro ao buscar endereço via CEP");
  }
};

const buscarEnderecoViaCepDebounced = debounce(buscarEnderecoViaCep, 500);

watch(() => endereco.value.Cep, buscarEnderecoViaCepDebounced);

const onInputCep = (event) => {
  endereco.value.Cep = formatCep(event.target.value);
};

const formatCPF = (value) => {
  let numeros = value.replace(/\D/g, "").slice(0, 11);
  let part1 = numeros.slice(0, 3);
  let part2 = numeros.slice(3, 6);
  let part3 = numeros.slice(6, 9);
  let part4 = numeros.slice(9, 11);
  let result = part1;
  if (part2) result += "." + part2;
  if (part3) result += "." + part3;
  if (part4) result += "-" + part4;
  return result;
};

const formatData = (value) => {
  let numeros = value.replace(/\D/g, "").slice(0, 8);
  let dia = numeros.slice(0, 2);
  let mes = numeros.slice(2, 4);
  let ano = numeros.slice(4, 8);
  let result = dia;
  if (mes) result += "/" + mes;
  if (ano) result += "/" + ano;
  return result;
};




function abrirExplorador() {
  inputArquivo.value.click();
}
function carregarImagem(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  console.log("Arquivo recebido:", arquivo.name, arquivo.type, arquivo.size);

  if (!arquivo.type.includes("png")) {
    toast.error("Apenas imagens PNG são permitidas.");
    event.target.value = "";
    return;
  }

  const tamanhoMax = 1 * 1024 * 1024;
  if (arquivo.size > tamanhoMax) {
    toast.error("A imagem deve ter no máximo 1MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagemPerfil.value = e.target.result;
    console.log("Imagem carregada com sucesso:", e.target.result.slice(0, 50));
  };
  reader.onerror = () => {
    toast.error("Erro ao ler o arquivo. Tente novamente.");
  };

  reader.readAsDataURL(arquivo);
}

function recarregarPagina() {
  router.go(0);
}

function removerImagem() {
  if (imagemPerfil != null) {
    imagemPerfil.value = "Sem imagem";
  }
}
watch(imagemPerfil, (i) => {
  console.log(imagemPerfil.value);
});

function voltarHome() {
  router.push("/");
}

const retrieve = ref();
const loadingInit = ref(true);

onMounted(async () => {
  if (!tokenExiste.value) {
    router.push("/");
    return;
  }



  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
const telRaw = String(res.data.telefone || "").replace(/\D/g, "");

let ddi = "55";
let numero = "";

if (telRaw.length > 11) {
  ddi = telRaw.slice(0, telRaw.length - 11);
  numero = telRaw.slice(-11);
} else {
  numero = telRaw;
}


    if (res.status === 200 && res.data) {
      retrieve.value = res.data;

      usuario.value = {
        Nome: res.data.nome,
        email: res.data.email,
        senha: "",
        CPF: res.data.cpf,
        ddi: ddi,
        Telefone: numero ? numero : "",
        dataNascimento: res.data.data_Nascimento || "",
      };



      imagemPerfil.value = res.data.foto_Perfil || null;
    }

    if (retrieve.value && retrieve.value.id) {
      const resEnderecos = await connection.get(
        `/desapega/enderecos/${retrieve.value.id}`,
        {
          headers: { Authorization: `Bearer ${token.value}` },
        }
      );

      if (resEnderecos.status === 200 && resEnderecos.data) {
        endereco.value = {
          Cep: resEnderecos.data.cep,
          Estado: resEnderecos.data.estado,
          Cidade: resEnderecos.data.cidade,
          Bairro: resEnderecos.data.bairro,
          Rua: resEnderecos.data.rua,
          Numero: resEnderecos.data.numero,
          Logradouro: resEnderecos.data.tipo_de_logradouro,
          Complemento: resEnderecos.data.complemento,
          Status: resEnderecos.data.status,
        };
      }
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Erro ao buscar dados do usuário ou endereço"
    );
  } finally {
    loadingInit.value = false;
  }
});

const confirmacaoSair = ref(false);
const loadingExclusao = ref(false);

const ExcluirConta = async () => {
  loadingExclusao.value = true;
  try {
    if (retrieve.value && retrieve.value.id) {
      const body = {
        status: "inativo",
        email: "",
      };
      const res = await connection.patch(
        `/desapega/usuarios/${retrieve.value.id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token.value}` },
        }
      );
      if (res.status === 200 || res.status === 204) {
        toast.success("Conta excluída com sucesso!", { autoClose: 2000 });
        localStorage.removeItem("token");
        setTimeout(() => {
          router.go(0);
        }, 2000);
      } else {
        toast.error(res.data?.message || "Erro ao excluir conta");
      }
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao excluir conta");
  } finally {
    loadingExclusao.value = false;
  }
};




const salvarAlteracoes = async () => {
  loading.value = true;
  try {
    const cpfFormatado = usuario.value.CPF?.replace(/[./-]/g, "") || "";
    const telefoneLimpo = usuario.value.Telefone.replace(/\D/g, "");

    
    const body = {
      nome: usuario.value.Nome,
      email: usuario.value.email,
      cpf: cpfFormatado,
      telefone: usuario.value.ddi + telefoneLimpo,
      data_de_nascimento: usuario.value.dataNascimento,
      foto_de_perfil: imagemPerfil.value || null,
    };

    if (usuario.value.senha && usuario.value.senha.trim() !== "") {
      body.senha = usuario.value.senha;
    }
    const res = await connection.patch(
      `/desapega/usuarios/${retrieve.value.id}`,
      body,
      {
        headers: { Authorization: `Bearer ${token.value}` },
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
    loading.value = false;
  }
};
const salvarAlteracoesEndereco = async () => {
  loadingEndereco.value = true;
  try {
    const body = {
      cep: endereco.value.Cep,
      estado: endereco.value.Estado,
      cidade: endereco.value.Cidade,
      bairro: endereco.value.Bairro,
      rua: endereco.value.Rua,
      numero: endereco.value.Numero,
      logradouro: endereco.value.Logradouro,
      complemento: endereco.value.Complemento,
      status: endereco.value.Status,
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
async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  if (retrieve.admin == true) {
    try {
      const res = await Promise.race([
        connection.get(`/desapega/produtos/${retrieve?.value.id}`),
        timeout,
      ]);

      if (res.status == 200) {
        produtos.value = res.data.produtos     
  
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
        connection.get(`/desapega/produtos/${retrieve?.value.id}`),
        timeout,
      ]);

      if (res.status == 200) {
        produtos.value = res.data.produtos     
      
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

watch(erroGetProduto, (v) => console.log("erroGetProduto mudou para ->", v));

function recarregarProdutos() {
  getProdutos();
}

watch(itens, (novoItem) => {
  novoItem.forEach((item) => {
    console.log(item, "Produtos");
  });
});
</script>
