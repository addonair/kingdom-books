import client from './client.js'

export async function createOrder(
  deliveryAddress,
  paymentMethod,
  paymentReference,
  promoCode = null,
  { customerName, customerPhone, customerEmail, deliveryType } = {}
) {
  const body = {
    delivery_address: deliveryAddress,
    payment_method: paymentMethod,
    payment_reference: paymentReference,
    delivery_type: deliveryType || 'home',
  }
  if (promoCode) body.promo_code = promoCode
  if (customerName)  body.customer_name  = customerName
  if (customerPhone) body.customer_phone = customerPhone
  if (customerEmail) body.customer_email = customerEmail
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
