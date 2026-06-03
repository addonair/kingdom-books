import { adminClient } from './client.js'

const client = adminClient

export async function adminLogin(email, password) {
  const { data } = await adminClient.post('/auth/login', { email, password })
  return data
}

export async function adminGetMe() {
  const { data } = await adminClient.get('/auth/me')
  return data.user
}

export async function getStats() {
  const { data } = await client.get('/admin/stats')
  return data.stats
}

export async function getRecentOrders() {
  const { data } = await client.get('/admin/orders/recent')
  return data.orders
}

export async function getAllOrders(status) {
  const params = status && status !== 'all' ? { status } : {}
  const { data } = await client.get('/admin/orders', { params })
  return data.orders
}

export async function getAdminOrder(id) {
  const { data } = await client.get(`/admin/orders/${id}`)
  return data.order
}

export async function updateOrderStatus(id, status) {
  const { data } = await client.patch(`/admin/orders/${id}/status`, { status })
  return data.order
}

export async function deleteAdminOrder(id) {
  const { data } = await client.delete(`/admin/orders/${id}`)
  return data
}

export async function getAdminProducts(params) {
  const { data } = await client.get('/admin/products', { params })
  return data.products
}

export async function getTopSellingProducts() {
  const { data } = await client.get('/admin/products/top-selling')
  return data.products
}

// Accepts either a plain object (JSON) or a FormData (multipart). When the
// payload is FormData we override the default JSON Content-Type so axios sets
// the correct multipart boundary itself. The optional config is forwarded to
// axios — callers pass `onUploadProgress` here to drive a progress UI.
function productRequestConfig(payload, config) {
  if (!(payload instanceof FormData)) return config
  return {
    ...config,
    headers: {
      ...(config?.headers || {}),
      'Content-Type': 'multipart/form-data',
    },
  }
}

export async function createProduct(payload, config = {}) {
  const { data } = await client.post(
    '/admin/products',
    payload,
    productRequestConfig(payload, config),
  )
  return data.product
}

export async function updateProduct(id, payload, config = {}) {
  const { data } = await client.put(
    `/admin/products/${id}`,
    payload,
    productRequestConfig(payload, config),
  )
  return data.product
}

export async function deleteProduct(id) {
  const { data } = await client.delete(`/admin/products/${id}`)
  return data
}

// Customers
export async function getCustomers() {
  const { data } = await client.get('/admin/customers')
  return data.customers
}

export async function setCustomerRole(id, role) {
  const { data } = await client.patch(`/admin/customers/${id}/role`, { role })
  return data.user
}

export async function setCustomerSuspended(id, suspended) {
  const { data } = await client.patch(`/admin/customers/${id}/suspend`, { suspended })
  return data.user
}

export async function deleteCustomer(id) {
  const { data } = await client.delete(`/admin/customers/${id}`)
  return data
}

// The categories endpoint returns a nested tree: top-level rows each carry
// a `children` array of subcategories, which in turn nest grandchildren.
// Every consumer here expects a flat list with `parent_id` set, so we walk
// the tree once and emit a flat array. Defensive against either shape:
// if the API ever flips to flat, the recursion is a no-op.
function flattenCategoryTree(rows, parentId = null, out = []) {
  if (!Array.isArray(rows)) return out
  for (const r of rows) {
    if (!r) continue
    const { children, ...rest } = r
    const pid =
      rest.parent_id ?? rest.parentId ?? (rest.parent && rest.parent.id) ?? parentId
    out.push({ ...rest, parent_id: pid == null ? null : Number(pid) })
    if (Array.isArray(children) && children.length > 0) {
      flattenCategoryTree(children, Number(r.id), out)
    }
  }
  return out
}

// Categories
export async function getCategories(params) {
  const { data } = await client.get('/admin/categories', { params })
  return flattenCategoryTree(data?.categories)
}

export async function createCategory(payload) {
  const { data } = await client.post('/admin/categories', payload)
  return data.category
}

export async function updateCategory(id, payload) {
  const { data } = await client.put(`/admin/categories/${id}`, payload)
  return data.category
}

export async function deleteCategory(id) {
  const { data } = await client.delete(`/admin/categories/${id}`)
  return data
}

// Promotions
export async function getPromotions() {
  const { data } = await client.get('/admin/promotions')
  return data.promotions
}

export async function createPromotion(payload) {
  const { data } = await client.post('/admin/promotions', payload)
  return data.promotion
}

// Reports
export async function getReports(range) {
  const { data } = await client.get('/admin/reports', { params: { range } })
  return data
}

// Settings
export async function getSettings() {
  const { data } = await client.get('/admin/settings')
  return data.settings
}

export async function updateSettings(payload) {
  const { data } = await client.put('/admin/settings', payload)
  return data.settings
}

export async function changeAdminPassword(payload) {
  const { data } = await client.put('/admin/settings/password', payload)
  return data
}

// Homepage CMS — drives the public homepage's editable sections + the
// site-wide homepage settings (announcement bar).
// `updateHomepageSection` shares the FormData branch with createProduct/updateProduct
// via `productRequestConfig` so the hero section's image uploads ride the same
// multipart-boundary path as product images.
export async function getAdminHomepage() {
  const { data } = await client.get('/admin/homepage')
  return data
}

// Sections are addressed by their stable `section_key` (hero, bestsellers,
// categories, features, about) rather than the row id so the admin URL stays
// readable even if the DB row is recreated.
export async function updateHomepageSection(sectionKey, payload, config = {}) {
  const { data } = await client.put(
    `/admin/homepage/sections/by-key/${sectionKey}`,
    payload,
    productRequestConfig(payload, config),
  )
  return data.section
}

// Body is the raw array `[{ id, display_order }, ...]` — the backend reorder
// route expects positional rows keyed by primary id, not by section_key.
export async function reorderHomepageSections(order) {
  const { data } = await client.patch('/admin/homepage/sections/reorder', order)
  return data
}

// Announcement bar + other site-wide homepage flags live in `homepage_settings`,
// not in `homepage_sections`, so they use a different endpoint.
export async function updateHomepageSettings(payload) {
  const { data } = await client.put('/admin/homepage/settings', payload)
  return data.settings
}

// Email
export async function emailCustomer(orderId, subject, message) {
  const { data } = await client.post(`/admin/orders/${orderId}/email`, { subject, message })
  return data
}

export async function getEmailTemplates() {
  const { data } = await client.get('/admin/email-templates')
  return data.templates
}

export async function updateEmailTemplate(type, payload) {
  const { data } = await client.put(`/admin/email-templates/${type}`, payload)
  return data.template
}
