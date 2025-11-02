<template>
  <div v-if="tokenExiste == true">
    <div class="divFiltros">
      <v-layout>
        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>
          <v-toolbar-title>Filtros</v-toolbar-title>

          <v-btn prepend-icon="mdi-check" variant="flat" color="#5865f2" @click="toAnunciar">
            Anunciar
          </v-btn>

          <v-btn
            class="ml-4 mr-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
            @click="toCarrinho"
          >
            Carrinho
          </v-btn>

         
          <v-menu v-model="menu" offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-card class="pa-4" width="300">
              <v-row justify="center">
                <v-avatar color="grey darken-2" size="70">
                  <span class="white--text text-h6">{{ iniciais }}</span>
                </v-avatar>
              </v-row>

              <!-- Espaçamento maior entre avatar e nome -->
              <v-row justify="center" class="mt-6">
                <div class="nomeUsuario">{{ usuario.nome }}</div>
              </v-row>

              <v-row justify="center">
                <div class="emailUsuario">{{ usuario.email }}</div>
              </v-row>

              <v-divider class="my-3"></v-divider>

              <v-btn block color="#eaece7" variant="flat" class="mb-4" @click="toPerfil">
                PERFIL
              </v-btn>
              <v-btn block color="#cc0000" variant="flat" class="mb-4" @click="removerToken">
                SAIR
              </v-btn>
            </v-card>
          </v-menu>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :width="345">
          <div class="divLabelSlider">
            <p>Preço</p>
            <p>
              R$ <span>{{ range[0] }}-</span><span>{{ range[1] }}</span>
            </p>
          </div>
          <v-range-slider
            class="sliderFiltro"
            v-model="range"
            step="1"
            max="10000"
            min="0"
          ></v-range-slider>

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
            <v-combobox
              class="comboboxCategoria"
              label="Selecionar"
              :items="categorias"
            ></v-combobox>
          </div>
        </v-navigation-drawer>

        <v-main>
          <div class="divHeaderMain">
            <v-text-field
              v-model="search"
              class="inputPesquisa"
              label="Pesquisar"
              width="30%"
              rounded
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
          </div>
          <div class="divItens">
            <v-card
  width="330"
  min-height="300"
  class="cardItem"
  v-for="(item, index) in itensFiltrados"
  :key="item + '-' + index"
>
  <v-img
    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    width="330"
    class="imgItem"
  ></v-img>

  <v-card-title class="mb-2">
    {{ item.nome }}
  </v-card-title>
  <v-card-subtitle class="mb-2">
    R$ {{ item.preco / 100 }}
  </v-card-subtitle>
  <v-card-subtitle class="mb-2">
    Em estoque: {{ item.estoque }}
  </v-card-subtitle>

  <div class="divBtnAdicionar">
    <v-card-actions class="divBtnsAcoes">
      <v-btn
        variant="flat"
        color="#2196F3"
        class="btnDetalhes"
        @click="toDetalhes(index + 1)"
        
        density="comfortable"
       
      >
        Detalhes
      </v-btn>
<!-- Depois colocar o id que vem no produto no @click de cima indo para detalhes -->
      <v-btn
        variant="flat"
        color="#3fa34f"
        prepend-icon="mdi-cart"
        density="comfortable"
        class="btnAdicionar"
        @click="addToCart"
      >
        Adicionar ao carrinho
      </v-btn>
    </v-card-actions>
  </div>
</v-card>

          </div>
        </v-main>
      </v-layout>
    </div>
  </div>

  <!-- Caso não tenha token -->
  <div v-else>
    <div class="divFiltros">
      <v-layout>
        <v-app-bar>
          <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>

          <v-toolbar-title>Filtros</v-toolbar-title>
          <v-btn 
          prepend-icon="mdi-check" 
          variant="flat" 
          color="#5865f2"
          @click="toAnunciar"
          >
            Anunciar
          </v-btn>

          <v-btn
            class="ml-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
            @click="toCarrinho"
          >
            Carrinho
          </v-btn>
          <v-btn class="ml-4" variant="flat" color="#5865f2" @click="toCadastro">
            Cadastre-se
          </v-btn>
          <v-btn
            @click="toLogin"
            class="ml-4 mr-4"
            variant="outlined"
            color="blue-darken-4"
          >
            Fazer login
          </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :width="345">
          <div class="divLabelSlider">
            <p>Preço</p>
            <p>
              R$ <span>{{ range[0] }}-</span><span>{{ range[1] }}</span>
            </p>
          </div>
          <v-range-slider
            class="sliderFiltro"
            v-model="range"
            step="1"
            max="10000"
            min="0"
          ></v-range-slider>

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
            <v-combobox
              class="comboboxCategoria"
              label="Selecionar"
              :items="categorias"
            ></v-combobox>
          </div>
        </v-navigation-drawer>

        <v-main>
          <div class="divHeaderMain">
            <v-text-field
              v-model="search"
              class="inputPesquisa"
              label="Pesquisar"
              width="40%"
              rounded
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
          </div>
          <div class="divItens">
            <v-card
              width="330"
              min-height="300"
              class="cardItem"
              v-for="(item, index) in itensFiltrados"
              :key="item + '-' + index"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                width="330"
                class="imgItem"
              ></v-img>

              <v-card-title class="mb-2">
                {{ item.nome }}
              </v-card-title>
              <v-card-subtitle class="mb-2">
                R$ {{ item.preco }}
              </v-card-subtitle>
              <v-card-subtitle class="mb-2">
                Em estoque:  {{ item.estoque }}
              </v-card-subtitle>

              <div class="divBtnAdicionar">
    <v-card-actions class="divBtnsAcoes">
      <v-btn
        variant="flat"
        color="#2196F3"
        class="btnDetalhes"
        @click="toDetalhes(index + 1)"
        
        density="comfortable"
       
      >
        Detalhes
      </v-btn>
<!-- Depois colocar o id que vem no produto no @click de cima indo para detalhes -->
      <v-btn
        variant="flat"
        color="#3fa34f"
        prepend-icon="mdi-cart"
        density="comfortable"
        class="btnAdicionar"
        @click="addToCart"
      >
        Adicionar ao carrinho
      </v-btn>
    </v-card-actions>
  </div>
            </v-card>
          </div>
          <v-dialog 
          max-width="500"
          v-model="modalAlertShow"
          v-if="modalAlertShow == true" 
          >
          <v-card title="Aviso">
          <template #prepend>
            <v-icon size="42" color="yellow">mdi-alert</v-icon>
          </template>
          <v-card-text>
            Usuário sem permissão para executar esta ação! Tente primeiro fazer login.
          </v-card-text>
          <v-card-actions>
            <v-btn
            text="Fazer login"
            base-color="green"
            variant="flat"
            v-model="modalAlertShow"
            @click="toLogin"
            >
              
            </v-btn>
            <v-btn
            text="Ok"
            base-color="blue"
            v-model="modalAlertShow"
            @click="modalAlertShow = false"
            >  
            </v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>
        </v-main>
        
      </v-layout>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, computed, onMounted, watch } from "vue";
import { useCartStore } from '@/components/stores/cart'
import { connection } from "@/connection/axiosConnection";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

const token = ref()
const tokenExiste = ref(false);
if (localStorage.getItem("token") != null) {
  tokenExiste.value = true;
  token.value = localStorage.getItem("token")
} else {
  tokenExiste.value = false;
}

const retrieve = ref()


async function getRetrieve(){
  try{
    const res = await connection.get("/desapega/usuarios/retrieve", 
      {
        headers:{
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    if(res.status == 200){
      retrieve.value = res.data
    
    }
    else{
      toast.error("Erro ao buscar o usuário")
    }
  }catch(error){
    console.log(error.response?.data?.message || "Erro ao buscar o usuário")
    toast.error(error.response.data.message || "Erro ao buscar o usuário")
  }
}
onMounted(() => {
  if(tokenExiste.value){
    getRetrieve()
  }
})

watch(retrieve, (novoRetrieve) => {
  console.log(novoRetrieve.admin, "admin")
})

const itens = ref([])
async function getProdutos(){

  if(retrieve.admin == true){
    try{
      const res = await connection.get("/desapega/produtos")
      if(res.status == 200){
        itens.value = res.data
      }else{
        
        toast.error("Erro ao buscar o produto")
      }
    }
    catch(error){
      console.log(error.response.data.message || "Erro ao buscar o produto")
      toast.error(error.response.data.message || "Erro ao buscar o produto")
    }
   
  }
  else{
    try{
      const res = await connection.get("/desapega/produtos?status=ativo")
    if(res.status == 200){
        itens.value = res.data
      }else{
        
        toast.error("Erro ao buscar o produto")
      }
    }
    catch(error){
      console.log(error.response.data.message || "Erro ao buscar o produto")
      toast.error(error.response.data.message || "Erro ao buscar o produto")
    }
   
  }
    

}
onMounted(() => {
  getProdutos()
})

watch(itens, (novoItem) => {
  novoItem.forEach(item => {
    console.log(item, "Produtos")
  })
})

const cart = useCartStore()
const modalAlertShow = ref(false)

function addToCart(item){
  if(tokenExiste.value == false){
    modalAlertShow.value = !modalAlertShow.value
    return
  }
  cart.addToCart({
    id:item.id,
    produto:item.produto,
    valor:item.valor,
    image:item.image
  })
}

const drawer = ref(false);
const range = ref([0, 0]);
const categorias = [
  "Roupas e acessórios",
  "Imóveis",
  "Ferramentas",
  "Veículos",
  "Móveis/Decoração",
  "Equipamentos de escritório",
  "Hobbies e jogos",
  "Esportes",
];

const menu = ref(false);
const search = ref("");



const itensFiltrados = computed(() =>
  itens.value.filter((item) =>
    item.nome.toLowerCase().includes(search.value.toLowerCase())
  )
);



const usuario = ref({
  nome: "Ricardo Moura",
  email: "ricardo@gmail.com",
});

const iniciais = computed(() =>
  usuario.value.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
);

function toPerfil() {
  if(tokenExiste.value == false){
    modalAlertShow.value = !modalAlertShow.value
    return  
  }
  router.push("/perfil");
}

function removerToken() {
  localStorage.removeItem("token");
  router.push("/login");
}

function toDetalhes(id){
  router.push(`/produto/${id}`)
}
function toAnunciar(){
if(tokenExiste.value == false){
  modalAlertShow.value = !modalAlertShow.value
  return
}
  router.push("/anunciar")
}
function toCarrinho(){
  if(tokenExiste.value == false){
    modalAlertShow.value = !modalAlertShow.value
    return
  }
  router.push("/carrinho")
}
function toCadastro(){
  router.push("/cadastro")
}
function toLogin(){
  router.push("/login")
}
</script>

<style>
@import "../css/paginaHome/home.css";
@import "../css/paginaPerfil/perfil.css";
</style>
 