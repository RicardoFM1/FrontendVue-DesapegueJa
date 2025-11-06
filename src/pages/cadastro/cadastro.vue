<template>
  <div class="fundoCadastro">
    <div class="divFormCadastro">
      <v-sheet
        style="
          display: flex;
          border-radius: 10px;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 18px;
          width: 30%;
        "
        class="sheetCadastro"
      >
        <v-form
          :disabled="loading"
          class="formCadastro"
          ref="form"
          @submit.prevent="onSubmit"
        >
          <div class="divImageLogo">
            <v-img
              style="padding: 12px 0 0 12px"
              width="100%"
              height="auto"
              src="desapegueja-logo.svg"
            ></v-img>
          </div>

          <h1 class="tituloCadastro">Cadastro</h1>
          <v-text-field
            label="Nome de usuário"
            prepend-inner-icon="mdi-account"
            v-model="usuario.Nome"
            type="text"
            base-color="#293559"
            
          ></v-text-field>
          <v-text-field
            label="Email"
            prepend-inner-icon="mdi-email"
            v-model="usuario.email"
            type="email"
            base-color="#293559"
            :rules="rulesEmail"
          ></v-text-field>
          <v-text-field
            label="Senha"
            v-model="usuario.senha"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
            @paste.prevent
            :type="show ? 'text' : 'password'"
            base-color="#293559"
            :rules="rulesSenha"
          ></v-text-field>
          <v-text-field
            label="Confirmar senha"
            prepend-inner-icon="mdi-lock"
            v-model="usuario.confirmSenha"
            :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show2 = !show2"
            @paste.prevent
            :type="show2 ? 'text' : 'password'"
            base-color="#293559"
            :rules="rulesSenhasIguais"
          ></v-text-field>
          <v-text-field
            ref="inputCPF"
            label="CPF"
            v-model="usuario.CPF"
            prepend-inner-icon="mdi-card-account-details"
            base-color="#293559"
            placeholder="000.000.000-00"
            @input="usuario.CPF = usuario.CPF.slice(0, 14)"
          ></v-text-field>
          <v-text-field
            ref="inputData"
            label="Data de nascimento"
            append-inner-icon="mdi-calendar"
            base-color="#293559"
            :rules="rulesDataNascimento"
            v-model="usuario.dataNascimento"
            placeholder="DD/MM/AAAA"
            @click:append-inner="openCalendar"
            @input="
              usuario.dataNascimento = usuario.dataNascimento.slice(0, 10)
            "
          ></v-text-field>
          <v-dialog max-width="350" v-model="calendarOpen" v-if="calendarOpen">
            <v-card>
              <v-date-picker
                v-model="rawDate"
                scrollable
                @update:model-value="
                  (val) => (usuario.dataNascimento = formatDate(val))
                "
              ></v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="calendarOpen = false">Cancelar</v-btn>
                <v-btn text @click="calendarOpen = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-text-field
            label="Telefone"
            v-model="usuario.Telefone"
            prepend-inner-icon="mdi-cellphone"
            placeholder="(DD) 0000-0000 ou 00000-0000"
            :rules="rulesTelefone"
            @input="formatTelefone"
          ></v-text-field>
          <v-btn
            :disabled="disabled"
            :loading="loading"
            color="black"
            class="btnCadastrar"
            type="submit"
            block
            >Cadastrar</v-btn
          >
          <v-btn type="button" variant="flat" color="#5865f2" to="/"
            >Página home</v-btn
          >
          <router-link to="/login">Já tem uma conta? Faça login</router-link>
        </v-form>
      </v-sheet>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";
import { connection } from "@/connection/axiosConnection";
import { useRouter } from "vue-router";
import { useMask } from "../../utility/masks/mask";

const router = useRouter();

const usuario = ref({
  Nome: "",
  email: "",
  senha: "",
  confirmSenha: "",
  dataNascimento: "",
  CPF: "",
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

const formatTelefone = (e) => {
  let numeros = e.target.value.replace(/\D/g, "");

 
  if (numeros.length > 13) numeros = numeros.slice(0, 13);

  let ddd, prefixo, resto;

  
  if (numeros.length >= 2) {
    ddd = numeros.slice(0, 2);
    prefixo = numeros.slice(2, 4);
    resto = numeros.slice(4);
  } else {
    ddd = numeros;
    prefixo = "";
    resto = "";
  }

  let firstPart, lastPart;

  if (resto.length > 4) {
    firstPart = resto.slice(0, resto.length - 4);
    lastPart = resto.slice(resto.length - 4);
  } else {
    firstPart = resto;
    lastPart = "";
  }

  let formatted = "";
  if (ddd) formatted += `(${ddd})`;
  if (prefixo) formatted += ` ${prefixo}`;
  if (firstPart) formatted += ` ${firstPart}`;
  if (lastPart) formatted += `-${lastPart}`;

  usuario.value.Telefone = formatted;
};



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
const telefoneFormatado = usuario.value.Telefone.replace(/\D/g, "");

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
    "Data inválida",
];

const rulesTelefone = [
  (value) => !!value || "Obrigatório preencher",
  (value) => {
   
    const regex = /^\(\d{2,3}\)\s\d{2}\s\d{4,5}-\d{4}$/;
    return regex.test(value) || "Telefone inválido. Use o formato (DDD) DD 0000-0000 ou 00000-0000";
  }
];

const disabled = computed(
  () =>
    !usuario.value.email ||
    !usuario.value.senha ||
    usuario.value.confirmSenha !== usuario.value.senha ||
    !usuario.value.CPF ||
    !usuario.value.Telefone ||
    !usuario.value.dataNascimento
);
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>
