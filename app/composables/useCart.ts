import type { SafeProduct } from "~/../types"

interface CartItem {
  product: SafeProduct
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const state = reactive<CartState>({
  items: []
})

export default function useCart() {
  const { showMessage } = useStore()

  if (import.meta.client) {
    const stored = getLocalStorageData<CartState>("cart-storage-youtube")
    if (stored?.items) {
      state.items = stored.items
    }
  }

  const items = toRefs(state).items

  const quantity = computed(() =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  )

  const total = computed(() =>
    state.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    )
  )

  // 💡 persist helper
  const persist = () => {
    if (import.meta.client) {
      setLocalStorageData("cart-storage-youtube", state)
    }
  }

  // ➕ Add item
  const addItem = (product: SafeProduct) => {
    const existingItem = state.items.find(
      (item) => item.product.id === product.id
    )

    if (existingItem) {
      existingItem.quantity++
      persist()

      showMessage({
        title: "Product quantity updated",
        variant: "info"
      })
      return
    }

    state.items.push({
      product,
      quantity: 1
    })

    persist()

    showMessage({
      title: "Product added to cart",
      variant: "success"
    })
  }

  // ➖ Remove single item
  const removeItem = (id: string) => {
    state.items = state.items.filter(
      (item) => item.product.id !== id
    )

    persist()

    showMessage({
      title: "Product removed from cart",
      variant: "warning"
    })
  }

  // 🧹 Clear cart
  const clearCart = () => {
    state.items = []

    if (import.meta.client) {
      localStorage.removeItem("cart-storage-youtube")
    }

    showMessage({
      title: "Cart cleared",
      variant: "default"
    })
  }

  // 🔄 Update quantity
  const updateQuantity = (id: string, delta: number) => {
    const item = state.items.find((i) => i.product.id === id)
    if (item) {
      const newQuantity = item.quantity + delta
      if (newQuantity > 0) {
        item.quantity = newQuantity
        persist()
      } else {
        removeItem(id)
      }
    }
  }

  return {
    items,
    quantity,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
}