
<template>
  <div class="cart-container">
    <div class="cart-items">
      <div
        class="cart-item"
        v-for="(item, index) in carrinho"
     
      >
        <img />

        <div class="item-details">
          <h3>{{ item.nome }}</h3>
          <p>R$ </p>
        </div>

        <div class="item-actions">
          <select
           
            
          >
            <!-- <option v-for="n in 10" :key="n" :value="n">{{ n }}</option> -->
          </select>

          <button @click="removeItem(index)">
            <v-icon>mdi-delete</v-icon>
          </button>
        </div>
      </div>
    </div>

    
    <div class="cart-summary" v-if="cartItems.length">
      <p><strong>Total de itens:</strong> {{ totalItems }}</p>
      <p><strong>Subtotal:</strong> R$ {{ subtotal.toFixed(2) }}</p>

      <div class="cart-buttons">
        <button class="btn-voltar" @click="voltar">← Voltar às compras</button>
        <button class="btn-comprar" @click="comprar">Finalizar compra</button>
      </div>
    </div>

    <div v-else class="empty-cart">
      <p>Seu carrinho está vazio 😢</p>
      <button class="btn-voltar" @click="voltar">Voltar às compras</button>
    </div>
  </div>
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

onMounted(async () => {
  
  if (!tokenExiste.value) {
     router.push("/");
  }
  if(tokenExiste.value){
    await getRetrieve()
    await getCarrinho()
    await getProdutos()
  }
});

function setarCarrinhoUser(){
  if(carrinho.value && produtos.value){
    for(let i, ) 
  }
}

watch(retrieve, (r) => {
  console.log(r.id, "retrieve id")
})
watch(carrinho, (c) => {
  console.log(c, "carrinho")
})
watch(produtos, (p) => {
  console.log(p, "produtos")
})
const cartItems = 0
const subtotal = 0
const totalItems = 0


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
