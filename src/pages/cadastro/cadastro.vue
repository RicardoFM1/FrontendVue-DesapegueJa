<template>
  <div class="fundoCadastro">
    <v-btn class="ml-4" variant="flat" color="#5865f2" to="/"
      >Página home</v-btn
    >
    <div class="divFormCadastro">
      <v-sheet
        style="
          display: flex;
          border-radius: 10px;
          justify-content: center;
          flex-direction: column;
          width: 25%;
        "
        class="sheetCadastro"
      >
        <v-form
          :disabled="loading"
          class="formCadastro"
          ref="form"
          @submit.prevent="onSubmit"
        >
        <v-img src="public/desapegueja-logo-svg"></v-img>
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
          ></v-text-field>
          <v-text-field
  ref="inputData"
  label="Data de nascimento"
  append-inner-icon="mdi-calendar"
  base-color="#293559"
  v-model="usuario.dataNascimento"
  placeholder="DD/MM/AAAA"
  @click:append-inner="openCalendar"
          ></v-text-field>
          <v-dialog max-width="350" v-model="calendarOpen" v-if="calendarOpen">
            <v-card>
              <v-date-picker
                v-model="rawDate"
                scrollable
                @update:model-value="(val) => usuario.dataNascimento = formatDate(val)"
              ></v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="calendarOpen = false">Cancelar</v-btn>
                <v-btn text @click="calendarOpen = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-text-field
            ref="inputTelefone"
            label="Telefone"
            v-model="usuario.Telefone"
            prepend-inner-icon="mdi-cellphone"
            base-color="#293559"
            placeholder="(DD) 00000-0000"
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
useMask(inputTelefone, { mask: "(00) 00000-0000" });

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
  try {
    const body = {
      email: usuario.value.email,
      senha: usuario.value.senha,
      cpf: usuario.value.CPF,
      telefone: usuario.value.Telefone,
      data_de_nascimento: usuario.value.dataNascimento,
    };
    const res = await connection.post("desapega/usuarios", body);
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
    /^(?=.*[a-z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
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

const disabled = computed(
  () =>
    !usuario.value.email ||
    !usuario.value.senha ||
    usuario.value.confirmSenha !== usuario.value.senha
);
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>
