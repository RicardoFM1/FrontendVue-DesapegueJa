<template>
  <v-container class="detalhes-container">
    <v-btn
      class="btn-voltar-fixo"
      color="blue"
      prepend-icon="mdi-arrow-left"
      @click="voltar"
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

     

        <div class="informacoes-extra">
          <p><strong>FRETE GRÁTIS ACIMA DE R$ 19</strong></p>
          <p>Receba grátis amanhã</p>
          <p>Retire grátis a partir de amanhã em uma agência</p>
          <p>Devolução grátis: Você tem 30 dias após o recebimento</p>
        </div>

        <div class="detalhes-produto">
          <p><strong>Descrição:</strong> {{ produto.descricao }}</p>
          <p><strong>Categoria:</strong> {{ categoriaNome }}</p>
          <p><strong>Anunciado em:</strong> {{ produto.data_post }}</p>
          <p><strong>Vendedor:</strong> {{ vendedorNome }}</p>
        </div>

        <v-btn class="btn-carrinho" :loading="loadingAdicionar" @click="adicionarAoCarrinho">
          <v-icon left>mdi-cart</v-icon>
          ADICIONAR AO CARRINHO
        </v-btn>
      </div>
    </div>
  </v-container>
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
import { ref, onMounted, watch, computed } from "vue";
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
const categoriaNome = ref();
const vendedorNome = ref();
const usuarioNaoLogado = ref(false)
const loadingAdicionar = ref(false)

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res.status === 200) {
      retrieve.value = res.data;
      usuario.value = res.data;
    }
  } catch (error) {
    toast.error("Erro ao buscar o usuário");
  }
}




async function getVendedor() {
  try {
    const res = await connection.get("/desapega/usuarios");
    if (res.status === 200) vendedor.value = res.data;
  } catch (error) {
    toast.error("Erro ao buscar vendedores");
  }
}

async function getProdutos() {
  carregandoProdutos.value = true;
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
      itens.value = res.data;
      const id = parseInt(route.params.id);
      produto.value = res.data.find((p) => p.id === id) || {};
    } else {
      erroGetProduto.value = true;
    }
  } catch (error) {
    erroGetProduto.value = true;
    toast.error("Erro ao carregar produto");
  } finally {
    carregandoProdutos.value = false;
  }
}

async function getCategorias() {
  try {
    const res = await connection.get(`/desapega/categorias`);
    if (res.status === 200){
      categorias.value = res.data;
    } 
  } catch (error) {
    toast.error("Erro ao carregar categorias");
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

onMounted(async () => {
  if (tokenExiste.value) await getRetrieve();
  await Promise.all([getProdutos(), getCategorias(), getVendedor() ]);
  
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
    // dps mudar a quantidade, quando clicar dnv adicionar mais 1 se caso já tiver no carrinho
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