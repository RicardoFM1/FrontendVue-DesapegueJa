<template>
    
    <div v-if="tokenExiste == true">
    <div class="divFiltros">
        <v-layout >
            <v-app-bar>
                <v-app-bar-nav-icon @click="drawer = !drawer">
                </v-app-bar-nav-icon>
                
                <v-toolbar-title>Filtros</v-toolbar-title>
                <v-btn 
                prepend-icon="mdi-check"
                variant="flat" 
                color="#5865f2"
                >
                Criar
            </v-btn>
            
                <v-btn
                class="ml-4"
                variant="flat" 
                prepend-icon="mdi-cart"
                color="#3fa34f"
                >
                Carrinho
            </v-btn>
            </v-app-bar>
            <v-navigation-drawer v-model="drawer" 
            :width="345"
            >
                <v-divider></v-divider>
                <div class="divPalavrasChaves">

                    <p>Palavras Chaves:</p>
                    <v-text-field 
                    v-model="palavraAtual"
                    @keyup.enter="adicionarPalavra"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Pesquisar palavras chaves"
                    type="text"
                    >
                </v-text-field>
                 
                <div class="mt-2">
   <v-chip
  v-for="(pChave, index) in palavrasChaves"
  :key="pChave + '-' + index"
  closable
  @click:close="removerPalavra(index)"
  class="ma-1"
>
  {{ pChave }}
</v-chip>

    </div>
                
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
            <v-divider></v-divider>
            <p class="subtitleConservacao">Estado de conservação</p>
            <div class="divCheckboxFiltros">
                <v-checkbox label="Excelente" hide-details></v-checkbox>
                <v-checkbox label="Muito bom" hide-details></v-checkbox>
                <v-checkbox label="Bom" hide-details></v-checkbox>
                <v-checkbox label="Ruim" hide-details></v-checkbox>
                <v-checkbox label="Muito ruim" hide-details></v-checkbox>
            <v-checkbox label="Péssimo" hide-details></v-checkbox>
        </div>
        <v-divider></v-divider>
        <p class="subtitleCategoria">Categoria:</p>
        <div class="divCheckboxCategoria">
            <v-combobox class="comboboxCategoria" label="Selecionar" :items="categorias"></v-combobox>
        </div>
    </v-navigation-drawer>
    
    <v-main>
        <div class="divHeaderMain">

            <v-text-field class="inputPesquisa" label="Pesquisar" width="30%" rounded variant="outlined"
            append-inner-icon="mdi-magnify"    
            >
        </v-text-field>
       
    </div>
    </v-main>
        
           
        </v-layout>
    </div>
    </div>  
    <div v-if="tokenExiste == false">
        <p>home1</p>
    </div>
</template>

<script setup>
import {ref} from "vue"

const drawer = ref(false)
const range = ref([0,0]);
const tokenExiste = ref(false);
const palavraAtual = ref("");
const palavrasChaves = ref([])
const categorias = [
    "Roupas e acessórios", "Imóveis", "Ferramentas", "Veículos", "Móveis/Decoração", "Equipamentos de escritório",
    "Hobbies e jogos", "Esportes"
]
// depois mudar para pegar do backend as categorias, onde o adm pode colocar mais

if(localStorage.getItem("token") != null){
    tokenExiste.value = true;
}
else{
    tokenExiste.value = false;
}
function adicionarPalavra() {
  const novaPalavra = palavraAtual.value.trim();
  if (novaPalavra !== "" && !palavrasChaves.value.includes(novaPalavra)) {
    palavrasChaves.value.push(novaPalavra);
  }
  palavraAtual.value = "";
}

function removerPalavra(index) {
  palavrasChaves.value.splice(index, 1);
}
</script>


<style>
@import "../css/paginaHome/home.css"
</style>