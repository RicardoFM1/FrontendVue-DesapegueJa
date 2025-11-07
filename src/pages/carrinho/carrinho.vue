
<template>
  <div class="cart-container">
    <div class="cart-items">
      <div
        class="cart-item"
        v-for="(item, index) in cartItems"
        :key="item.id"
      >
        <img :src="item.image" :alt="item.nome" />

        <div class="item-details">
          <h3>{{ item.nome }}</h3>
          <p>R$ {{ (item.preco).toFixed(2) }}</p>
        </div>

        <div class="item-actions">
          <select
            :value="item.quantidade"
            @change="cart.updateQuantity(item.id, +$event.target.value)"
          >
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>

          <button @click="removeItem(index)">
            <v-icon>mdi-delete</v-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Resumo -->
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";

const router = useRouter();
const cart = useCartStore();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

onMounted(async () => {
  
  if (!tokenExiste.value) {
     router.push("/");
  }});

const cartItems = computed(() => cart.items);
const subtotal = computed(() => cart.subtotal);
const totalItems = computed(() => cart.totalItems);


function removeItem(index) {
  const item = cartItems.value[index];
  if (item.quantidade > 1) {
    item.quantidade--;
  } else {
    cart.removeFromCart(index);
  }
}

function voltar() {
  router.push("/"); 
}

function comprar() {
  alert("Compra finalizada com sucesso! 🛒");
  cart.clearCart();
  router.push("/");
}
</script>

<style scoped>
@import "../css/paginaCarrinho/carrinho.css";

</style>
