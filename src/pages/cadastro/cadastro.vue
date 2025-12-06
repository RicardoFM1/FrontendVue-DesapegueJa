<template>
  <div class="fundoCadastro">
    <div class="divFormCadastro">
      <v-sheet
        class="sheetCadastro pa-6 pa-sm-8 elevation-4"
        rounded="lg"
        width="450"
        style="max-width: 90%;"
      >
        <v-form
          :disabled="loading"
          class="formCadastro"
          ref="form"
          @submit.prevent="onSubmit"
        >
          <div class="divImageLogo text-center mb-4">
            <v-img
              max-width="300"
              class="mx-auto"
              src="desapegueja-logo.svg"
            ></v-img>
          </div>

          <h1 class="tituloCadastro text-h5 font-weight-bold text-center mb-2 text-primary">
            Crie sua conta
          </h1>
          <p class="text-center text-medium-emphasis mb-6">
            Preencha os campos para se cadastrar.
          </p>

          <v-text-field
            label="Nome completo"
            prepend-inner-icon="mdi-account-circle-outline"
            v-model="usuario.Nome"
            type="text"
            color="primary"
            :rules="rulesNomeCompleto"
            variant="solo-filled"
            density="compact"
            required
            class="mb-2"
            hide-details="auto"
          ></v-text-field>
          
          <v-text-field
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            v-model="usuario.email"
            type="email"
            color="primary"
            variant="solo-filled"
            density="compact"
            class="mb-2"
            :rules="rulesEmail"
            hide-details="auto"
          ></v-text-field>

          <v-text-field
            label="Senha"
            v-model="usuario.senha"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            @click:append-inner="show = !show"
            @paste.prevent
            :type="show ? 'text' : 'password'"
            color="primary"
            variant="solo-filled"
            density="compact"
            class="mb-2"
            :rules="rulesSenha"
            hide-details="auto"
          ></v-text-field>
          
          <v-text-field
            label="Confirmar senha"
            prepend-inner-icon="mdi-lock-check-outline"
            v-model="usuario.confirmSenha"
            :append-inner-icon="show2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            @click:append-inner="show2 = !show2"
            @paste.prevent
            :type="show2 ? 'text' : 'password'"
            color="primary"
            variant="solo-filled"
            density="compact"
            class="mb-4"
            :rules="rulesSenhasIguais"
            hide-details="auto"
          ></v-text-field>
          
          <v-divider class="my-4"></v-divider>
          <p class="text-subtitle-1 font-weight-bold text-medium-emphasis mb-4">Dados Pessoais</p>

          <v-text-field
            ref="inputCPF"
            label="CPF"
            v-model="usuario.CPF"
            prepend-inner-icon="mdi-card-account-details-outline"
            placeholder="000.000.000-00"
            @input="usuario.CPF = usuario.CPF.slice(0, 14)"
            color="primary"
            variant="solo-filled"
            density="compact"
            class="mb-2"
            hide-details="auto"
          ></v-text-field>
          
          <v-text-field
            ref="inputData"
            label="Data de nascimento"
            prepend-inner-icon="mdi-calendar"
            :rules="rulesDataNascimento"
            v-model="usuario.dataNascimento"
            placeholder="DD/MM/AAAA"
            @click:append-inner="openCalendar"
            @input="usuario.dataNascimento = usuario.dataNascimento.slice(0, 10)"
            color="primary"
            variant="solo-filled"
            density="compact"
            class="mb-4"
            hide-details="auto"
          >
          <template #append-inner>
            <v-icon @click="openCalendar">mdi-calendar</v-icon>
          </template>
          </v-text-field>
          
          <v-dialog max-width="350" v-model="calendarOpen" v-if="calendarOpen">
            <v-card>
              <v-date-picker
                v-model="rawDate"
                scrollable
                @update:model-value="(val) => (usuario.dataNascimento = formatDate(val))"
              ></v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="calendarOpen = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="calendarOpen = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <div class="d-flex" style="gap: 10px; width: 100%;">
            <v-select
              :items="ddiOptions"
              v-model="usuario.ddi"
              item-title="text"
              item-value="value"
              color="primary"
              variant="solo-filled"
              density="compact"
              style="max-width: 140px;"
              label="DDI"
              :rules="rulesDDI"
              required
              
              class="mb-4"
            />
            <v-text-field
              label="Telefone"
              v-model="usuario.Telefone"
              prepend-inner-icon="mdi-cellphone"
              :rules="rulesTelefone"
              color="primary"
              density="compact"
              variant="solo-filled"
              class="mb-4"
             
            />
          </div>

          <v-btn
            :disabled="disabled"
            :loading="loading"
            color="primary"
            class="text-white mt-2 mb-4"
            type="submit"
            block
            size="large"
            rounded="lg"
          >
            Cadastrar
          </v-btn>

          <div class="text-center mt-4">
            <p class="text-body-2 text-medium-emphasis mb-2">
              Já tem uma conta?
            </p>
            <v-btn
              variant="text"
              color="primary"
              to="/login"
              size="large"
              class="font-weight-bold"
            >
              Fazer login
            </v-btn>
          </div>
          
          <div class="text-center mt-4">
            <v-btn
              variant="text"
              color="grey-darken-1"
              type="button"
              to="/"
              size="small"
            >
              Voltar para a página inicial
            </v-btn>
          </div>
        </v-form>
      </v-sheet>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";
import { connection } from "@/connection/axiosConnection";
import { useRouter } from "vue-router";
import { useMask } from "../../utility/masks/mask";

const ddiOptions = [
  { text: "+1 EUA", value: "1" },
  { text: "+34 Espanha", value: "34" },
  { text: "+44 Reino Unido", value: "44" },
  { text: "+49 Alemanha", value: "49" },
  { text: "+52 México", value: "52" },
  { text: "+55 Brasil", value: "55" },
  { text: "+351 Portugal", value: "351" },
];

const router = useRouter();
onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push("/");
  }
});



const usuario = ref({
  Nome: "",
  email: "",
  senha: "",
  confirmSenha: "",
  dataNascimento: "",
  CPF: "",
  ddi: "55",
  Telefone: "",
});

const loading = ref(false);
const show = ref(true);
const show2 = ref(true);
const calendarOpen = ref(false);
const inputData = ref(null);
const inputCPF = ref(null);
const inputTelefone = ref(null);

useMask(inputData, { mask: "00/00/0000" });
useMask(inputCPF, { mask: "000.000.000-00" });





const rawDate = ref("");

const openCalendar = () => {
  calendarOpen.value = true;
};

const formatDate = (val) => {
  if (!val) return "";

  const date = new Date(val);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async () => {
  loading.value = true;
  const cpfFormatado = usuario.value.CPF.replace(/[./-]/g, "");
  if (!usuario.value.Telefone) {
  toast.error("Telefone obrigatório");
  loading.value = false;
  return;
}
const telefoneFormatado = usuario.value.ddi + usuario.value.Telefone.replace(/\D/g, "");


  console.log(cpfFormatado, "FormatCPF");
  console.log(telefoneFormatado, "formatTelefone")
  try {
    const body = {
      nome: usuario.value.Nome,
      email: usuario.value.email,
      senha: usuario.value.senha,
      cpf: cpfFormatado,
      telefone: telefoneFormatado,
      data_de_nascimento: usuario.value.dataNascimento,
    };
    const res = await connection.post("desapega/usuarios", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    await delay(500);
    if (res.status === 200 || res.status === 201) {
      toast.success("Cadastro realizado com sucesso!", { autoClose: 2000 });
      await delay(1500);
      router.push("/login");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao cadastrar");
  } finally {
    loading.value = false;
  }
};



const rulesNomeCompleto = [
  (value) => !!value || "Obrigatório preencher o nome completo.",
  (value) => {
    if (!value) return true; 

  
    const palavras = value.trim().split(/\s+/); 

    
    return palavras.length >= 2 || "É necessário informar nome e sobrenome.";
  },
];

const rulesEmail = [
  (value) => !!value || "Obrigatório preencher",
  (value) =>
    /^(?=[^@]*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
      value
    ) || "E-mail inválido",
];

const rulesSenha = [
  (value) => !!value || "Obrigatório preencher",
  (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      value
    ) ||
    "Senha inválida, necessário mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial",
];

const rulesSenhasIguais = [
  (value) => value === usuario.value.senha || "As senhas precisam ser iguais",
];

const rulesDataNascimento = [
    (value) => !!value || "Obrigatório preencher",
    (value) =>
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value) ||
        "Formato de data inválido (DD/MM/AAAA).",

   
    (value) => {
        if (!value) return true;
        
     
        const parts = value.split('/');
        
        const dataNascimento = new Date(parts[2], parts[1] - 1, parts[0]);
        
       
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); 

       
        return dataNascimento <= hoje || "A data de nascimento não pode ser futura.";
    }
];

const rulesDDI = [
  (value) => !!value || "Obrigatório selecionar um DDI",
];
const rulesTelefone = [
  (value) => !!value || "Obrigatório preencher",
  (value) => value.length >= 8 || "Telefone muito curto",
];


const disabled = computed(
  () =>
    !usuario.value.email ||
    !usuario.value.senha ||
    usuario.value.confirmSenha !== usuario.value.senha ||
    !usuario.value.CPF ||
     !usuario.value.ddi ||
    !usuario.value.Telefone ||
    !usuario.value.dataNascimento
);
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>

