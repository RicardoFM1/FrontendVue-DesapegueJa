import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantidade++
      } else {
        this.items.push({
          ...product,
          quantidade: 1,
        })
      }
    },

    removeFromCart(index) {
      this.items.splice(index, 1)
    },

    clearCart() {
      this.items = []
    },

    updateQuantity(id, quantidade) {
      const item = this.items.find(item => item.id === id)
      if (item) item.quantidade = quantidade
    },
  },

  getters: {
    totalItems: (state) =>
      state.items.reduce((acc, item) => acc + item.quantidade, 0),

    subtotal: (state) =>
      state.items.reduce((acc, item) => acc + item.valor * item.quantidade, 0),
  },
})
