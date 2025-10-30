<template>
  <div class="fundoCadastro">
    <v-btn class="ml-4" variant="flat" color="#5865f2" to="/">
      Página home
    </v-btn>
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
        <!-- <v-sheet
          style="
            position: absolute;
            top: 23%;
            background-color: #e3e3e3;
            padding: 4px 48px 4px 48px;
            border-radius: 6px;
            border: 2px solid #767676;
          "
        >
          Cadastro
        </v-sheet> -->
        <v-form
          :disabled="loading"
          class="formCadastro"
          ref="form"
          @submit.prevent="onSubmit"
        >
          <v-text-field
            label="Email"
            prepend-inner-icon="mdi-email "
            v-model="usuario.email"
            type="email"
            base-color="#293559"
            :rules="rulesEmail"
          >
          </v-text-field>
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
          >
          </v-text-field>
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
          >
          </v-text-field>
          <v-text-field label="CPF" base-color="#293559"> </v-text-field>
          <v-text-field
            ref="inputData"
  label="Data de nascimento"
  append-inner-icon="mdi-calendar"
  base-color="#293559"
  v-model="usuario.dataNascimento"
  placeholder="DD/MM/AAAA"
  @click:append-inner="openCalendar"
  @input="onInputData"
          >
          </v-text-field>
          <v-dialog
            max-width="350"
            v-model="calendarOpen"
            v-if="calendarOpen == true"
          >
            <v-card>
              <v-date-picker 
              scrollable 
              
              v-model="usuario.dataNascimento"
              @update:model-value="(val) => usuario.dataNascimento = formatDate(val)"
              >
            </v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cancelar" @click="calendarOpen = false"></v-btn>
                <v-btn text="OK" @click="calendarOpen = false"></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-text-field
            label="Telefone"
            prepend-inner-icon="mdi-cellphone"
            base-color="#293559"
          >
          </v-text-field>
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
import { ref, computed, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";
import { connection } from "@/connection/axiosConnection";
import { useRouter } from "vue-router";
import {useMask} from "../../utility/masks/mask"




const router = useRouter();

const usuario = ref({
  email: "",
  senha: "",
  confirmSenha: "",
  dataNascimento: "",
  CPF: "",
  Telefone: ""
});
const loading = ref(false);
const show = ref(true);
const show2 = ref(true);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const calendarOpen = ref(false);
const inputData = ref(null);
const openCalendar = () => {
  calendarOpen.value = true;
  
};
useMask(inputData, { mask: '00/00/0000'})

const onInputData = (e) => {

  let val = e.replace(/\D/g, '');

 
  val = val.slice(0, 8);

  
  val = val.replace(/(\d{4})(\d{2})(\d{0,2})/, '$1-$2-$3');

  usuario.value.dataNascimento = val;
};

const formatDate = (val) => {
  if (!val) return "";
 
  const date = new Date(val);
  return date.toISOString().split("T")[0];
};


const onSubmit = async () => {
  loading.value = true;
  try {
    const body = {
      email: usuario.value.email,
      senha: usuario.value.senha,
    };

    const res = await connection.post("desapega/usuarios", body);
    await delay(5000);
    console.log("teste", res);

    if (res.status === 200 || res.status === 201) {
      toast.success("Cadastro realizado com sucesso!", { autoClose: 2000 });
      await delay(1500);
      router.push("/login");
    }
  } catch (err) {
    console.log("Erro ao cadastrar", err);
    toast.error(err.response?.data?.message || "Erro ao cadastrar");
  } finally {
    loading.value = false;
  }
};

const rulesEmail = [
  (value) => !!value || "Obrigatório preencher",
  (value) => {
    const pattern =
      /^(?=.*[a-z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return pattern.test(value) || "E-mail inválido";
  },
];
const rulesSenha = [
  (value) => !!value || "Obrigatório preencher",
  (value) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return (
      pattern.test(value) ||
      "Senha inválida, necessário no mínimo 8 caractéres e conter, pelo menos: 1 número, 1 caractére especial, uma letra e minúscula e uma maiúscula"
    );
  },
];
const rulesSenhasIguais = [
  (value) => value === usuario.value.senha || "As senhas precisam ser iguais",
];


const disabled = computed(() => {
  if (
    usuario.value.email === "" ||
    usuario.value.senha === "" ||
    usuario.value.confirmSenha != usuario.value.senha
  ) {
    return true;
  }
});
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>
