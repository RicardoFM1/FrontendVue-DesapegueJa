<template>
<div class="fundoCadastro">
    
        <div class="divFormCadastro">
            <v-sheet style="display: flex; border-radius: 10px;
                justify-content: center; flex-direction: column; width: 25%; height: 60%;
                "  class="sheetCadastro">
                <v-sheet style="position: absolute; top: 18%; background-color: #e3e3e3;
                padding: 4px 48px 4px 48px; border-radius: 6px; border: 2px solid #767676;
                ">
                    Cadastro
                </v-sheet>
                <v-form class="formCadastro" ref="form" style="width: 100%;" 
                
                @submit.prevent="onSubmit">
                    
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
                    type="password"
                    base-color="#293559"
                    :rules="rulesSenha"
                    >
                    
                </v-text-field>
                <v-text-field 
                label="Confirmar senha"
                v-model="usuario.confirmSenha"
                type="password" 
                base-color="#293559"
                :rules="rulesSenhasIguais"
                
                >
                    
                </v-text-field>
                <v-btn :disabled="disabled" :loading="loading" color="black" class="btnCadastrar" type="submit" block>Cadastrar</v-btn>
                
                </v-form>
            </v-sheet>
    
    </div>
</div>
</template>


<script setup>
import { ref, computed } from "vue";
import 'vue3-toastify/dist/index.css'
import { toast } from "vue3-toastify/dist/index";

const usuario = ref({
    email: "",
    senha: "",
    confirmSenha: ""
})
const loading = ref(false)

const onSubmit = async() => {
 
   loading.value = true
   try{
        setTimeout(() => {
            console.log("Cadastrado!")
            toast.success("Cadastro realizado com sucesso!", {autoClose: 2000})
        }, 2000);
    }
    catch(err){
        console.log("Erro ao cadastrar", err)
    }finally{
        setTimeout(() => {
            loading.value = false
        }, 2000);
    }


    
}



const rulesEmail = [
    value => !!value || 'Obrigatório preencher!',
    value => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || 'E-mail inválido.'
    },
]
const rulesSenha = [
    value => !!value || "Obrigatório preencher!",
    value => value && value.length >= 8 || "Mínimo 8 caractéres",
    
]
const rulesSenhasIguais = [
    value => value === usuario.value.senha || "As senhas precisam ser iguais!"
]



const disabled = computed(() => {
if(usuario.value.email === "" || usuario.value.senha === "" || 
  usuario.value.confirmSenha != usuario.value.senha){
      return true
  }
  
});

</script>





<style>
@import "../css/paginasLogineCadastro/logineCadastro.css"
</style>