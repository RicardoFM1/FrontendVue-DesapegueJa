<template>
<div class="fundoLogin">
    
        <div class="divFormLogin">
            <v-sheet style="display: flex; border-radius: 10px;
                justify-content: center; flex-direction: column; width: 25%; height: 60%;
                "  class="sheetLogin">
                <v-sheet style="position: absolute; top: 18%; background-color: #e3e3e3;
                padding: 4px 48px 4px 48px; border-radius: 6px; border: 2px solid #767676;
                ">
                    Login
                </v-sheet>
                <v-form :disabled="loading" class="formLogin" ref="form" style="width: 100%;" 
                
                @submit.prevent="onSubmit">
                    
                    <v-text-field
                    label="Email"
                    v-model="usuario.email"
                    type="email"
                    base-color="#293559"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Senha"
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="show = !show"
                    v-model="usuario.senha"
                    :type="show ? 'text' : 'password'"
                    base-color="#293559"
                    >
                    
                </v-text-field>
                <v-btn :disabled="disabled" :loading="loading" color="black" class="btnCadastrar" type="submit" block>Fazer login</v-btn>
                
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

const usuario = ref({
    email: "",
    senha: ""
})
const loading = ref(false)

const show = ref(true)

const onSubmit = async() => {
 
   loading.value = true
   try{
        setTimeout(() => {
            console.log("Logado!")
            toast.success("Login realizado com sucesso!", {autoClose: 2000})
        }, 2000);
    }
    catch(err){
        console.log("Erro ao fazer login", err)
        setTimeout(() => {
            toast.error(err.response.data.message || "Erro ao fazer login")
        }, 2000);
    }finally{
        setTimeout(() => {
            loading.value = false
        }, 2000);
    }    
}

const disabled = computed(() => {
if(usuario.value.email === "" || usuario.value.senha === ""){
      return true
  }
  
});
</script>

<style>
@import "../css/paginasLogineCadastro/logineCadastro.css"
</style>