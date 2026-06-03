import client from './client.js'

/**
 * Parse a typed shopping list via Claude and return product matches.
 * @param {string} text - Raw shopping list text
 * @returns {Promise<{ matched: object[], unmatched: object[] }>}
 */
export async function parseTextList(text) {
  const { data } = await client.post('/shop-smart/text', { text })
  return data
}

/**
 * Parse a photo of a shopping list via Claude and return product matches.
 * @param {File} imageFile - Image File from an <input type="file"> or drag-drop
 * @returns {Promise<{ matched: object[], unmatched: object[] }>}
 */
export async function parseImageList(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)
  // Do not override Content-Type — Axios auto-sets multipart/form-data with boundary
  const { data } = await client.post('/shop-smart/image', formData)
  return data
}
