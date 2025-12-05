<template>
  <div class="fundoLogin">
    <div class="divFormLogin">
      <v-sheet 
        class="sheetLogin pa-6 pa-sm-8 elevation-4" 
        rounded="lg" 
        width="450" 
        style="max-width: 90%;"
      >
        <v-form :disabled="loading" class="formLogin" ref="form" @submit.prevent="onSubmit">
          
          <div class="divImageLogo text-center mb-4">
            <v-img 
              max-width="300" 
             
              src="desapegueja-logo.svg"
            ></v-img>
          </div>

          <h1 class="tituloCadastro text-h5 font-weight-bold text-center mb-2 text-primary">
            Bem-vindo(a) de volta!
          </h1>
          <p class="text-center text-medium-emphasis mb-6">
            Acesse sua conta para continuar.
          </p>
          
          <v-text-field
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            v-model="usuario.email"
            type="email"
            color="primary"
            variant="solo-filled"
            density="compact"
            class="mb-2"
            hide-details="auto"
          ></v-text-field>
          
          <v-text-field
            label="Senha"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            @click:append-inner="show = !show"
            v-model="usuario.senha"
            @paste.prevent
            :type="show ? 'text' : 'password'"
            color="primary"
            variant="solo-filled"
            density="compact"
            class="mb-2"
            hide-details="auto"
          ></v-text-field>

        

          <v-btn
            :disabled="disabled"
            :loading="loading"
            color="primary"
            class="text-white mb-4"
            type="submit"
            block
            size="large"
            rounded="lg"
          >
            Entrar
          </v-btn>

          <v-row align="center" class="my-4">
            <v-col><v-divider></v-divider></v-col>
            <v-col cols="auto" class="text-medium-emphasis text-caption px-2">OU</v-col>
            <v-col><v-divider></v-divider></v-col>
          </v-row>
          
          <v-btn
            color="#DB4437"
            block
            class="mb-6 text-white"
            @click="loginGoogle"
            size="large"
            rounded="lg"
            style="border-color: #e0e0e0;"
          >
            <v-img 
                max-width="18" 
                class="mr-2" 
                src="caminho/para/google-icon.svg"
                alt="Google Icon"
            ></v-img>
            Continuar com Google
          </v-btn>

          <div class="text-center mt-6">
            <p class="text-body-2 text-medium-emphasis mb-1">
              É novo por aqui?
            </p>
            <v-btn
              variant="flat"
              color="secondary"
              block
              to="/cadastro"
              size="large"
              rounded="lg"
            >
              Crie sua conta
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