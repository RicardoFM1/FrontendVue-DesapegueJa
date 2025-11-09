<template>
  <v-container style="display: flex;" class="containerAllPerfil">

 
  <v-container class="pa-6" v-if="tokenExiste">
    <v-card class="mx-auto pa-6" max-width="600">
      <v-card-title class="text-h5 text-center">Perfil do Usuário</v-card-title>
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
          label="Nome Completo"
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

        <v-text-field
          v-model="usuario.Telefone"
          label="Telefone"
          prepend-inner-icon="mdi-cellphone"
          placeholder="(DD) 00 0000-0000 ou 00 00000-0000"
          :rules="rulesTelefone"
          @input="usuario.Telefone = formatTelefone($event.target.value)"
        />

        <v-row class="mt-6" justify="center" align="center">
          <v-btn color="grey" class="mr-3" variant="outlined" @click="recarregarPagina">
            Recarregar
          </v-btn>
          <v-btn color="primary" :loading="loading" class="mr-3" type="submit">
            Salvar Alterações
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="voltarHome">
            Cancelar
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
  <v-container class="pa-6" v-if="tokenExiste">
    <v-card class="mx-auto pa-6" max-width="600">
      <v-card-title class="text-h5 pa-5 text-center">
        Endereço do usuário
      </v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-form>
        <v-text-field 
        label="Estado"
        >

        </v-text-field>
        <v-text-field 
        label="Cidade"
        >

        </v-text-field>
        <v-text-field 
        label="Bairro"
        >

        </v-text-field>
        <v-row>

          <v-text-field 
          label="Rua"
          class="ml-3 mr-3"   
          >
          
        </v-text-field>
       
        <v-text-field 
        label="Número"
        class="mr-3"
        max-width="50%"
        >

        </v-text-field>
      </v-row>
      <v-select
        label="Tipo de logradouro"
        :items="[
          { title: 'Rua', value: 'rua'},
          { title: 'Avenida', value: 'avenida'},
          { title: 'Praça', value: 'praca'},
          { title: 'Travessa', value: 'travessa'},
          { title: 'Outros', value: 'outros'}
        ]"
        >

        </v-select>
        <v-text-field 
        label="Complemento"
        >

        </v-text-field>
         <v-select
         label="Status"
         :items="[
          { title: 'Ativo', value: 'ativo'},
          { title: 'Inativo', value: 'inativo'}
         ]"
         >
           >
           
          </v-select>
        
        <v-row  class="mt-6" justify="center" align="center">

          <v-btn color="primary" :loading="loading" class="mr-3" type="submit">
            Salvar Alterações
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="voltarHome">
            Cancelar
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
   </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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

const usuario = ref({
  Nome: "",
  email: "",
  senha: "",
  dataNascimento: "",
  CPF: "",
  Telefone: "",
});

const mostrarSenha = ref(false);
const loading = ref(false);
const imagemPerfil = ref(null);
const inputArquivo = ref(null);

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
const rulesTelefone = [
  (v) =>
    !v ||
    /^\(\d{2,3}\)\s\d{2}\s\d{4,5}-\d{4}$/.test(v) ||
    "Telefone inválido. Ex: (DD) 0000-0000 ou 00000-0000",
];

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

const formatTelefone = (value) => {
  let numeros = value.replace(/\D/g, "");

  if (numeros.length < 4) return numeros;

  const ddd = numeros.slice(0, 2);
  const prefixo = numeros.slice(2, 4);
  const restante = numeros.slice(4);
  let firstPart = "";
  let lastPart = "";

  if (restante.length <= 4) {
    firstPart = restante;
  } else if (restante.length === 8) {
    firstPart = restante.slice(0, 4);
    lastPart = restante.slice(4);
  } else {
    firstPart = restante.slice(0, 5);
    lastPart = restante.slice(5);
  }

  return `(${ddd}) ${prefixo} ${firstPart}${lastPart ? "-" + lastPart : ""}`;
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

function recarregarPagina(){
  router.go(0)
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

onMounted(async () => {
  if (tokenExiste.value) {
    try {
      const res = await connection.get("/desapega/usuarios/retrieve", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      if (res.status === 200 && res.data) {
        retrieve.value = res.data;

        usuario.value = {
          Nome: res.data.nome,
          email: res.data.email,
          senha: "",
          CPF: res.data.cpf,
          Telefone: res.data.telefone ? formatTelefone(res.data.telefone) : "",
          dataNascimento: res.data.data_Nascimento || "",
        };

        imagemPerfil.value = res.data.foto_Perfil || null;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao buscar o usuário");
    }
  }
});

const salvarAlteracoes = async () => {
  loading.value = true;
  try {
    const cpfFormatado = usuario.value.CPF?.replace(/[./-]/g, "") || "";
    const telefoneFormatado = usuario.value.Telefone?.replace(/\D/g, "") || "";
    const body = {
  nome: usuario.value.Nome,
  email: usuario.value.email,
  cpf: cpfFormatado,
  telefone: telefoneFormatado,
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
</script>
