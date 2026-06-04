import client from './client.js'

export async function getWishlist() {
  const { data } = await client.get('/wishlist')
  return data.items
}

export async function addToWishlist(productId) {
  const { data } = await client.post('/wishlist', { product_id: productId })
  return data
}

export async function removeFromWishlist(productId) {
  await client.delete(`/wishlist/${productId}`)
}
