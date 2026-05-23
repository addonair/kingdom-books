import axios from 'axios'

export const TOKEN_KEY = 'kb_token'
export const ADMIN_TOKEN_KEY = 'kb_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function attachToken(config, token) {
  if (!token) return config
  if (config.headers && typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`)
  } else {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
  }
  return config
}

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
client.interceptors.request.use((config) => attachToken(config, getToken()))

export const adminClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
adminClient.interceptors.request.use((config) => attachToken(config, getAdminToken()))

export default client
