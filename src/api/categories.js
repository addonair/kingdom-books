import client from './client.js'

// Fetch categories from the backend. When `parentId` is provided it is
// passed through as the `parent_id` query parameter so the API returns the
// children of that category; otherwise the top-level categories are
// returned. The backend may respond as either a bare array or
// `{ categories: [...] }` — both shapes are handled.
export async function getCategories(parentId) {
  // axios serialises `params` into the URL query string; this is a GET so
  // there is no request body. The resulting URL is e.g.
  //   http://localhost:5000/api/categories?parent_id=1
  const config = parentId != null ? { params: { parent_id: parentId } } : undefined
  console.log(
    `[api/categories] GET /categories${
      parentId != null ? `?parent_id=${parentId}` : ''
    }`,
  )
  const { data } = await client.get('/categories', config)
  console.log('[api/categories] raw response data →', data)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.categories)) return data.categories
  return []
}

// Backwards-compatible alias for callers that still import the explicit
// "by parent" form.
export const getCategoriesByParent = (parentId) => getCategories(parentId)
