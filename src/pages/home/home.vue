isto?
<template>
  <div v-if="tokenExiste == true">
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
            :disabled="carregandoProdutos"
          >
            Anunciar
          </v-btn>

          <v-btn
            class="ml-4 mr-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
            @click="toCarrinho"
            :disabled="carregandoProdutos"
          >
            Carrinho
          </v-btn>

          <v-menu v-model="menu" offset-y>
            <template #activator="{ props }">
              <v-btn :disabled="carregandoProdutos" v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-card class="pa-4" width="300">
              <v-row justify="center">
                

             <v-avatar
  size="70"
  class="d-flex align-center justify-center"
  :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'"
>
  <template v-if="avatarUsuario.tipo === 'imagem'">
    <v-img :src="avatarUsuario.src" cover />
  </template>

  <template v-else>
    <span class="text-white text-h6 font-weight-bold">
      {{ avatarUsuario.texto }}
    </span>
  </template>
</v-avatar>






              </v-row>
              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 nomeUsuario ellipses">
                      {{ usuario?.nome }}
                    </div>
                  </template>
                  <span>{{ usuario?.nome }}</span>
                </v-tooltip>
              </v-row>

              <v-row justify="center">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <div v-bind="props" class="pa-1 emailUsuario ellipses">
                      {{ usuario?.email }}
                    </div>
                  </template>
                  <span>{{ usuario?.email }}</span>
                </v-tooltip>
              </v-row>

              <v-divider class="my-3"></v-divider>

              <v-btn
                block
                color="#eaece7"
                variant="flat"
                class="mb-4"
                @click="toPerfil"
                :disabled="carregandoProdutos"
              >
                PERFIL
              </v-btn>
              <v-btn
                block
                color="#cc0000"
                variant="flat"
                class="mb-4"
                @click="removerToken"
                :disabled="carregandoProdutos"
              >
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
              class="inputPesquisa transition-all"
              label="Pesquisar"
              width="30%"
              rounded
              :class="{ 'fixed-input': isFixed }"
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
          </div>
          <div style="width: 100%; display: flex;
          justify-content: center;">
            <v-sheet
            v-if="erroGetProduto"
            width="400"
  
            color="red-darken-2"
            class="pa-4 mb-4 text-white text-center rounded-lg"
            elevation="4"
            >
            <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
            <p class="text-h6 mb-2">Erro ao listar os produtos 😢</p>
  <p class="mb-4">Verifique sua conexão e tente novamente.</p>
  <v-btn
  color="white"
    variant="outlined"
    prepend-icon="mdi-refresh"
    @click="recarregarProdutos"
    :disabled="carregandoProdutos"

  >
    Tentar novamente
  </v-btn>
</v-sheet>
</div>
<div
  v-if="carregandoProdutos"
  class="d-flex justify-center align-center my-8"
  style="height: 300px"
>
  <v-progress-circular
    indeterminate
    color="primary"
    size="64"
    width="6"
  ></v-progress-circular>
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
                :src="getProdutoImage(item.imagem)"
                width="330"
                position="center"
                height="330"
                cover
                class="imgItem"
              >
                <template #error>
                  <img src="/png-triste-erro.png" alt="Imagem não disponível" />
                </template>
              </v-img>

              <v-card-title class="ellipses mb-2 rounded font-weight-bold">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p v-bind="props">
                      {{ item.nome }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    {{ item.nome }}
                  </span>
                </v-tooltip>
              </v-card-title>
              <v-card-subtitle
                style="width: 50%"
                class="mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p
                      v-bind="props"
                      class="text-subtitle-1 ellipses bg-green text-white rounded px-2 py-1 d-inline-block"
                    >
                      R$ {{ item.preco / 100 }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    R$ {{ item.preco / 100 }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>
              <v-card-subtitle
                class="ellipses text-subtitle-1 mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p style="width: 50%" class="ellipses" v-bind="props" >
                      Em estoque: {{ item.estoque }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Estoque : {{ item.estoque }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>
              <v-chip
                class="text-subtitle-1 mb-2 ml-3 rounded font-weight-bold elevation-1"
                size="small"
                text-color="white"
                :color="
                  categorias.find((c) => c.id == item.categoria_id)?.cor ||
                  '#808080'
                "
                pill
                outlined
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p class="ellipses" v-bind="props" v-if="categorias.length > 0">
                      <v-icon left small class="mr-2">mdi-tag</v-icon>
                      {{
                        categorias.find((c) => c.id == item.categoria_id)
                          ?.nome || "Sem categoria"
                      }}
                    </p>
                    <p v-else>Carregando categoria...</p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Categoria :
                    {{
                      categorias.find((c) => c.id == item.categoria_id)?.nome ||
                      "Sem categoria"
                    }}
                  </span>
                </v-tooltip>
              </v-chip>
              
              <v-chip
                class="text-subtitle-1 mb-2 ml-3 rounded font-weight-bold elevation-1"
                size="small"
                text-color="white"
                
                pill
                outlined
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p class="ellipses" v-bind="props" v-if="vendedor.length > 0">
                      <v-icon left small class="mr-2">mdi-account</v-icon>
                      {{
                        
                        vendedor.find((v) => v.id == item.usuario_id)
                        ?.nome || "Sem vendedor "
                      }}
                    </p>
                    <p v-else>Carregando vendedor...</p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Vendedor :
                    {{
                      vendedor.find((v) => v.id == item.usuario_id)?.nome ||
                      "Sem vendedor"
                    }}
                  </span>
                </v-tooltip>
              </v-chip>

              <div class="divBtnAdicionar">
                <v-card-actions class="divBtnsAcoes">
                  <v-btn
                    variant="flat"
                    color="#2196F3"
                    class="btnDetalhes"
                    @click="toDetalhes(index + 1)"
                    density="comfortable"
                    :disabled="carregandoProdutos"
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
                      @click="addToCart(item)"  
                      :disabled="carregandoProdutos"
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
            :disabled="carregandoProdutos"
          >
            Anunciar
          </v-btn>

          <v-btn
            class="ml-4"
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
            @click="toCarrinho"
            :disabled="carregandoProdutos"
          >
            Carrinho
          </v-btn>
          <v-btn
            class="ml-4"
            variant="flat"
            color="#5865f2"
            @click="toCadastro"
            :disabled="carregandoProdutos"
          >
            Cadastre-se
          </v-btn>
          <v-btn
            @click="toLogin"
            class="ml-4 mr-4"
            variant="outlined"
            color="blue-darken-4"
            :disabled="carregandoProdutos"
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
              class="inputPesquisa transition-all"
              label="Pesquisar"
              width="30%"
              rounded
              :class="{ 'fixed-input': isFixed }"
              variant="outlined"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
          </div>
          <div style="width: 100%; display: flex;
          justify-content: center;">
            <v-sheet
            v-if="erroGetProduto"
            width="400"
  
            color="red-darken-2"
            class="pa-4 mb-4 text-white text-center rounded-lg"
            elevation="4"
            >
            <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
            <p class="text-h6 mb-2">Erro ao listar os produtos 😢</p>
  <p class="mb-4">Verifique sua conexão e tente novamente.</p>
  <v-btn
  color="white"
    variant="outlined"
    prepend-icon="mdi-refresh"
    @click="recarregarProdutos"
    :disabled="carregandoProdutos"

  >
    Tentar novamente
  </v-btn>
</v-sheet>
</div>
<div
  v-if="carregandoProdutos"
  class="d-flex justify-center align-center my-8"
  style="height: 300px"
>
  <v-progress-circular
    indeterminate
    color="primary"
    size="64"
    width="6"
  ></v-progress-circular>
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
                :src="getProdutoImage(item.imagem)"
                width="330"
                position="center"
                height="330"
                cover
                class="imgItem"
              >
                <template #error>
                  <img src="/png-triste-erro.png" alt="Imagem não disponível" />
                </template>
              </v-img>

              <v-card-title class="ellipses mb-2 rounded font-weight-bold">
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p v-bind="props">
                      {{ item.nome }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    {{ item.nome }}
                  </span>
                </v-tooltip>
              </v-card-title>
              <v-card-subtitle
                style="width: 50%"
                class="mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p
                      v-bind="props"
                      class="text-subtitle-1 ellipses bg-green text-white rounded px-2 py-1 d-inline-block"
                    >
                      R$ {{ item.preco / 100 }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    R$ {{ item.preco / 100 }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>
              <v-card-subtitle
                class="ellipses text-subtitle-1 mb-2 rounded font-weight-bold"
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p style="width: 50%" class="ellipses" v-bind="props">
                      Em estoque: {{ item.estoque }}
                    </p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Estoque : {{ item.estoque }}
                  </span>
                </v-tooltip>
              </v-card-subtitle>
              <v-chip
                class="text-subtitle-1 mb-2 ml-3 rounded font-weight-bold elevation-1"
                size="small"
                text-color="white"
                :color="
                  categorias.find((c) => c.id == item.categoria_id)?.cor ||
                  '#808080'
                "
                pill
                outlined
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p class="ellipses" v-bind="props" v-if="categorias.length > 0">
                      <v-icon left small class="mr-2">mdi-tag</v-icon>
                      {{
                        categorias.find((c) => c.id == item.categoria_id)
                          ?.nome || "Sem categoria"
                      }}
                    </p>
                    <p v-else>Carregando categoria...</p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Categoria :
                    {{
                      categorias.find((c) => c.id == item.categoria_id)?.nome ||
                      "Sem categoria"
                    }}
                  </span>
                </v-tooltip>
              </v-chip>
              
              <v-chip
                class="text-subtitle-1 mb-2 ml-3 rounded font-weight-bold elevation-1"
                size="small"
                text-color="white"
                
                pill
                outlined
              >
                <v-tooltip top>
                  <template #activator="{ props }">
                    <p class="ellipses" v-bind="props" v-if="vendedor.length > 0">
                      <v-icon left small class="mr-2">mdi-account</v-icon>
                      {{
                        
                        vendedor.find((v) => v.id == item.usuario_id)
                        ?.nome || "Sem vendedor "
                      }}
                    </p>
                    <p v-else>Carregando vendedor...</p>
                  </template>
                  <span style="max-width: 150px; display: block">
                    Vendedor :
                    {{
                      vendedor.find((v) => v.id == item.usuario_id)?.nome ||
                      "Sem vendedor"
                    }}
                  </span>
                </v-tooltip>
              </v-chip>

              <div class="divBtnAdicionar">
                <v-card-actions class="divBtnsAcoes">
                  <v-btn
                    variant="flat"
                    color="#2196F3"
                    class="btnDetalhes"
                    @click="toDetalhes(index + 1)"
                    density="comfortable"
                    :disabled="carregandoProdutos"
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
                      @click="addToCart(item)"  
                      :disabled="carregandoProdutos"
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
                Usuário sem permissão para executar esta ação! Tente primeiro
                fazer login.
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text="Fazer login"
                  base-color="green"
                  variant="flat"
                  v-model="modalAlertShow"
                  @click="toLogin"
                  :disabled="carregandoProdutos"
                >
                </v-btn>
                <v-btn
                  text="Ok"
                  base-color="blue"
                  v-model="modalAlertShow"
                  @click="modalAlertShow = false"
                  :disabled="carregandoProdutos"
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
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useCartStore } from "@/stores/cart";
import { connection } from "@/connection/axiosConnection";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

const token = ref();
const tokenExiste = ref(false);
if (localStorage.getItem("token") != null) {
  tokenExiste.value = true;
  token.value = localStorage.getItem("token");
} else {
  tokenExiste.value = false;
}

const isFixed = ref(false)
const inputProps = {
  outlined: true,
  hideDetails: true
}

function handleScroll() {
  isFixed.value = window.scrollY > 200
}

const retrieve = ref();
const usuario = ref();
const categorias = ref([]);
const erroGetProduto = ref(false);
const vendedor = ref([])


async function getCategorias() { 
  try {
    const res = await connection.get(`/desapega/categorias`);
    if (res.status == 200) {
      console.log(res.data.nome, "Nome categoria");
      categorias.value = res.data;
    } else {
      return "Sem categoria";
    }
  } catch (error) {
    return null;
  }
}

async function getVendedor(){
  try{
    const res = await connection.get("/desapega/usuarios")
    if(res.status == 200) {
      console.log(res.data)
      vendedor.value = res.data
     
    }
    else{
      return "Sem vendedor"
    }
  } 
  catch(error){
    return null
  }
}

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;
      usuario.value = res.data;
      console.log("FOTO PERFIL REAL:", res.data.foto_Perfil);
console.log("Tamanho da string:", res.data.foto_Perfil?.length);
console.log("RETORNO API:", res.data);
      
      if (retrieve.foto_Perfil && retrieve.foto_Perfil !== "null" && retrieve.foto_Perfil !== "") {
        if (retrieve.foto_Perfil.startsWith("data:image")) {
          retrieve.foto_Perfil = retrieve.foto_Perfil;
        } else if (retrieve.foto_Perfil.startsWith("/9j/")) {
          retrieve.foto_Perfil = `data:image/jpeg;base64,${retrieve.foto_Perfil}`;
        } else if (retrieve.foto_Perfil.startsWith("iVBORw0KGgo")) {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        } else if (retrieve.foto_Perfil.startsWith("R0lGODlh") || retrieve.foto_Perfil.startsWith("R0lGODdh")) {
          retrieve.foto_Perfil = `data:image/gif;base64,${retrieve.foto_Perfil}`;
        } else {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        }
      } else {
        retrieve.foto_Perfil = null;
      }

    
    } else {
      toast.error("Erro ao buscar o usuário");
      console.error("Resposta inesperada:", res);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    toast.error(error.response?.data?.message || "Erro ao buscar o usuário");
  }
}


onMounted(async() => {
  try{
    await getProdutos();

    if (tokenExiste.value) {
      await getRetrieve();
    }
    await getCategorias();
    await getVendedor();
      
 
   
  }catch(erro){
    erroGetProduto.value = true
  }
  window.addEventListener('scroll', handleScroll)
});


watch(retrieve, (r) => {
  console.log(r, "retrieve");
})
watch(usuario, (novoValor) => {
  console.log("🧩 FOTO DO USUÁRIO:", novoValor?.foto_Perfil);
});


onUnmounted(() => {
   window.removeEventListener('scroll', handleScroll)
})
watch(retrieve, (novoRetrieve) => {
  console.log(novoRetrieve.admin, "admin");
});

watch(vendedor, (novoVendedor) => {
  const umvendedor = novoVendedor.find((v) => v.id == 37)?.nome 
console.log(umvendedor, "um vendedor")
})


  console.log(token.value, "token")

const itens = ref([]);
const carregandoProdutos = ref(false)
async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;

 
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  if (retrieve.admin == true) {
    try {
      const res = await Promise.race([
        connection.get("/desapega/produtos"),
        timeout,
      ]);

      if (res.status == 200) {
        itens.value = res.data;
        erroGetProduto.value = false;
      } else {
        toast.error("Erro ao buscar o produto");
        erroGetProduto.value = true;
      }
    } catch (error) {
      const mensagem =
        error.message === "Tempo limite excedido"
          ? "Tempo limite excedido ao buscar produtos"
          : error.response?.data?.message || "Erro ao buscar o produto";
      console.log(mensagem);
      toast.error(mensagem);
      erroGetProduto.value = true;
    } finally {
      
      setTimeout(() => {
        carregandoProdutos.value = false;
      }, 500);
    }
  } else {
    try {
      const res = await Promise.race([
        connection.get("/desapega/produtos?status=ativo"),
        timeout,
      ]);

      if (res.status == 200) {
        itens.value = res.data;
        erroGetProduto.value = false;
      } else {
        toast.error("Erro ao buscar o produto");
        erroGetProduto.value = true;
      }
    } catch (error) {
      const mensagem =
        error.message === "Tempo limite excedido"
          ? "Tempo limite excedido ao buscar produtos"
          : error.response?.data?.message || "Erro ao buscar o produto";
      console.log(mensagem);
      toast.error(mensagem);
      erroGetProduto.value = true;
    } finally {
      setTimeout(() => {
        carregandoProdutos.value = false;
      }, 500);
    }
  }
}

function getProdutoImage(imagem) {
  if (!imagem || imagem === "Sem imagem" || imagem === "null") {
    return "/png-triste-erro.png";
  }

  
  if (imagem.startsWith("data:image")) {
    return imagem;
  }

  
  if (imagem.startsWith("/9j/")) return `data:image/jpeg;base64,${imagem}`; 
  if (imagem.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${imagem}`; 
  if (imagem.startsWith("R0lGODlh") || imagem.startsWith("R0lGODdh")) return `data:image/gif;base64,${imagem}`; // GIF
  if (imagem.startsWith("UklGR")) return `data:image/webp;base64,${imagem}`; 

  
  return `data:image/png;base64,${imagem}`;
}

watch(erroGetProduto, (v) => console.log('erroGetProduto mudou para ->', v));

function recarregarProdutos() {
  erroGetProduto.value = false; 

    getProdutos();

}


watch(itens, (novoItem) => {
  novoItem.forEach((item) => {
    console.log(item, "Produtos");
  });
});

const modalAlertShow = ref(false);
const cart = useCartStore();

function addToCart(item) {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  console.log('ITEM RECEBIDO:', item);
  
  cart.addToCart({
    id: item.id,
    nome: item.nome,
    preco: item.preco,
    image: item.imagem,
  });

}

const drawer = ref(false);
const range = ref([0, 0]);
const categoriasList = [
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

const getIniciais = (nome) => {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
};

const avatarUsuario = computed(() => {
  const nome = usuario.value?.nome || "Usuário";
  const foto = usuario.value?.foto_Perfil;

  if (foto && foto !== "null" && foto !== "Sem imagem" && foto.trim() !== "") {
  
    if (foto.startsWith("data:image")) {
      return { tipo: "imagem", src: foto };
    }

 
    if (foto.startsWith("/9j/")) return { tipo: "imagem", src: `data:image/jpeg;base64,${foto}` };
    if (foto.startsWith("iVBORw0KGgo")) return { tipo: "imagem", src: `data:image/png;base64,${foto}` };

    
    return { tipo: "iniciais", texto: getIniciais(nome) };
  }


  return { tipo: "iniciais", texto: getIniciais(nome) };
});


function toPerfil() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/perfil");
}

function removerToken() {
  localStorage.removeItem("token");
  router.push("/login");
}

console.log("FOTO PERFIL REAL:", usuario.value?.foto_Perfil);
console.log("Tamanho da string:", usuario.value?.foto_Perfil?.length);

function toDetalhes(id) {
  router.push(`/produto/${id}`);
}
function toAnunciar() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/anunciar");
}
function toCarrinho() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/carrinho");
}
function toCadastro() {
  router.push("/cadastro");
}
function toLogin() {
  router.push("/login");
}
</script>

<style>
@import "../css/paginaHome/home.css";

</style>