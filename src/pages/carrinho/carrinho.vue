<template>
  <div class="cart-container">
    <div class="cart-items">
      <div class="cart-item" v-for="(item, index) in cartItems" :key="index">
        <img :src="item.image" alt="item.name" />
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p>Categoria</p>
          <p>R$ {{ item.price.toFixed(2) }}</p>
        </div>
        <div class="item-actions">
          <select v-model.number="item.quantity">
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
          <button @click="removeItem(index)">🗑️</button>
        </div>
      </div>
    </div>

    <div class="summary">
      <h2>Resumo da Compra</h2>
      <div>
        <span>Subtotal</span>
        <span>R$ {{ subtotal.toFixed(2) }}</span>
      </div>
      <div>
        <span>Frete</span>
        <span>R$ {{ shipping.toFixed(2) }}</span>
      </div>
      <div>
        <span>Taxa</span>
        <span>R$ {{ tax.toFixed(2) }}</span>
      </div>
      <div style="font-weight: bold;">
        <span>Total</span>
        <span>R$ {{ total.toFixed(2) }}</span>
      </div>
      <button>Comprar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cart",
  data() {
    return {
      cartItems: [
        {
          name: "Retroescavadeira",
          price: 290,
          quantity: 3,
          image: "https://i.imgur.com/q8H0YHc.png", // substitua pelo seu link ou arquivo local
        },
        {
          name: "Camisa internacional",
          price: 390,
          quantity: 1,
          image: "https://i.imgur.com/0xX6u5R.png", // substitua pelo seu link ou arquivo local
        },
      ],
      shipping: 10,
      tax: 8.32,
    };
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    total() {
      return this.subtotal + this.shipping + this.tax;
    },
  },
  methods: {
    removeItem(index) {
      this.cartItems.splice(index, 1);
    },
  },
};
</script>

<style src="../css/paginaCarrinho/carrinho.css"></style>  