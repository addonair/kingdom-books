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

// If the backend reports the user is suspended mid-session, wipe the local
// token and bounce to the login page with a flag so the page can show a
// friendly banner. Only triggers on 403 with the exact "Account suspended" reason.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const reason = err?.response?.data?.error || ''
    if (status === 403 && /suspended/i.test(reason) && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY)
      // Avoid redirecting if we're already on the login page (prevents loop).
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.replace('/login?suspended=1')
      }
    }
    return Promise.reject(err)
  },
)

export const adminClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
adminClient.interceptors.request.use((config) => attachToken(config, getAdminToken()))

export default client
