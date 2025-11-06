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

    <div class="detalhes-conteudo">
      <div class="imagem-container">
        <v-img
          :src="getProdutoImage(produto.imagem)"
          class="produto-imagem"
          :aspect-ratio="1"
          contain
        ></v-img>
      </div>

      <div class="info-container">
        <h1 class="titulo-produto">{{ produto.produto }}</h1>

        <div class="avaliacoes">
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star</v-icon>
          <v-icon color="amber">mdi-star-half-full</v-icon>
          <span class="texto-avaliacao">(483)</span>
        </div>

        <div class="preco-container">
          <p class="preco-antigo">{{ produto.precoAntigo }}</p>
          <p class="preco-novo">{{ formatarPreco(produto.valor) }}</p>
          <p class="parcelamento">6x {{ parcela(produto.valor) }} sem juros</p>
        </div>

        <v-btn class="btn-promo" color="blue-lighten-5">
          R$ 20 OFF BB VISA
        </v-btn>

        <div class="informacoes-extra">
          <p><strong>FRETE GRÁTIS ACIMA DE R$ 19</strong></p>
          <p>Receba grátis amanhã</p>
          <p>Retire grátis a partir de amanhã em uma agência</p>
          <p>Devolução grátis: Você tem 30 dias após o recebimento</p>
        </div>

        <div class="detalhes-produto">
          <p><strong>Descrição:</strong> {{ produto.descricao }}</p>
          <p><strong>Categoria:</strong> {{ produto.categoria }}</p>
          <p><strong>Estado:</strong> {{ produto.estado }}</p>
        </div>

        <v-btn class="btn-carrinho" @click="adicionarCarrinho(produto)">
          <v-icon left>mdi-cart</v-icon>
          ADICIONAR AO CARRINHO
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();



const itens = ref([]);

async function getProdutos() {

  

  if (retrieve.admin == true) {
    try {
      const res = await Promise.race([
        connection.get("/desapega/produtos"),
        
      ]);

      if (res.status == 200) {
        itens.value = res.data;
        
      } else {
        toast.error("Erro ao buscar o produto");
       
      }
    } catch (error) {
      const mensagem =
        error.message === "Tempo limite excedido"
          ? "Tempo limite excedido ao buscar produtos"
          : error.response?.data?.message || "Erro ao buscar o produto";
      console.log(mensagem);
      toast.error(mensagem);
      
    } 
  } else {
    try {
      const res = await Promise.race([
        connection.get("/desapega/produtos?status=ativo"),
       
      ]);

      if (res.status == 200) {
        itens.value = res.data;
        
      } else {
        toast.error("Erro ao buscar o produto");
        
      }
    } catch (error) {
      const mensagem =
        error.message === "Tempo limite excedido"
          ? "Tempo limite excedido ao buscar produtos"
          : error.response?.data?.message || "Erro ao buscar o produto";
      console.log(mensagem);
      toast.error(mensagem);
     
    }
  }
}

onMounted(() => {
  const id = parseInt(route.params.id);
  
  getProdutos()
});

function voltar() {
  router.back();
}

function adicionarCarrinho(produto) {
  console.log("Adicionado ao carrinho:", produto);
}

function formatarPreco(valor) {
  if (!valor) return "R$ 0,00";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parcela(valor) {
  const valorParcela = valor / 6;
  return valorParcela.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
function getProdutoImage(imagem) {
  if (imagem && imagem !== "Sem imagem" && imagem.length > 0) {
    return imagem.startsWith("data:")
      ? imagem
      : `data:image/png;base64,${imagem}`;
  }

  return "/png-triste-erro.png";
}
</script>

<style src="../css/paginaDetalhesProduto/detalhes.css"></style>
