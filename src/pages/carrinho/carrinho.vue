<template>
  <div class="cart-container">
    <div class="cart-items">
      <div
        class="cart-item"
        v-for="(item, index) in cartItems"
        :key="item.id"
      >
        <img :src="item.image" :alt="item.produto" />

        <div class="item-details">
          <h3>{{ item.produto }}</h3>
          <p>R$ {{ item.valor.toFixed(2) }}</p>
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

    <div class="cart-summary" v-if="cartItems.length">
      <p><strong>Total de itens:</strong> {{ totalItems }}</p>
      <p><strong>Subtotal:</strong> R$ {{ subtotal.toFixed(2) }}</p>
    </div>

    <div v-else class="empty-cart">
      <p>Seu carrinho está vazio 😢</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart' // ✅ ajuste o caminho se necessário

const cart = useCartStore()

const cartItems = computed(() => cart.items)
const subtotal = computed(() => cart.subtotal)
const totalItems = computed(() => cart.totalItems)

function removeItem(index) {
  cart.removeFromCart(index)
}
</script>

<style>
@import "../css/paginaCarrinho/carrinho.css";
</style>
