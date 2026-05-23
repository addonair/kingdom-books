import client from './client.js'

export async function applyPromoCode(code) {
  const { data } = await client.post('/promotions/validate', { code })
  return data
}
