<template>
  <v-layout class="bg-grey-lighten-5 d-flex flex-column">
    
    <v-container class="py-4" style="max-width: 1400px;"> 
      <v-row align="center" justify="space-between">
        
        <v-col cols="12" md="4" class="py-0">
          <v-breadcrumbs
            :items="[{ text: 'Home', disabled: false, to: '/' }, { text: 'Detalhes', disabled: true }]"
            class="pa-4"
          >
            <template #title="{ item }">
              <span class="text-caption text-grey-darken-1">{{ item.text }}</span>
            </template>
          </v-breadcrumbs>
          <v-btn
            variant="text"
            color="primary"
            prepend-icon="mdi-arrow-left"
            @click="voltar"
            class="text-body-1 font-weight-bold pa-0 ml-n2 text-capitalize"
            :disabled="carregandoProdutos"
          >
            Voltar
          </v-btn>
        </v-col>

        <v-col cols="12" md="8" class="d-flex justify-end align-center py-0">
          <v-btn
            variant="tonal"
            prepend-icon="mdi-home"
            color="primary"
            @click="toHome"
            :disabled="carregando"
            rounded="lg"
            class="hidden-sm-and-down mr-3"
          >
            Home
          </v-btn>

          <v-btn 
            icon 
            class="mr-2 pa-2" 
            @click="toCarrinho"
            :disabled="carregandoProdutos"
            
          >
            <v-badge 
              color="error" 
              :content="carrinho.length" 
              v-if="carrinho.length > 0"
              offset-x="5" 
              offset-y="5"
            >
              <v-icon color="grey-darken-2">mdi-cart-outline</v-icon>
            </v-badge>
            <v-icon v-else color="grey-darken-2">mdi-cart-outline</v-icon>
          </v-btn>

          <v-menu v-model="menu" offset-y location="bottom end">
            <template #activator="{ props }">
              <v-btn icon v-bind="props" class="ml-1">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-card class="pa-4 rounded-xl" width="300" elevation="4">
              <div class="d-flex flex-column align-center mb-3">
                <v-avatar size="80" class="mb-3" :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'">
                  <v-img v-if="avatarUsuario.tipo === 'imagem'" :src="avatarUsuario.src" cover />
                  <span v-else class="text-h4 text-white">{{ avatarUsuario.texto }}</span>
                </v-avatar>
                <div class="text-h6 font-weight-bold text-truncate w-100 text-center">{{ usuario?.nome }}</div>
                <div class="text-caption text-grey text-truncate w-100 text-center">{{ usuario?.email }}</div>
              </div>

              <v-divider class="mb-3"></v-divider>

              <v-btn block variant="tonal" color="primary" class="mb-2 rounded-lg" prepend-icon="mdi-account" @click="toPerfil">
                Meu Perfil
              </v-btn>
              <v-btn block variant="outlined" color="error" class="rounded-lg" prepend-icon="mdi-logout" @click="buttonSairClicado = !buttonSairClicado">
                Sair
              </v-btn>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
    
    <v-divider></v-divider>
    
    <v-container class="bg-white pa-6 pa-md-10 rounded-xl elevation-1 mb-8" style="max-width: 1400px;">
      
      <div v-if="carregandoProdutos" class="d-flex flex-column justify-center align-center my-8" style="height: 400px">
        <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
        <p class="mt-4 text-grey-darken-1">Carregando detalhes do produto...</p>
      </div>
      
      <div v-else-if="erroGetProduto" class="d-flex justify-center my-8">
        <v-alert
          type="error"
          variant="tonal"
          title="Erro ao carregar o produto 😢"
          text="Não foi possível buscar os detalhes do produto. Verifique sua conexão e tente novamente."
          icon="mdi-wifi-off"
          closable
          max-width="600"
        >
          <template #append>
             <v-btn color="error" variant="outlined" size="small" @click="recarregarProdutos">Tentar Novamente</v-btn>
          </template>
        </v-alert>
      </div>

      <v-row v-else class="detalhes-conteudo">
        
        <v-col cols="12" md="6" class="pr-md-8">
          <v-card class="rounded-xl elevation-2"> 
            <v-img
              :src="getProdutoImage(produto.imagem)"
              class="produto-imagem"
              height="500"
              cover
            >
               <template #placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                     <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                  </v-row>
               </template>
            </v-img>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          
          <h1 class="text-h3 font-weight-bold mb-4">{{ produto.nome }}</h1>
          
          <div class="d-flex align-center mb-6">
            
            
            <v-chip size="default" variant="tonal" color="grey-darken-1" label>
                {{ categoriaNome }}
            </v-chip>
          </div>
          
          <v-divider class="mb-6"></v-divider>

          <div class="preco-container mb-6">
            <span class="text-h4 text-primary font-weight-black">
                {{ precoFormatado }}
            </span>
           
          </div>
          
          <v-btn 
            block 
            size="large"
            color="success" 
            class="text-h6 text-capitalize rounded-lg font-weight-bold mb-6"
            :disabled="loadingInformacoes || produto.estoque <= 0" 
            :loading="loadingAdicionar" 
            @click="adicionarAoCarrinho"
            elevation="4"
          >
            <v-icon left>mdi-cart-plus</v-icon>
            {{ produto.estoque > 0 ? 'ADICIONAR AO CARRINHO' : 'ESGOTADO' }}
          </v-btn>

          <v-card variant="tonal" color="grey-lighten-4" class="pa-4 rounded-lg mb-6">
            <v-list density="compact" class="pa-0">
              <v-list-item class="px-0">
                <v-list-item-title class="font-weight-bold">
                  <v-icon size="18" class="mr-2" color="success">mdi-check-circle-outline</v-icon>
                  Estoque: 
                  <span :class="{'text-success': produto.estoque > 0, 'text-error': produto.estoque <= 0}">
                    {{ produto.estoque > 0 ? `${produto.estoque} disponível` : 'Esgotado' }}
                  </span>
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item class="px-0">
                <v-list-item-title class="font-weight-bold">
                  <v-icon size="18" class="mr-2" color="primary">mdi-store</v-icon>
                  Vendedor: <span class="text-primary">{{ vendedorNome }}</span>
                </v-list-item-title>
              </v-list-item>
              
              <v-list-item class="px-0">
                <v-list-item-title class="font-weight-bold">
                  <v-icon size="18" class="mr-2" color="grey-darken-1">mdi-calendar-range</v-icon>
                  Anunciado em: {{ produto.data_post }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
          
          <div class="detalhes-produto">
            <h2 class="text-h6 font-weight-bold mb-3">Descrição do Produto</h2>
            <p class="text-body-1 text-medium-emphasis" style="line-height: 1.6;">
              {{ produto.descricao }}
            </p>
          </div>
          
        </v-col>
      </v-row>
    </v-container>
    
    <v-dialog v-model="buttonSairClicado" max-width="400">
      <v-card class="rounded-xl pa-4" elevation="10">
        <div class="text-center pt-4">
          <v-avatar color="red-lighten-5" size="80" class="mb-4">
             <v-icon color="error" size="40">mdi-logout-variant</v-icon>
          </v-avatar>
          <div class="text-h5 font-weight-bold mb-2">Sair da Conta?</div>
          <div class="text-body-2 text-grey">Tem certeza que deseja encerrar sua sessão?</div>
        </div>
        <v-card-actions class="justify-center mt-6">
           <v-btn variant="text" color="grey" rounded="lg" @click="buttonSairClicado = false" class="px-6">Cancelar</v-btn>
           <v-btn color="error" variant="flat" rounded="lg" @click="FazerLogout" :loading="loadingLogout" class="px-6">Sair Agora</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="usuarioNaoLogado" max-width="400">
      <v-card class="rounded-xl pa-4">
        <div class="text-center pt-2">
           <v-icon size="48" color="amber" class="mb-2">mdi-alert</v-icon>
           <div class="text-h6 font-weight-bold">Aviso</div>
           <div class="text-body-2 text-grey mt-2">Usuário sem permissão para executar esta ação! Tente primeiro fazer login.</div>
        </div>
        <v-card-actions class="justify-center mt-4">
           <v-btn variant="outlined" color="primary" @click="toLogin" class="mx-2">Fazer Login</v-btn>
           <v-btn variant="text" @click="usuarioNaoLogado = false" class="mx-2">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
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
const buttonSairClicado = ref(false);
const loadingLogout = ref(false);

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
function FazerLogout() {
  loadingLogout.value = true;
  setTimeout(() => {
    localStorage.removeItem("token");
    router.push("/login");
    loadingLogout.value = false;
  }, 2000);
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
function toHome() {
  router.push("/")
}
function toPerfil() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/perfil");
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