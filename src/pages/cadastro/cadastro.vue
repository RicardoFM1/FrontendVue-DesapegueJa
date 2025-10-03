<template>
  <div class="fundoCadastro">
    <div class="divFormCadastro">
      <v-sheet
        style="
          display: flex;
          border-radius: 10px;
          justify-content: center;
          flex-direction: column;
          width: 25%;
          height: 60%;
        "
        class="sheetCadastro"
      >
        <v-sheet
          style="
            position: absolute;
            top: 18%;
            background-color: #e3e3e3;
            padding: 4px 48px 4px 48px;
            border-radius: 6px;
            border: 2px solid #767676;
          "
        >
          Cadastro
        </v-sheet>
        <v-form
          :disabled="loading"
          class="formCadastro"
          ref="form"
          @submit.prevent="onSubmit"
        >
          <v-text-field
            label="Email"
            v-model="usuario.email"
            type="email"
            base-color="#293559"
            :rules="rulesEmail"
          >
          </v-text-field>
          <v-text-field
            label="Senha"
            v-model="usuario.senha"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
            :type="show ? 'text' : 'password'"
            base-color="#293559"
            :rules="rulesSenha"
          >
          </v-text-field>
          <v-text-field
            label="Confirmar senha"
            v-model="usuario.confirmSenha"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
            :type="show ? 'text' : 'password'"
            base-color="#293559"
            :rules="rulesSenhasIguais"
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
import { ref, computed } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";
import { connection } from "@/connection/axiosConnection";
import { useRouter } from "vue-router";
const router = useRouter();

const usuario = ref({
  email: "",
  senha: "",
  confirmSenha: "",
});
const loading = ref(false);
const show = ref(true);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const onSubmit = async () => {
  loading.value = true;
  try {
    const body = {
      email: usuario.value.email,
      senha: usuario.value.senha,
    };

    const res = await connection.post("desapega/usuarios", body);
    await delay(5000)
    console.log("teste", res);

    if (res.status === 200 || res.status === 201) {
      toast.success("Cadastro realizado com sucesso!", { autoClose: 2000 });
      await delay(1500)
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
