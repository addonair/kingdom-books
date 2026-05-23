import client from './client.js'

// Public homepage CMS fetch. Returns the full response object so callers can
// read both `sections` (per-section content) and `settings` (announcement bar
// + other site-wide homepage flags). No auth required — the request
// interceptor attaches a user token if present but the backend route is
// anonymous-friendly.
//
// Shape:
//   {
//     sections: [{ id, section_key, title, subtitle, body_text,
//                  background_color, text_color, is_visible, display_order,
//                  content }, ...],
//     settings: { announcement_text, announcement_color,
//                 announcement_visible, ... }
//   }
export async function getHomepage() {
  const { data } = await client.get('/homepage')
  return data
}
