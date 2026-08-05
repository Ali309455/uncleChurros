export const cartSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const cartQuantity = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)

export const bulkDiscount = (items) => {
  const qty = cartQuantity(items)
  return qty >= 6 ? cartSubtotal(items) * 0.1 : 0
}

export const cartTotal = (items) => cartSubtotal(items) - bulkDiscount(items)

export const formatPrice = (value) => `$${value.toFixed(2)}`
