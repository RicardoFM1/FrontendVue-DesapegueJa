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
                <v-form class="formCadastro" style="width: 100%;" 
                
                @submit.prevent>
                    
                    <v-text-field
                    label="Email"
                    v-model="usuario.email"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Senha"
                    v-model="usuario.senha"
                    type="password"
                    >
                    
                </v-text-field>
                <v-btn :disabled="disabled" color="black" class="btnCadastrar" type="submit" block>Cadastrar</v-btn>
                </v-form>
            </v-sheet>
    
    </div>
</div>
</template>


<script setup>
import { ref, computed } from "vue";

const usuario = ref({
    email: "",
    senha: ""
})


const disabled = computed(() => {
  return usuario.value.email === "" || usuario.value.senha === "";
});

</script>





<style>
@import "./cadastro.css"
</style>