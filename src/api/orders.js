import client from './client.js'

export async function createOrder(deliveryAddress, paymentMethod, paymentReference, promoCode = null) {
  const body = {
    delivery_address: deliveryAddress,
    payment_method: paymentMethod,
    payment_reference: paymentReference,
  }
  if (promoCode) body.promo_code = promoCode
  const { data } = await client.post('/orders', body)
  return data.order
}

export async function getOrders() {
  const { data } = await client.get('/orders')
  return data.orders
}

export async function getOrder(id) {
  const { data } = await client.get(`/orders/${id}`)
  return data.order
}

export async function cancelOrder(id) {
  const { data } = await client.patch(`/orders/${id}/cancel`)
  return data.order
}
