import client from './client.js'

export async function getCart() {
  const { data } = await client.get('/cart')
  return data.items
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await client.post('/cart', {
    product_id: productId,
    quantity,
  })
  return data.item
}

export async function removeFromCart(itemId) {
  await client.delete(`/cart/${itemId}`)
}

export async function updateQuantity(itemId, quantity) {
  const { data } = await client.patch(`/cart/${itemId}`, { quantity })
  return data.item
}
