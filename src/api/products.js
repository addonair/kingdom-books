import client from './client.js'

export async function getProducts(filters = {}) {
  const params = {}
  if (filters.mainCategory) params.mainCategory = filters.mainCategory
  if (filters.subCategory) params.subCategory = filters.subCategory
  if (filters.itemType) params.itemType = filters.itemType
  if (filters.category) params.category = filters.category
  if (filters.author) params.author = filters.author
  if (filters.brand) params.brand = filters.brand
  if (filters.format) params.format = filters.format
  if (filters.condition) params.condition = filters.condition
  if (filters.minPrice != null) params.minPrice = filters.minPrice
  if (filters.maxPrice != null) params.maxPrice = filters.maxPrice
  if (filters.search) params.search = filters.search
  const { data } = await client.get('/products', { params })
  return data.products
}

export async function getProduct(id) {
  const { data } = await client.get(`/products/${id}`)
  return data.product
}
