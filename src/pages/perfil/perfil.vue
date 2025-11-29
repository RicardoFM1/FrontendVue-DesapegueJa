<template>
  <v-breadcrumbs
 class="text-black mt-15"
:items="[
  { text: 'Home', disabled: false, href: '/' },
  { text: 'Perfil', disabled: true }
  
]"
>
<template #title="{ item }">
  <span>{{ item.text }}</span>
</template>
</v-breadcrumbs>
  <v-layout>

 
  <v-container style="display: flex" class="pa-6" v-if="tokenExiste">
    <v-app-bar>
       
        <v-spacer></v-spacer>
         <v-btn
    variant="flat"
    prepend-icon="mdi-home"
    color="#1976D2"
    @click="toHome"
    :disabled="carregando"
  >
    Home
  </v-btn>
        <v-badge
  :content="carrinho.length"
  color="primary"
  class="ml-4 mr-4"
>
  <v-btn
    variant="flat"
    prepend-icon="mdi-cart"
    color="#3fa34f"
    @click="toCarrinho"
    :disabled="carregando"
  >
    Carrinho
  </v-btn>
</v-badge>

          <v-menu v-model="menu" offset-y location="bottom end">
            <template #activator="{ props }">
              <v-tooltip top>
                <template #activator="{ props: tooltip }">
                  <v-btn
                    v-bind="{ ...props, ...tooltip }"
                    :disabled="carregando"
                    variant="text"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <span>Mais opções</span>
              </v-tooltip>
            </template>

            <v-card class="pa-4" width="300">
              <v-row justify="center">
                <v-avatar
                  size="70"
                  class="d-flex align-center justify-center"
                  :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'"
                >
                  <template v-if="avatarUsuario.tipo === 'imagem'">
                    <v-img :src="avatarUsuario.src" cover />
                  </template>

                  <template v-else>
                    <span class="text-white text-h6 font-weight-bold">
                      {{ avatarUsuario.texto }}
                    </span>
                  </template>
                </v-avatar>
              </v-row>
              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 nomeUsuario ellipses">
                      {{ usuario?.Nome }}
                    </div>
                  </template>
                  <span>{{ usuario?.Nome }}</span>
                </v-tooltip>
              </v-row>

              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 emailUsuario ellipses">
                      {{ usuario?.email }}
                    </div>
                  </template>
                  <span>{{ usuario?.email }}</span>
                </v-tooltip>
              </v-row>

              <v-divider class="my-3"></v-divider>

              <v-btn
                block
                color="#eaece7"
                variant="flat"
                class="mb-4"
                prepend-icon="mdi-account"
                @click="toPerfil"
                :disabled="carregando"
              >
                PERFIL
              </v-btn>
              <v-btn
                block
                color="#cc0000"
                variant="flat"
                class="mb-4"
                prepend-icon="mdi-logout"
                @click="buttonSairClicado = !buttonSairClicado"
                :disabled="carregando"
                >
                SAIR
              </v-btn>
            </v-card>
          </v-menu>
        </v-app-bar>
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
      <v-dialog
          max-width="500"
          v-model="buttonSairClicado"
          v-if="buttonSairClicado"
        >
          <v-card class="pa-4" elevation="8" rounded="xl">
            <v-card-title class="text-center font-weight-bold text-h4">
              <v-icon color="error" size="32" class="mr-2"
                >mdi-alert-circle-outline</v-icon
              >
              Confirmar saída
            </v-card-title>

            <v-card-text class="text-center text-h5 text-medium-emphasis">
              Tem certeza de que deseja sair da sua conta?
            </v-card-text>

            <v-card-actions class="justify-center mt-2">
              <v-btn
                color="grey"
                variant="outlined"
                rounded="xl"
                @click="buttonSairClicado = false"
                width="120"
              >
                Cancelar
              </v-btn>

              <v-btn
                color="error"
                variant="flat"
                rounded="xl"
                width="120"
                :loading="loadingLogout"
                @click="FazerLogout"
              >
                Sair
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
   </v-layout>
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
const carregando = ref(false)
const menu = ref(false);
const buttonSairClicado = ref(false)
const loadingLogout = ref(false)

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


const carrinho = ref([])

async function getCarrinho() {
  if(token.value){
  try {

    const res = await connection.get(`/desapega/carrinho/${retrieve?.value.id}`);
    
    if (res.status == 200 || res.status == 201) {
      carrinho.value = res.data;
    } else {
      toast.error("Estamos com dificuldade de listar seu carrinho...");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao listar seu carrinho");
  }
}
}
const getIniciais = (nome) => {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
};

const avatarUsuario = computed(() => {
  const nome = usuario.value?.Nome || "Usuário";
  const foto = usuario.value?.foto_Perfil;

  if (foto && foto !== "null" && foto !== "Sem imagem" && foto.trim() !== "") {
    if (foto.startsWith("data:image")) {
      return { tipo: "imagem", src: foto };
    }

    if (foto.startsWith("/9j/"))
      return { tipo: "imagem", src: `data:image/jpeg;base64,${foto}` };
    if (foto.startsWith("iVBORw0KGgo"))
      return { tipo: "imagem", src: `data:image/png;base64,${foto}` };

    return { tipo: "iniciais", texto: getIniciais(nome) };
  }

  return { tipo: "iniciais", texto: getIniciais(nome) };
});


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

    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;
      usuario.value = res.data;
      console.log("FOTO PERFIL REAL:", res.data.foto_Perfil);
      console.log("Tamanho da string:", res.data.foto_Perfil?.length);
      console.log("RETORNO API:", res.data);

      if (
        retrieve.foto_Perfil &&
        retrieve.foto_Perfil !== "null" &&
        retrieve.foto_Perfil !== ""
      ) {
        if (retrieve.foto_Perfil.startsWith("data:image")) {
          retrieve.foto_Perfil = retrieve.foto_Perfil;
        } else if (retrieve.foto_Perfil.startsWith("/9j/")) {
          retrieve.foto_Perfil = `data:image/jpeg;base64,${retrieve.foto_Perfil}`;
        } else if (retrieve.foto_Perfil.startsWith("iVBORw0KGgo")) {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        } else if (
          retrieve.foto_Perfil.startsWith("R0lGODlh") ||
          retrieve.foto_Perfil.startsWith("R0lGODdh")
        ) {
          retrieve.foto_Perfil = `data:image/gif;base64,${retrieve.foto_Perfil}`;
        } else {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        }
      } else {
        retrieve.foto_Perfil = null;
      }
    } else {
      toast.error("Erro ao buscar o usuário");
      console.error("Resposta inesperada:", res);
    }

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
  await getCarrinho();
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
function toHome() {
  router.push("/")
}
function toPerfil() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/perfil");
}
function toCarrinho() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/carrinho");
}
function FazerLogout() {
  loadingLogout.value = true;
  setTimeout(() => {
    localStorage.removeItem("token");
    router.push("/login");
    loadingLogout.value = false;
  }, 2000);
}
</script>
