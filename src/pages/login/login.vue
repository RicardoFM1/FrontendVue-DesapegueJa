<template>
<div class="fundoLogin">
        
    
        <div class="divFormLogin">
            <v-sheet style="display: flex; border-radius: 10px;
                justify-content: center; flex-direction: column; width: 25%; height: 60%;
                "  class="sheetLogin">
                
                <v-form :disabled="loading"
  class="formLogin"
  ref="form"
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
                <v-btn
 :disabled="disabled"
    :loading="loading"
    color="black"
    class="btnCadastrar"
    type="submit"
    block
>
  Fazer login
</v-btn>
<v-btn
  color="#DB4437"
  block
  class="mb-4"
  @click="loginGoogle"
>
  <v-icon start>mdi-google</v-icon>
  Entrar com Google
</v-btn>

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
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"; 
import { connection } from "@/connection/axiosConnection";
import { toast } from "vue3-toastify/dist/index";

const router = useRouter();
const route = useRoute(); 
const usuario = ref({ email: "", senha: "" });
const loading = ref(false);
const show = ref(true);



onMounted(async() => {
    const googleToken = route.query.token;
    const googleNome = route.query.nome;
    const needsCompletion = route.query.needs_completion === 'true'; 

    
   if (googleToken) {
      
        localStorage.setItem('token', googleToken);
       
        
        console.log("URL ANTES de replace:", window.location.href);
        
       

        console.log("URL DEPOIS de replace:", window.location.href); 
        
       
        const msgBoasVindas = googleNome ? `Bem-vindo(a), ${googleNome}!` : "Login realizado com sucesso!";
        toast.success(msgBoasVindas, { autoClose: 2000 });
        
       
         router.replace({ path: route.path, query: {} });

        if (needsCompletion) {
            router.push("/completar-cadastro"); 
        } else {
            router.push("/");
        }
        return; 
    } 

   
    if (localStorage.getItem("token")) {
        
        router.push("/");
        return;
    }
    
    
    console.log("-----------------------------------------");
    console.log("Iniciando onMounted no Login.vue");
    console.log("Token recebido da URL: NÃO (Página de login normal)");
    console.log("-----------------------------------------");
});

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const onSubmit = async (e) => {
  if (e) e.preventDefault(); 
  console.log("Enviando login...", usuario.value)

  loading.value = true;
  try {
    const res = await connection.post("/desapega/usuarios/login", usuario.value);
    if (res.status === 200 || res.status === 201) {
      toast.success("Login realizado com sucesso!", { autoClose: 2000 });
      localStorage.setItem("token", res.data.token);
      await delay(2000);
      router.push("/");
    }
  } catch (err) {
    const msg = err?.response?.data?.message ?? "Credenciais erradas!";
    toast.error(msg, { autoClose: 2000 });
    console.error("Erro no login:", err)
    localStorage.removeItem("token");
  } finally {
    loading.value = false;
  }
};

const loginGoogle = () => {
 
 window.location.href = "https://localhost:7000/desapega/usuarios/login-google";
};

const disabled = computed(() =>
  !usuario.value.email || !usuario.value.senha
);
</script>


<style>
@import "../css/paginasLogineCadastro/logineCadastro.css";
</style>