import client from './client.js'

export async function initializePayment(orderId, email, amount) {
  const { data } = await client.post('/payment/initialize', {
    orderId,
    email,
    amount,
  })
  return {
    authorizationUrl: data.authorization_url,
    reference: data.reference,
  }
}

export async function verifyPayment(reference) {
  const { data } = await client.get(`/payment/verify/${reference}`)
  return data.order
}
