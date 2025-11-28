<template>
  <v-layout>

    <v-container class="detalhes-container">
      <v-app-bar>
       
        <v-spacer></v-spacer>
         <v-btn
    variant="flat"
    prepend-icon="mdi-home"
    color="#1976D2"
    @click="toHome"
    :disabled="carregando"
  >
    Home
  </v-btn>
        <v-badge
  :content="carrinho.length"
  color="primary"
  class="ml-4 mr-4"
>
  <v-btn
    variant="flat"
    prepend-icon="mdi-cart"
    color="#3fa34f"
    @click="toCarrinho"
    :disabled="carregando"
  >
    Carrinho
  </v-btn>
</v-badge>

          <v-menu v-model="menu" offset-y location="bottom end">
            <template #activator="{ props }">
              <v-tooltip top>
                <template #activator="{ props: tooltip }">
                  <v-btn
                    v-bind="{ ...props, ...tooltip }"
                    :disabled="carregando"
                    variant="text"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <span>Mais opções</span>
              </v-tooltip>
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
                prepend-icon="mdi-account"
                @click="toPerfil"
                :disabled="carregando"
              >
                PERFIL
              </v-btn>
              <v-btn
                block
                color="#cc0000"
                variant="flat"
                class="mb-4"
                prepend-icon="mdi-logout"
                @click="buttonSairClicado = !buttonSairClicado"
                :disabled="carregando"
                >
                SAIR
              </v-btn>
            </v-card>
          </v-menu>
        </v-app-bar>
      <v-btn
      class="btn-voltar-fixo text-h5"
      color="blue"
      prepend-icon="mdi-arrow-left"
      @click="voltar"
      width="100"
      variant="text"
      >
      Voltar
    </v-btn>
    
    <div v-if="carregandoProdutos" class="d-flex justify-center align-center my-8" style="height: 300px">
      <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
    </div>
    
    <div v-else-if="erroGetProduto" style="width: 100%; display: flex; justify-content: center;">
      <v-sheet
        width="400"
        color="red-darken-2"
        class="pa-4 mb-4 text-white text-center rounded-lg"
        elevation="4"
      >
        <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
        <p class="text-h6 mb-2">Erro ao carregar o produto 😢</p>
        <p class="mb-4">Verifique sua conexão e tente novamente.</p>
        <v-btn
          color="white"
          variant="outlined"
          prepend-icon="mdi-refresh"
          @click="recarregarProdutos"
        >
          Tentar novamente
        </v-btn>
      </v-sheet>
    </div>

    <div v-else class="detalhes-conteudo">
      <div class="imagem-container">
        <v-img
          :src="getProdutoImage(produto.imagem)"
          class="produto-imagem"
          :aspect-ratio="1"
          contain
        ></v-img>
      </div>

      <div class="info-container">
        <h1 class="titulo-produto">{{ produto.nome }}</h1>

        <div class="avaliacoes">
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star-half-full</v-icon>
          <span class="texto-avaliacao">(483)</span>
        </div>

        <div class="preco-container">
          <p class="preco-novo">{{ precoFormatado }}</p>
          
          
        </div>

        
        <div class="detalhes-produto text-h5">
          <p class="mt-4"><strong>Descrição:</strong> {{ produto.descricao }}</p>
          <p class="mt-4"><strong>Categoria:</strong> {{ categoriaNome }}</p>
          <p class="mt-4"><strong>Anunciado em:</strong> {{ produto.data_post }}</p>
          <p class="mt-4"><strong>Vendedor:</strong> {{ vendedorNome }}</p>
        </div>

        <v-btn class="btn-carrinho" :disabled="loadingInformacoes" :loading="loadingAdicionar" @click="adicionarAoCarrinho">
          <v-icon left>mdi-cart</v-icon>
          ADICIONAR AO CARRINHO
        </v-btn>
      </div>
    </div>
  </v-container>
</v-layout>
   <v-dialog
            max-width="500"
            v-model="usuarioNaoLogado"
            v-if="usuarioNaoLogado == true"
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
                  v-model="usuarioNaoLogado"
                  @click="toLogin"
                  :disabled="carregandoProdutos"
                >
              </v-btn>
                <v-btn
                  text="Ok"
                  base-color="blue"
                  v-model="usuarioNaoLogado"
                  @click="usuarioNaoLogado = false"
                  :disabled="carregandoProdutos"
                  >
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { connection } from "@/connection/axiosConnection";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const route = useRoute();
const router = useRouter();


const token = ref();
const tokenExiste = ref(false);
if (localStorage.getItem("token")) {
  tokenExiste.value = true;
  token.value = localStorage.getItem("token");
}

const retrieve = ref();
const usuario = ref();
const categorias = ref([]);
const vendedor = ref([]);
const itens = ref([]);
const produto = ref({});
const erroGetProduto = ref(false);
const carregandoProdutos = ref(false);
const carregando = ref(false);
const categoriaNome = ref();
const vendedorNome = ref();
const usuarioNaoLogado = ref(false)
const loadingAdicionar = ref(false)
const loadingInformacoes = ref(true)
const menu = ref(false)

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

      if (
        retrieve.foto_Perfil &&
        retrieve.foto_Perfil !== "null" &&
        retrieve.foto_Perfil !== ""
      ) {
        if (retrieve.foto_Perfil.startsWith("data:image")) {
          retrieve.foto_Perfil = retrieve.foto_Perfil;
        } else if (retrieve.foto_Perfil.startsWith("/9j/")) {
          retrieve.foto_Perfil = `data:image/jpeg;base64,${retrieve.foto_Perfil}`;
        } else if (retrieve.foto_Perfil.startsWith("iVBORw0KGgo")) {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        } else if (
          retrieve.foto_Perfil.startsWith("R0lGODlh") ||
          retrieve.foto_Perfil.startsWith("R0lGODdh")
        ) {
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




async function getVendedor() {
  loadingInformacoes.value = true
  try {
    const res = await connection.get("/desapega/usuarios");
    if (res.status === 200) vendedor.value = res.data;
  } catch (error) {
    toast.error("Erro ao buscar vendedores");
  }
  loadingInformacoes.value = false
}
const total = ref(0)

async function getProdutos() {
  carregandoProdutos.value = true;
  loadingInformacoes.value = true
  erroGetProduto.value = false;
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  try {
    const url =
      retrieve.value?.admin === true
        ? "/desapega/produtos"
        : "/desapega/produtos?status=ativo";
    const res = await Promise.race([connection.get(url), timeout]);

    if (res.status === 200) {
      itens.value = res.data.produtos     
  total.value = res.data.total
      const id = parseInt(route.params.id);
      produto.value = res.data.produtos.find((p) => p.id === id) || {};
    } else {
      erroGetProduto.value = true;
    }
  } catch (error) {
    erroGetProduto.value = true;
    toast.error("Erro ao carregar produto");
  } finally {
    carregandoProdutos.value = false;
    loadingInformacoes.value = false
  }
}

async function getCategorias() {
loadingInformacoes.value = true
  try {
    const res = await connection.get(`/desapega/categorias`);
    if (res.status === 200){
      categorias.value = res.data;
    } 
  } catch (error) {
    toast.error("Erro ao carregar categorias");
  }finally{
    loadingInformacoes.value = false
  }
}
watch(produto, (p) => {
console.log(p, "produto")
})
watch(categorias, (c) => {
console.log(c, "categorias")
})
watch(categoriaNome, (c) => {
console.log(c)
})
watch([produto, categorias], ([p, c]) => {
  if (!p || !p.categoria_id || !c.length) return;

  const cat = c.find(cat => cat.id == p.categoria_id) || "";
  categoriaNome.value = cat ? cat.nome : "";
});
watch([produto, vendedor], ([p, v]) => {
  if (!v || !p.usuario_id || !v.length) return;

  const vendedor = v.find(vend => vend.id == p.usuario_id) || "";
  vendedorNome.value = vendedor ? vendedor.nome : "";
});
function recarregarProdutos() {
  getProdutos();
}

function voltar() {
  router.back();
}
function toCarrinho() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/carrinho");
}


function getProdutoImage(imagem) {
  if (imagem && imagem !== "Sem imagem" && imagem.length > 0) {
    return imagem.startsWith("data:")
      ? imagem
      : `data:image/png;base64,${imagem}`;
  }
  return "/png-triste-erro.png";
}

const precoFormatado = computed(() => {
  if (!produto.value.preco) return "";
  return (produto.value.preco / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
});

const carrinho = ref([])

async function getCarrinho() {
  if(token.value){
  try {

    const res = await connection.get(`/desapega/carrinho/${retrieve?.value.id}`);
    
    if (res.status == 200 || res.status == 201) {
      carrinho.value = res.data;
    } else {
      toast.error("Estamos com dificuldade de listar seu carrinho...");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao listar seu carrinho");
  }
}
}



onMounted(async () => {
  if (tokenExiste.value) await getRetrieve();
  await Promise.all([getProdutos(), getCategorias(), getVendedor(), getCarrinho() ]);

});
const getIniciais = (nome) => {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
};

const avatarUsuario = computed(() => {
  const nome = usuario.value?.nome || "Usuário";
  const foto = usuario.value?.foto_Perfil;

  if (foto && foto !== "null" && foto !== "Sem imagem" && foto.trim() !== "") {
    if (foto.startsWith("data:image")) {
      return { tipo: "imagem", src: foto };
    }

    if (foto.startsWith("/9j/"))
      return { tipo: "imagem", src: `data:image/jpeg;base64,${foto}` };
    if (foto.startsWith("iVBORw0KGgo"))
      return { tipo: "imagem", src: `data:image/png;base64,${foto}` };

    return { tipo: "iniciais", texto: getIniciais(nome) };
  }

  return { tipo: "iniciais", texto: getIniciais(nome) };
});

async function adicionarAoCarrinho(){
  loadingAdicionar.value = true
 
  if(!retrieve.value?.id){
    usuarioNaoLogado.value = true
    return;
  }
  try{

    const body = {
      usuario_id: retrieve.value?.id,
      produto_id: produto.value.id,
      quantidade: 1
    }
    console.log(body, "carrinho")
    const res = await connection.post("/desapega/carrinho", body, {
      headers:{
        Authorization: `Bearer ${token.value}`
      }
    })
    if(res.status == 201 || res.status == 200){
      toast.success("Produto adicionado ao carrinho!");
    }
    
  }catch(err){
   toast.error(err.response.data.message || "Erro ao adicionar ao carrinho") 
  }finally{
    loadingAdicionar.value = false
    
  }

  
}
function toLogin(){
    router.push("/login")
  }
watch(retrieve, (novo) => {
  console.log("Usuário:", novo);
});
</script>

<style src="../css/paginaDetalhesProduto/detalhes.css"></style> 