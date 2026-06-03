import client from './client.js'

// Public endpoint — no auth required. Returns branding + delivery settings.
export async function getPublicSettings() {
  const { data } = await client.get('/settings')
  return data.settings || {}
}
