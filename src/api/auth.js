import client from './client.js'

export async function register(name, email, password) {
  const { data } = await client.post('/auth/register', { name, email, password })
  return data
}

export async function login(email, password) {
  const { data } = await client.post('/auth/login', { email, password })
  return data
}

export async function getMe() {
  const { data } = await client.get('/auth/me')
  return data.user
}

export async function forgotPassword(email) {
  const { data } = await client.post('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(token, password) {
  const { data } = await client.post('/auth/reset-password', { token, password })
  return data
}
