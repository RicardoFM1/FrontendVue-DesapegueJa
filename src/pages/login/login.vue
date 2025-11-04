<template>
<div class="fundoLogin">
        
    
        <div class="divFormLogin">
            <v-sheet style="display: flex; border-radius: 10px;
                justify-content: center; flex-direction: column; width: 25%; height: 60%;
                "  class="sheetLogin">
                
                <v-form :disabled="loading" class="formLogin" ref="form" style="width: 100%;" 
                
                @submit.prevent="onSubmit">
                    <div class="divImageLogo">
  <v-img style="padding: 12px 0 0 12px;" width="100%" height="auto" src="desapegueja-logo.svg"></v-img>
</div>

<h1 class="tituloCadastro">Login</h1>
                    <v-text-field
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    v-model="usuario.email"
                    type="email"
                    base-color="#293559"
                    >
                    </v-text-field>
                    <v-text-field
                        label="Senha"
                        prepend-inner-icon="mdi-lock"
                        :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="show = !show"
                        v-model="usuario.senha"
                        @paste.prevent
                        :type="show ? 'text' : 'password'"
                        base-color="#293559"
                    >
                    
                </v-text-field>
                <v-btn :disabled="disabled" :loading="loading" color="black" class="btnCadastrar" type="submit" block>Fazer login</v-btn>
                <v-btn
         
          variant="flat"
          color="#5865f2"
          type="button"
          to="/"
          >
            Página home
          </v-btn>
                <router-link to="/cadastro">Não tem uma conta?</router-link>
                </v-form>
            </v-sheet>
    
    </div>
</div>
</template>

<script setup>
import { ref, computed } from "vue";
import 'vue3-toastify/dist/index.css'
import { toast } from "vue3-toastify/dist/index";
import '@mdi/font/css/materialdesignicons.css'
import { connection } from "@/connection/axiosConnection";
import router from "@/router";

const usuario = ref({
    email: "",
    senha: ""
})
const loading = ref(false)

const show = ref(true)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const onSubmit = async () => {
  loading.value = true
  try {
    const res = await connection.post("/desapega/usuarios/login", usuario.value);
    
    if(res.status == 200 || res.status == 201){

        toast.success("Login realizado com sucesso!", { autoClose: 2000 });
        localStorage.setItem("token", res.data.token);
        await delay(2000);
        router.push("/");
    }
  } 
  catch (err) {

    console.log("Erro ao fazer login", err);

    const msg = err.response?.data?.message || "Credenciais erradas, tente novamente!";
    toast.error(msg, { autoClose: 2000 });

    localStorage.removeItem("token");
  } 
  finally {
    loading.value = false;
  }
};



const disabled = computed(() => {
if(usuario.value.email == "" || usuario.value.senha == ""){
      return true
  }
  
});
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>