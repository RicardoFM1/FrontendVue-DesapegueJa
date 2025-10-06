<template>
    
    <div v-if="tokenExiste == true">
    <div class="divFiltros">
        <v-layout >
            <v-navigation-drawer permanent :width="345">
                <v-list-item title="Filtros"></v-list-item>
                <v-divider></v-divider>
                <div class="divPalavrasChaves">

                    <p>Palavras Chaves</p>
                    <v-text-field 
                    placeholder="Pesquisar palavras chaves"
                    type="text"
                    >
                </v-text-field>
            </div>
                
                <v-divider></v-divider>
                <div class="divLabelSlider">
                    <p>Preço</p>
                    <p>R$ <span>{{range[0]}}-</span><span>{{ range[1] }}</span></p>
                </div>
                <v-range-slider 
                class="sliderFiltro"
                v-model="range"
                step="1"
                max="10000"
                min="0"
                >
            </v-range-slider>
            <p class="subtitleConservacao">Estado de conservação</p>
            <div class="divCheckboxFiltros">
                <v-checkbox label="Excelente" hide-details></v-checkbox>
                <v-checkbox label="Muito bom" hide-details></v-checkbox>
                <v-checkbox label="Bom" hide-details></v-checkbox>
                <v-checkbox label="Ruim" hide-details></v-checkbox>
                <v-checkbox label="Muito ruim" hide-details></v-checkbox>
            <v-checkbox label="Péssimo" hide-details></v-checkbox>
        </div>
            </v-navigation-drawer>
        </v-layout>

    </div>
    </div>  
    <div v-if="tokenExiste == false">
        <p>home1</p>
    </div>
</template>

<script setup>
import {ref} from "vue"


const range = ref([0,0]);
const tokenExiste = ref(false);
if(localStorage.getItem("token") != null){
    tokenExiste.value = true;
}
else{
    tokenExiste.value = false;
}
</script>


<style>
@import "../css/paginaHome/home.css"
</style>