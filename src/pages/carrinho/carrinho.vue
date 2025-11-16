
<template>
  <v-sheet
    v-if="carregandoCarrinho"
    class="d-flex justify-center align-center my-8"
  height="200"
  >
    <v-progress-circular
    size="50"
    color="teal"
    indeterminate
    >
    
  </v-progress-circular>
  <p class="ml-3">Carregando seu carrinho... aguarde</p>
</v-sheet>
<v-sheet
            v-if="erroGetProduto"
            width="400"
  
            color="red-darken-2"
            class="pa-4 mb-4 text-white text-center rounded-lg"
            elevation="4"
            >
            <v-icon size="40" color="white" class="mb-2">mdi-alert-circle</v-icon>
            <p class="text-h6 mb-2">Erro ao listar seu carrinho</p>
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
  <v-container
  class="d-flex cart-container"
  >

    
  <v-sheet class="sheetItems" v-if="!carregandoCarrinho && carrinhoUser.length > 0">
    <v-sheet class="cart-items">
      <div
      class="cart-item"
        v-for="(item, index) in carrinhoUser"
     
        >
        <v-img
                :src="getProdutoImage(item.imagem)"
                width="50"
                position="center"
                height="100"
                cover
                class="imgItem"
              >
                <template #error>
                  <img src="/png-triste-erro.png" alt="Imagem não disponível" />
                </template>
              </v-img>

        <div class="item-details">
          <h3 class="ellipses">{{ item.nome }}</h3>
          <p class="ellipses">R$ {{ item.preco / 100 }}</p>
        </div>

        <div class="item-actions">
          <select
           
            
          >
            <option v-for="n in item.estoque" :key="n" :value="n">{{ n }}</option>
          </select>

          <button @click="removeItem(index)">
            <v-icon>mdi-delete</v-icon>
          </button>
        </div>
      </div>
    </v-sheet>
  </v-sheet>

    
    
  <v-sheet height="200" class="cart-summary" v-if="carrinhoUser.length > 0 && !carregandoCarrinho ">
    <p><strong>Total de itens:</strong> {{ totalItems }}</p>
      <p><strong>Subtotal:</strong> R$ {{ subtotal.toFixed(2) }}</p>

      <div class="cart-buttons">
        <button class="btn-voltar" @click="voltar">← Voltar às compras</button>
        <button class="btn-comprar" @click="comprar">Finalizar compra</button>
      </div>
    </v-sheet>
    
    <v-sheet v-if="!carregandoCarrinho && carrinhoUser.length <= 0" class="empty-cart">
      <p>Seu carrinho está vazio 😢</p>
      <button class="btn-voltar" @click="voltar">Voltar às compras</button>
      
    </v-sheet>
  </v-container>
</template>

<script setup>
import { connection } from "@/connection/axiosConnection";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);
const retrieve = ref()
const carrinho = ref([])
const produtos = ref([])
const erroGetProduto = ref(false)
const carregandoProdutos = ref(true)
const carrinhoUser = ref([])
const carregandoCarrinho = ref(true)
const totalItems = ref()

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;
      
    } else {
      toast.error("Erro ao buscar o usuário");
      console.error("Resposta inesperada:", res);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    toast.error(error.response?.data?.message || "Erro ao buscar o usuário");
  }
}

async function getCarrinho(){
  try{
    const res = await connection.get(`/desapega/carrinho/${retrieve.value.id}`)

    if(res.status == 200 || res.status == 201){
      carrinho.value = res.data
    }else{
      toast.error("Estamos com dificuldade de listar seus produtos...")
    }
  }catch(err){
    toast.error(err.response?.data?.message || "Erro ao listar seus produtos")
  }
}

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
        produtos.value = res.data;
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
        produtos.value = res.data;
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

async function setarCarrinhoUser(){
  carregandoCarrinho.value = true
  try{

    if(carrinho.value && produtos.value){
      const produtoId = [];
      const carrinhoUsernew = []
      const apenasProdutoId = carrinho.value.map(item => item.produto_id)
      produtoId.push(...apenasProdutoId)
      for(var i = 0; i <= produtoId.length - 1; i++) {
        const find = produtos.value.find((p) => p.id === produtoId[i])
        carrinhoUsernew.push(find)
      }
      
      carrinhoUser.value = [...carrinhoUsernew].reverse()
      totalItems.value = carrinhoUsernew.length
    }
  }catch(err){
    toast.error("Erro ao carregar carrinho, tente novamente!")
  }finally{
    carregandoCarrinho.value = false
  }
}

onMounted(async () => {
  
  if (!tokenExiste.value) {
     router.push("/");
  }
  if(tokenExiste.value){
    await getRetrieve()
    await getCarrinho()
    await getProdutos()
    await setarCarrinhoUser()
  }
});



watch(retrieve, (r) => {
  console.log(r.id, "retrieve id")
})
watch(carrinho, (c) => {
  console.log(c, "carrinho")
})
watch(produtos, (p) => {
  console.log(p, "produtos")
})
watch(carrinhoUser, (ca) => {
  console.log(ca, "Carrinho user")
})

function recarregarProdutos() {
  erroGetProduto.value = false; 

    getProdutos();

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

const subtotal = 0


function removerItem(index) {
  
}

function voltar() {
  router.push("/"); 
}

function comprar() {
  alert("Compra finalizada com sucesso! 🛒");
  router.push("/");
}
</script>

<style scoped>
@import "../css/paginaCarrinho/carrinho.css";

</style>
