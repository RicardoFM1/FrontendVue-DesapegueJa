<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/components/stores/cart'

const cart = useCartStore()
import { useRouter } from "vue-router";

const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

onMounted(async () => {
  
  if (!tokenExiste.value) {
     router.push("/");
  }});

const cartItems = computed(() => cart.items)
const subtotal = computed(() => cart.subtotal)
const totalItems = computed(() => cart.totalItems)

function removeItem(index) {
  cart.removeFromCart(index)
}
</script>

<template>
  <div class="cart-container">
    <div class="cart-items">
      <div
        class="cart-item"
        v-for="(item, index) in cartItems"
        :key="item.id"
      >
        <img :src="item.image" alt="item.produto" />
        <div class="item-details">
          <h3>{{ item.produto }}</h3>
          <p>R$ {{ item.valor.toFixed(2) }}</p>
        </div>
        <div class="item-actions">
          <select v-model.number="item.quantidade">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
          <button
          @click="removeItem(index)"><v-icon>mdi-delete</v-icon></button>
        </div>
      </div>
    </div>
    </div>
    </template>