
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // lista de produtos no carrinho
  }),

  actions: {
    addToCart(product) {
      // procura se o produto já está no carrinho
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        // se já existe, aumenta a quantidade
        existingItem.quantidade++
      } else {
        // se não existe, adiciona como novo
        this.items.push({
          ...product,
          quantidade: 1
        })
      }
    },

    removeFromCart(index) {
      this.items.splice(index, 1)
    },

    clearCart() {
      this.items = []
    },
  },

  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantidade, 0),
    subtotal: (state) => state.items.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
  },
})