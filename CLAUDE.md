# CLAUDE.md — Kingdom Books

Onboarding reference for working in this repo. Update it when the structure or conventions below change.

## 1. Overview

Kingdom Books & Stationery is an e-commerce front end for a bookstore. It serves a public storefront (browse, cart, checkout, payment callback, account/orders) and a role-gated admin dashboard (products, orders, customers, categories, promotions, reports, settings).

**Stack**

| Layer | Choice | Version |
|------|--------|---------|
| Framework | React | 19.2.5 |
| Bundler | Vite | 8.0.10 |
| Routing | react-router-dom | 7.14.2 |
| HTTP | axios | 1.15.2 |
| Styling | Tailwind CSS | 3.4.19 |
| Charts | recharts | 3.8.1 |
| Icons | react-icons | 5.6.0 |
| Lint | eslint flat config + react-hooks + react-refresh | 10.x |

**Backend assumption:** REST API at `http://localhost:5000/api` (hardcoded — see Gotchas).

**Scripts**

```
npm run dev      # Vite dev server
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview built bundle
```

## 2. Project structure

```
kingdom-books/
├── index.html              # Loads /src/main.jsx; Google Fonts (DM Sans, DM Serif Display)
├── package.json
├── vite.config.js          # Vite + @vitejs/plugin-react
├── tailwind.config.js      # Brand tokens, fonts (see §6)
├── postcss.config.js
├── eslint.config.js        # Flat config
├── public/                 # Static assets
├── screen shots/           # Manual QA screenshots
└── src/
    ├── main.jsx            # Entry: BrowserRouter > AuthProvider > CartProvider > <App />
    ├── App.jsx             # All <Route> definitions (see §3)
    ├── index.css           # Tailwind directives + base styles
    ├── api/                # Axios client + per-domain modules (see §5)
    ├── components/         # Reusable UI (see §7)
    ├── context/            # AuthContext, CartContext (see §4)
    ├── data/               # Static fallback data
    ├── layouts/            # MainLayout (public)
    ├── pages/              # Public pages (12) + admin/ subfolder (10)
    └── design-reference/   # Non-functional design canvas + Figma exports
```

### File-by-file map for `src/`

**src/api/** — Axios client + per-domain modules. See §5 for endpoints.

| File | Purpose |
|------|---------|
| `client.js` | Axios instance; `Authorization: Bearer ${kb_token}` interceptor; logs requests + headers |
| `auth.js` | `register`, `login`, `getMe` |
| `products.js` | `getProducts(filters)`, `getProduct(id)` |
| `cart.js` | `getCart`, `addToCart`, `removeFromCart` |
| `orders.js` | `createOrder`, `getOrders`, `getOrder` |
| `categories.js` | `getCategories` (may 404 — fall back to `data/categories.js`) |
| `payment.js` | `initializePayment`, `verifyPayment` |
| `homepage.js` | Public `getHomepage()` — reads the CMS-driven homepage section list |
| `admin.js` | All `/admin/*` endpoints (stats, orders, products, customers, categories, promotions, reports, settings, **homepage CMS**) |
| `productMapper.js` | Backend → UI shape transform; helpers: `mapProduct`, `mapProducts`, `categorySlugForName`, `deriveShape` |

**src/components/**

| File | Purpose |
|------|---------|
| `Modal.jsx` | Generic dialog with Esc-close + scrim |
| `Navbar.jsx` | Header with Books/Stationery mega menus, cart badge, account dropdown |
| `MobileBottomNav.jsx` | Mobile fixed bottom tabs (Home, Search, Orders, Account) |
| `RequireAdmin.jsx` | Route guard — redirects non-admins to `/admin/login`, renders `<Outlet />` |
| `Footer.jsx` | Desktop-only footer (copyright + Privacy/Terms/Contact) |
| `homepage/` | Five presentational section components (`AnnouncementBarSection`, `HeroSection`, `CategoriesSection`, `BestsellersSection`, `FeaturesSection`) shared by the public `HomePage` and the admin live preview. (`AboutSection` was removed — about page copy now lives on the dedicated `/about` route, not the homepage.) |

**src/context/**

| File | Purpose |
|------|---------|
| `AuthContext.jsx` | Global auth state + `useAuth()` hook |
| `CartContext.jsx` | Global cart state + `useCart()` hook (server-synced when authenticated) |

**src/data/** — static fallback used when backend endpoints are unavailable.

| File | Purpose |
|------|---------|
| `categories.js` | `CATEGORY_TREE` (3-level), `POPULAR_AUTHORS`, `STATIONERY_BRANDS`, `CONDITIONS`, `PRICE_MIN/MAX`, helpers |
| `products.js` | Seed product array + `categories`, `subcatsByCat`, `formats`, `conditions`, `sortOptions`, `getProductById(id)` |

**src/layouts/**

| File | Purpose |
|------|---------|
| `MainLayout.jsx` | Public shell: sticky `<Navbar>` + `<Outlet />` + `<Footer>` + `<MobileBottomNav>` (announcement bar is now a homepage-only CMS section, no longer site-wide) |
| `AdminLayout.jsx` | Sidebar + nav + outlet shell for the admin section |

**src/pages/** (public — 12 pages, all use `MainLayout`)

| File | Purpose |
|------|---------|
| `HomePage.jsx` | Renders hardcoded sections (announcement, hero, categories, bestsellers, features, about) immediately on mount — no skeleton, no blank state. `GET /api/homepage` runs in `useEffect` as a non-breaking overlay: when it succeeds, individual API fields override the hardcoded values via optional chaining; when it fails, returns empty, or hangs, the page keeps rendering from hardcoded content. Format strip + featured trio are hardcoded between sections (not CMS-editable). |
| `ShopPage.jsx` | Filterable product grid (category, subcategory, item type, author, brand, condition, price, search) |
| `ProductPage.jsx` | Product detail; specs, format selector, related products, placeholder reviews |
| `CartPage.jsx` | Line items, qty controls, delivery fee calc, checkout CTA |
| `CheckoutPage.jsx` | Delivery → payment → confirm; creates order then initializes payment. Delivery step has two modes: **Home/Community** (house no, street, community, city, Ghana Post GPS code — all three required fields; Google Maps preview iframe + Open-in-Maps link; GPS code finder link to ghanapostgps.com) and **Store Pickup** (info card from `src/config/delivery.js` with address, GPS, hours, Google Maps link). |
| `PaymentVerifyPage.jsx` | Payment callback; auto-redirects to `/orders` on success |
| `OrdersPage.jsx` | User's order history with status badges |
| `OrderDetailPage.jsx` | Full order detail view at `/orders/:id` — order header (ref, date, status), visual status timeline (3-step: Placed → Processing → Delivered; cancelled state shown separately in red), items list with colour-swatch thumbnails, delivery info (auto-detects pickup vs home), payment info, order total. Cancel button visible for `pending`/`processing` orders — triggers a confirmation modal; calls `PATCH /orders/:id/cancel` and updates status in place. |
| `AccountPage.jsx` | Profile header + menu rows (Orders, Wishlist, Settings, Logout) |
| `LoginPage.jsx` | Email + password login |
| `ForgotPasswordPage.jsx` | Email form → `POST /auth/forgot-password`; always shows success state to avoid leaking whether an email is registered |
| `RegisterPage.jsx` | Name, email, password, confirm |
| `AboutPage.jsx` | Static brand story |
| `ContactPage.jsx` | Contact form + contact info cards |

**src/pages/admin/** (10 files; all but `AdminLoginPage` are guarded by `RequireAdmin` → wrapped in `AdminLayout` from `src/layouts/`)

| File | Purpose |
|------|---------|
| `AdminLoginPage.jsx` | Admin login (validates `role === 'admin'`) |
| `AdminDashboardPage.jsx` | Stat cards, recent orders, top products |
| `AdminHomepagePage.jsx` | Homepage CMS editor: tabbed editor + live scaled-DOM preview (desktop/mobile), drag-to-reorder section strip with visibility toggles, per-section save with toast feedback |
| `AdminProductsPage.jsx` | CRUD products via modal forms |
| `AdminOrdersPage.jsx` | Status tabs (all/pending/processing/delivered) + inline status updates |
| `AdminCustomersPage.jsx` | Role assignment + suspend/unsuspend toggle |
| `AdminCategoriesPage.jsx` | CRUD categories |
| `AdminPromotionsPage.jsx` | List + create promotion codes |
| `AdminReportsPage.jsx` | Recharts bar/pie analytics |
| `AdminSettingsPage.jsx` | Store settings + admin password change |
| `AdminDeliveryPage.jsx` | Delivery CMS: fees + pickup point editor with live checkout preview (split-pane, same pattern as Homepage) |

**src/design-reference/** — design canvas + Figma exports + screen mockups. Non-functional; safe to ignore at build time.

## 3. Routes

```
/                                  MainLayout (Navbar + Footer + MobileBottomNav)
├── (index)                        HomePage
├── /shop                          ShopPage           ← ?mainCategory, ?subCategory, ?itemType, ?author, ?filter
├── /product/:id                   ProductPage
├── /login, /register              LoginPage, RegisterPage
├── /forgot-password               ForgotPasswordPage
├── /about, /contact               AboutPage, ContactPage
├── /cart, /checkout               CartPage, CheckoutPage
├── /checkout/verify               PaymentVerifyPage  ← payment callback
├── /orders, /account              OrdersPage, AccountPage

/admin/login                       AdminLoginPage     (no layout, public)

/admin                             RequireAdmin > AdminLayout
├── (index)                        AdminDashboardPage
├── /admin/homepage                AdminHomepagePage
├── /admin/products                AdminProductsPage
├── /admin/orders                  AdminOrdersPage
├── /admin/customers               AdminCustomersPage
├── /admin/categories              AdminCategoriesPage
├── /admin/promotions              AdminPromotionsPage
├── /admin/reports                 AdminReportsPage
├── /admin/settings                AdminSettingsPage
└── /admin/delivery                AdminDeliveryPage
```

`RequireAdmin` (`src/components/RequireAdmin.jsx`) checks `useAuth().user?.role === 'admin'` and redirects to `/admin/login` otherwise.

There is a 404 catch-all (`NotFoundPage` in `App.jsx`) for unknown paths inside the public layout.

## 4. Context providers

Both providers are mounted in `src/main.jsx` (AuthProvider outside CartProvider so cart can read user).

### AuthContext (`src/context/AuthContext.jsx`)

| Field | Type / Signature |
|-------|------------------|
| `user` | `object \| null` |
| `loading` | `boolean` (true during initial token check) |
| `login(email, password)` | async → `user` |
| `register(name, email, password)` | async → `user` |
| `logout()` | void |

- Hook: `useAuth()` (throws outside `<AuthProvider>`)
- Token persistence: `localStorage.kb_token` (key exported as `TOKEN_KEY` from `src/api/client.js`)
- User object: in-memory only (rehydrated via `authApi.getMe()` on mount when token exists; clears token on failure)

### CartContext (`src/context/CartContext.jsx`)

| Field | Type / Signature |
|-------|------------------|
| `items` | `Array<{ id, serverId?, productId, title, brand, price, format, color, qty }>` |
| `cartCount` | `number` (sum of `qty`) |
| `subtotal` | `number` (sum of `price * qty`) |
| `addToCart(product, qty?)` | async — optimistic local update + server sync if authenticated |
| `removeFromCart(id)` | async — server first when authenticated, then local |
| `updateQuantity(id, newQty)` | async — `qty < 1` delegates to `removeFromCart`; otherwise removes + re-adds (no PATCH; see Gotchas) |
| `clearCart()` | void — local-only (used after order completion) |

- Hook: `useCart()` (throws outside `<CartProvider>`)
- Persistence: server-backed when `user` exists; in-memory only when logged out (cleared on logout)
- On `user` change, refetches cart from `cartApi.getCart()` and rehydrates `items`

## 5. API layer (`src/api/`)

`client.js` exports an axios instance with:

- `baseURL: 'http://localhost:5000/api'` (hardcoded)
- Default header `Content-Type: application/json`
- Request interceptor reads `localStorage.kb_token` and sets `Authorization: Bearer <token>`
- Token key exported as `TOKEN_KEY = 'kb_token'`; helper `getToken()`
- No debug logging (console.log calls were removed — see §8)

### Endpoints

**auth.js**

| Function | Method + Path | Payload | Returns |
|---|---|---|---|
| `register(name, email, password)` | POST `/auth/register` | `{name, email, password}` | `{token, user}` |
| `login(email, password)` | POST `/auth/login` | `{email, password}` | `{token, user}` |
| `getMe()` | GET `/auth/me` | — | `user` |
| `forgotPassword(email)` | POST `/auth/forgot-password` | `{email}` | `{}` |

**products.js**

| Function | Method + Path | Params | Returns |
|---|---|---|---|
| `getProducts(filters)` | GET `/products` | `mainCategory, subCategory, itemType, category, author, brand, format, condition, minPrice, maxPrice, search` | `products[]` |
| `getProduct(id)` | GET `/products/:id` | — | `product` |

**cart.js**

| Function | Method + Path | Payload | Returns |
|---|---|---|---|
| `getCart()` | GET `/cart` | — | `items[]` |
| `addToCart(productId, qty=1)` | POST `/cart` | `{product_id, quantity}` | `item` |
| `removeFromCart(itemId)` | DELETE `/cart/:itemId` | — | — |
| `updateQuantity(itemId, quantity)` | PATCH `/cart/:itemId` | `{quantity}` | `item` (with remove+re-add fallback on 404/405) |

**orders.js**

| Function | Method + Path | Payload | Returns |
|---|---|---|---|
| `createOrder(deliveryAddress, paymentMethod, paymentReference)` | POST `/orders` | `{delivery_address, payment_method, payment_reference}` | `order` |
| `getOrders()` | GET `/orders` | — | `orders[]` |
| `getOrder(id)` | GET `/orders/:id` | — | `order` |

**payment.js**

| Function | Method + Path | Payload | Returns |
|---|---|---|---|
| `initializePayment(orderId, email, amount)` | POST `/payment/initialize` | `{orderId, email, amount}` | `{authorizationUrl, reference}` |
| `verifyPayment(reference)` | GET `/payment/verify/:reference` | — | `order` |

**categories.js**

| Function | Method + Path | Returns |
|---|---|---|
| `getCategories()` | GET `/categories` | `categories[]` (may not be live; callers fall back to `src/data/categories.js`) |

**admin.js** (all under `/admin/*`, require admin token)

| Function | Method + Path | Notes |
|---|---|---|
| `getStats()` | GET `/admin/stats` | dashboard cards |
| `getRecentOrders()` | GET `/admin/orders/recent` | |
| `getAllOrders(status)` | GET `/admin/orders?status=` | |
| `updateOrderStatus(id, status)` | PATCH `/admin/orders/:id/status` | `{status}` |
| `getAdminProducts()` | GET `/admin/products` | |
| `getTopSellingProducts()` | GET `/admin/products/top-selling` | |
| `createProduct(payload, config?)` | POST `/admin/products` | Accepts `FormData` (multipart) or plain object. `config.onUploadProgress` forwarded to axios. |
| `updateProduct(id, payload, config?)` | PUT `/admin/products/:id` | Same dual-mode signature. PUT multipart accepts repeated `existing_images[]` (URLs to keep) + repeated `images` (new files). |
| `deleteProduct(id)` | DELETE `/admin/products/:id` | |
| `getCustomers()` | GET `/admin/customers` | |
| `setCustomerRole(id, role)` | PATCH `/admin/customers/:id/role` | `{role}` |
| `setCustomerSuspended(id, suspended)` | PATCH `/admin/customers/:id/suspend` | `{suspended}` |
| `getCategories()` | GET `/admin/categories` | |
| `createCategory(payload)` | POST `/admin/categories` | |
| `updateCategory(id, payload)` | PUT `/admin/categories/:id` | |
| `deleteCategory(id)` | DELETE `/admin/categories/:id` | |
| `getPromotions()` | GET `/admin/promotions` | |
| `createPromotion(payload)` | POST `/admin/promotions` | |
| `getReports(range)` | GET `/admin/reports?range=` | |
| `getSettings()` | GET `/admin/settings` | |
| `updateSettings(payload)` | PUT `/admin/settings` | |
| `changeAdminPassword(payload)` | PUT `/admin/settings/password` | |
| `getAdminHomepage()` | GET `/admin/homepage` | Admin-auth section list (same shape as public `getHomepage()`). |
| `updateHomepageSection(type, payload, config?)` | PUT `/admin/homepage/sections/:type` | Dual-mode: FormData for `hero` (image uploads via `existing_images[]` + `images`); JSON for the other five section types. Returns the updated section. |
| `reorderHomepageSections(order)` | PATCH `/admin/homepage/sections/reorder` | Body: `{ order: [{ type, display_order, is_visible }] }`. Used by the reorder strip + visibility toggle in `AdminHomepagePage`. |

**promotions.js** (public, no auth)

| Function | Method + Path | Payload | Returns |
|---|---|---|---|
| `applyPromoCode(code)` | POST `/promotions/validate` | `{code}` | `{discount_percent, ...}` |

**homepage.js** (public, no auth)

| Function | Method + Path | Returns |
|---|---|---|
| `getHomepage()` | GET `/homepage` | `sections[]` — each `{ type, is_visible, display_order, content }`. Six known types: `announcement_bar`, `hero`, `categories`, `bestsellers`, `features`, `about`. `HomePage.jsx` filters `is_visible:false` rows and sorts by `display_order`; falls back to a hardcoded section list when the request fails. |

**productMapper.js**

Pure transform (no HTTP). Backend product shape:
```
{ id, category_name, category_slug, title, author, brand, price, badge,
  item_type, format, condition, level, purpose, cover_color, description, stock,
  images: string[] }
```
`images` is an array of image sources (data-URLs or regular URLs) — `images[0]` is the primary image used on cards. UI shape adds: `section`, `category`, `categorySlug`, `itemType`, `authorName`, `brandName`, `oldPrice` (if `badge === 'Sale'`), `shape` (derived from title — `'calculator' | 'notebook' | 'ream' | 'tote' | 'markers' | 'pen' | 'book'`), passes `images` through, and reads `rating`, `reviewCount` (`p.review_count`), `edition`, `isbn`, `pages`, `language` from the backend row when present (defaults: `rating → null`, `reviewCount → 0`, others → `null`/`''`). Only `accent: '#fff'` remains hardcoded. Helpers: `mapProduct`, `mapProducts`, `categorySlugForName`, `deriveShape`.

## 6. Design system

### Brand tokens (`tailwind.config.js`)

| Token | Hex | Usage |
|------|-----|-------|
| `brand-navy` | `#001a36` | Primary text/UI |
| `brand-navy-deep` | `#000d1c` | Announcement bar, deepest accents |
| `brand-navy-soft` | `#002a5c` | Hover/depth states |
| `brand-gold` | `#C9920A` | CTAs, active indicators |
| `brand-gold-soft` | `#fffbf0` | Light tint |
| `brand-page` | `#F5F6FA` | Page background |
| `brand-line` | `#e8eaef` | Borders, dividers |
| `brand-muted` | `#9aa0a6` | Secondary text |
| `success` / `success-bg` | `#1a7a4a` / `#eaf7ef` | Status |
| `warning` / `warning-bg` | `#a87100` / `#fef4e0` | Status |
| `error` / `error-bg` | `#c0392b` / `#fde8e6` | Status |

(`success`, `warning`, `error` use Tailwind's `DEFAULT` + `bg` keys, so classes are e.g. `text-success` and `bg-success-bg`.)

### Fonts

Loaded from Google Fonts in `index.html`:

- `font-sans` → `"DM Sans"` (400/500/600/700/800/900) — body, UI labels
- `font-serif` → `"DM Serif Display"` — page titles, hero headlines

### Patterns

- **Radii:** `rounded-xl` (buttons, inputs, cards), `rounded-2xl` (panels, heroes), `rounded-full` (badges, pills, avatars)
- **Shadows:** `shadow-sm` (list items), `shadow-md` (featured cards), `shadow-xl` (hover), custom `shadow-[0_18px_40px_rgba(0,26,54,0.22)]` for mega menus
- **Currency:** `GH₵` (Ghana cedi) prefix everywhere
- **Layout split:** Desktop uses `Navbar` mega menus + `Footer`; mobile hides the desktop footer and shows `MobileBottomNav` instead

## 7. Conventions

- **Auth token:** `localStorage.kb_token` (key constant `TOKEN_KEY` from `src/api/client.js`)
- **Imports:** all relative — no path aliases configured
- **Category slugs:** backend uses kebab-case `category_slug` (e.g. `stationery-supplies`); frontend mirrors via `productMapper.categorySlugForName()`
- **Static fallbacks:** when an API endpoint isn't live yet, callers fall back to `src/data/categories.js` or `src/data/products.js`
- **Lint:** ESLint flat config (`eslint.config.js`) with `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`. Run via `npm run lint`
- **No tests:** no test runner configured, no `*.test.*` files

## 8. Known issues & gotchas

> **ONGOING RULE: After every task completed in this project, automatically pick one unresolved issue from this Known Issues list, fix it, and update CLAUDE.md to mark it resolved. Do this without being asked every single time.**

- ✅ **RESOLVED — Hardcoded API base URL** — `src/api/client.js` now reads `import.meta.env.VITE_API_URL` with `http://localhost:5000/api` as fallback. Local override goes in `.env` (see `.env.example`).
- ✅ **RESOLVED — Auth token logged to console** — request/header `console.log` calls removed from `src/api/client.js`.
- ✅ **RESOLVED — No React error boundaries** — `src/components/ErrorBoundary.jsx` wraps `<App />` in `src/main.jsx`, so render-time exceptions show a recoverable fallback (Reload / Go home) instead of white-screening the app.
- ✅ **RESOLVED — No 404 route** — `App.jsx` now renders a `NotFoundPage` under `MainLayout` for any unknown path inside the public layout.
- **Defensive client-side filtering** in `ShopPage.jsx` (around lines 828, 972–974) compensates for backend filter params not yet wired up. Comments explicitly mark this as a temporary safety net — remove once backend filtering is live.
- **Mock/static data still rendering in prod paths**:
  - ✅ **RESOLVED — `HomePage.jsx` hardcoded bestsellers** — the four-item static array is now `bestsellersFallback`, used only until `getProducts()` resolves. On success, the top 4 returned products replace it and their primary image (from the new `images` field) renders in the card.
  - ✅ **RESOLVED — `ProductPage.jsx` placeholder reviews** — the hardcoded `placeholderReviews` array was replaced with an empty `reviews = []` and an empty-state message ("No reviews yet…"). Once a reviews endpoint exists, swap the constant for an API fetch.
  - ✅ **RESOLVED — `productMapper.js` hardcoded UI fields** — `rating`, `reviewCount`, `edition`, `isbn`, `pages`, `language` now read from the backend row when present and fall back to `null`/`0` (no more fake `4.7` / `'N/A'` / `'English'` defaults). `ProductPage.jsx` shows "No reviews yet" instead of a fake star rating when `rating` is null, and renders `'N/A'` for any missing detail field.
- ✅ **RESOLVED (partial) — Cart API has no PATCH for quantity** — added `cartApi.updateQuantity(itemId, qty)` against `PATCH /cart/:itemId` and switched `CartContext.updateQuantity` to call it. If the backend route isn't live yet, a `404`/`405` triggers the original remove-then-re-add fallback so the UX keeps working until the route ships. Drop the fallback once the backend confirms the endpoint is stable.
- ✅ **RESOLVED (partial) — Hardcoded delivery rules** — moved `FREE_DELIVERY_THRESHOLD` and `DELIVERY_FEE` out of `CartPage.jsx` into `src/config/delivery.js`. Added `PICKUP_POINT` constant (name, address, GPS code, hours, description) so the store pickup card is also driven from one config file. Values are still hardcoded but there's a single import point so swapping to a backend-driven settings endpoint is a one-file change.
- **Category endpoint may 404** — `src/api/categories.js` calls `GET /categories` which the backend may not yet expose. Callers must fall back to the static `CATEGORY_TREE` in `src/data/categories.js`.
- ✅ **RESOLVED — `AdminLayout` location quirk** — `AdminLayout.jsx` has been moved to `src/layouts/` alongside `MainLayout.jsx`. The `App.jsx` import now reads `./layouts/AdminLayout`, and `src/pages/admin/` only holds page files.
- ✅ **RESOLVED — Stray screenshots in repo root** — `.gitignore` now ignores top-level `*.png/*.jpg/*.jpeg` and the `.playwright-mcp/` cache, so ad-hoc UI captures stop polluting `git status`. Curated assets still belong under `screen shots/`.
- ✅ **RESOLVED — Debug console.logs in CheckoutPage** — removed the three `[checkout]` `console.log` calls in `onPay()` (`createOrder OK`, `initializePayment payload`, `initializePayment OK`) that were leaking order and payment details to the browser console in production.
- **No tests** — no automated coverage of any kind; manual + screenshot QA only.
- **Homepage CMS task — no Known Issue auto-resolved** (2026-05-12). Every remaining unresolved entry above is blocked on backend changes (live `GET /categories`, removing the `ShopPage` defensive client-side filter once backend filters land, adding tests). The auto-resolve rule is deferred for this task only and resumes on the next one.
- **Delivery form overhaul** (2026-05-23) — campus pickup removed; replaced with **Home/Community Delivery** (community + city + Ghana Post GPS code all required; Google Maps live preview iframe + open-in-maps link) and **Store Pickup** (static info card). No DB change needed — delivery_address TEXT column stores a formatted string. No Known Issue auto-resolved this task; remaining issues are backend-blocked.
- **Order detail page + cancel** (2026-05-23) — built `OrderDetailPage.jsx` at `/orders/:id`; added `PATCH /orders/:id/cancel` backend route (customer can cancel `pending` or `processing` orders); added `cancelOrder(id)` to `src/api/orders.js`; registered route in `App.jsx`. No Known Issue auto-resolved; all remaining issues are backend-blocked.
- **Mobile account page overhaul** (2026-05-23) — `AccountPage.jsx` rebuilt as a full account hub: dark navy profile card with edit button; "Need assistance?" banner → `/contact`; **My Activity** section (Orders, Inbox, Wishlist); **Settings** section (Payment Settings, Account Management, Notification Preferences, More Settings) with "Coming Soon" modals for unbuilt features; **Close Account** with typed-confirmation danger modal (logs out + redirects on confirm); **Company** section (About Us, Contact, Terms & Privacy); Sign Out button. Desktop `AccountMenu` dropdown in `Navbar.jsx` also expanded with grouped sections (assistance, activity, settings, company links). No Known Issue auto-resolved; remaining issues are backend-blocked.
- **Full store rebranding + centralized brand config** (2026-05-23, extended 2026-05-23) — all hardcoded "University of Ghana" / "UG" / "Legon" / "campus" references removed from every file (HomePage fallbacks, HeroSection fallback, FeaturedTrio, ContactPage, ProductPage, CheckoutPage, email.js password reset). Created `src/config/brand.js` (all brand text defaults in one place) and `src/context/BrandContext.jsx`. Admin Store Branding section expanded to **13 admin-editable fields** (logo, navbar, footer, contact card, auth pages, orders/account, emails). Logo removal fixed (payload now always sends all keys including empty string = "use default"). `CheckoutPage` pickup card name now reads `brand.contactStoreName`. `email.js` `sendPasswordResetEmail` uses storeName variable. No Known Issue auto-resolved; remaining issues are backend-blocked.
- **Admin Delivery page with live preview** (2026-05-23) — created `AdminDeliveryPage.jsx` at `/admin/delivery` with split-pane editor (form left, live checkout-step-1 preview right, toggling between Home delivery and Store pickup tabs). All delivery settings now admin-editable: **delivery fees** (`free_delivery_threshold`, `standard_delivery_fee` — also in Settings → Delivery Settings, linked with "Also in Settings" shortcut) and **pickup point** (`pickup_address`, `pickup_gps_code`, `pickup_hours`, `pickup_description`, `pickup_phone` — 5 new keys added to `ALLOWED_SETTING_KEYS` in API). `BrandContext` now maps all 7 delivery keys and parses numeric fee fields from settings text. `CheckoutPage`, `CartPage`, `ContactPage` updated to read from `brand.*` instead of static `delivery.js` constants. No Known Issue auto-resolved; remaining issues are backend-blocked.
- **Admin order detail view + delete completed orders** (2026-05-23) — (1) **Backend** (`routes/admin.js`): added `GET /admin/orders/:id` returning full order row + `items[]` (with `title`, `author`, `brand`, `cover_color`); added `DELETE /admin/orders/:id` restricted to terminal statuses (`delivered`, `picked_up`, `cancelled`) — returns `400` if order is still active. (2) **`src/api/admin.js`**: added `getAdminOrder(id)` and `deleteAdminOrder(id)`. (3) **`AdminOrdersPage.jsx`**: added `OrderDetailModal` (fetches live data, shows delivery address highlighted in a coloured card for quick dispatch reference, customer contact with clickable tel/email links, items list, payment summary); added `DeleteOrderModal` (confirmation dialog, removes order from local state on success); added `View` button on every row and `Delete` button (red, terminal orders only) replacing the previous `—` placeholder. No Known Issue auto-resolved; remaining issues are backend-blocked.
- **Order flow differentiation + UI clarity** (2026-05-23) — end-to-end cleanup of the two-pipeline order system: (1) **`AdminOrdersPage.jsx`**: added per-order `MiniPipeline` component (colour-coded dots + step count showing exact position in the home or pickup pipeline); added `🚚 Home Delivery / 🏪 Store Pickup` filter pills above the orders table; added a pipeline legend below the table explaining both flows. (2) **`AdminEmailTemplatesPage.jsx`**: templates grouped into four labelled sections (All Order Types / Home Delivery Only / Pickup Only / System & Admin) with per-template `TypeTag` badge; auto-switches preview context when you click a template; added a "Preview as: Home Delivery | Store Pickup" toggle that swaps sample variables in the live iframe preview. (3) **`OrdersPage.jsx`**: added `DeliveryTypeBadge` and `MiniProgress` to each order card so customers can see delivery type + step progress without clicking in. (4) **`OrderDetailPage.jsx`**: replaced ad-hoc pickup detection with a shared `detectIsPickup()` helper that checks `delivery_type` field first then falls back to address string; timeline "What's happening" hint now shows a "Next: <step label>" line so the customer always knows what comes next. No Known Issue auto-resolved; all remaining issues are backend-blocked.
- **Checkout 400 error + error-handler fixes** (2026-05-23) — fixed three bugs: (1) `CheckoutPage.jsx` `onPay()` catch block checked `data.message` but every backend error uses `data.error`, so real error reasons (e.g. "Cart is empty", "Insufficient stock") were always hidden behind the generic "We could not start your payment" string; split into two separate try/catch blocks — one for `createOrder` (shows "Could not place your order") and one for `initializePayment` (shows "We could not start your payment"), both now surfacing `data.error || data.message`. (2) `OrdersPage.jsx` had the same `data.message`-only bug on its GET /orders error handler — fixed to `data.error || data.message`. (3) `kingdom-books-api/src/config/schema.sql` `orders` CREATE TABLE was missing `delivery_type`, `customer_name`, `customer_phone`, `customer_email` and had the old narrow status CHECK constraint — synced with the live migration so fresh `npm run db:setup` installs get a complete schema. No Known Issue auto-resolved; remaining issues are backend-blocked.
- **Order tracking overhaul + granular status pipeline** (2026-05-23) — full end-to-end redesign of the order lifecycle: (1) **DB**: 4 new columns on `orders` (`customer_name`, `customer_phone`, `customer_email`, `delivery_type`); status CHECK constraint widened to 9 values (`migrateOrderStatusCheck.js` also updated to the wide set so it no longer narrows the constraint when re-run); 5 new email templates seeded (`order_confirmed`, `order_packaged`, `order_out_for_delivery`, `order_ready_for_pickup`, `order_picked_up`). Migration: `migrateOrderEnhancements.js` chained into `npm run migrate`. (2) **Backend** (`routes/admin.js`): static `VALID_TRANSITIONS` replaced with `getValidTransitions(fromStatus, deliveryType)` — home delivery path: `pending → confirmed → packaged → out_for_delivery → delivered`; pickup path: `pending → confirmed → ready_for_pickup → picked_up`; `ORDERS_SELECT` extended with `delivery_type`, `customer_phone`, `COALESCE(o.customer_name, u.name)`, `COALESCE(o.customer_email, u.email)`. Email fired directly from updated order row. `routes/settings.js` public endpoint created for BrandContext; `admin_login_subtitle` added to PUBLIC_KEYS. (3) **Frontend** (`src/api/orders.js`): `createOrder` now accepts optional `{ customerName, customerPhone, customerEmail, deliveryType }` and sends them in the POST body. `CheckoutPage` passes all delivery form fields. (4) **`OrderDetailPage.jsx`**: fully rewritten — `HOME_STEPS` (5-step), `PICKUP_STEPS` (4-step), `LEGACY_STEPS` (3-step for old `processing` orders); `ContactInfo` component shows stored customer name/phone/email; delivery-type auto-detected; cancel now also works from `confirmed`. (5) **`AdminOrdersPage.jsx`**: fetches all orders, filters client-side; 6 tabs (All, Pending, Confirmed, In Progress, Completed, Cancelled) each with live count badge; `getNextStatus(status, deliveryType)` drives the advance button; delivery type pill shown on each row; customer phone visible; correct button labels per transition. (6) **`OrdersPage.jsx`** (storefront): updated `STATUS_LABELS` and `statusStyles` to cover all 9 statuses — `confirmed`, `packaged`, `out_for_delivery`, `ready_for_pickup`, `picked_up` all render with correct colour pills and human-readable labels. (7) **`AdminEmailTemplatesPage.jsx`**: `TEMPLATE_LABELS`, `TEMPLATE_DESCRIPTIONS`, and template list sort order updated to include all 5 new stage templates; `{{pickup_location}}`, `{{pickup_hours}}`, and `{{delivery_label}}` added to variables reference. **IMPORTANT — action needed**: restart the API server and run `npm run migrate` in `kingdom-books-api` to apply DB columns + seed templates. No Known Issue auto-resolved; remaining issues are backend-blocked.
- ✅ **RESOLVED — About system entirely hardcoded and not admin-editable** (2026-06-04) — fixed 5 broken connections that made the `/about` page un-editable end-to-end despite partial backend support: (1) **Backend `routes/settings.js`**: added 5 `about_*` keys (`about_hero_label`, `about_hero_heading`, `about_hero_subtitle`, `about_story_heading`, `about_story`) to `PUBLIC_KEYS` so the storefront can fetch them. (2) **Backend `config/migrate.js`**: seeded sensible defaults for all 5 `about_*` keys (matching `brand.js`) via `ON CONFLICT DO NOTHING`. (3) **Backend `config/schema.sql` + `config/migrateHomepage.js`**: removed the orphaned `about` row from `homepage_sections` seed + added a one-shot `DELETE FROM homepage_sections WHERE section_key = 'about'` cleanup for existing DBs. (4) **Frontend `src/pages/admin/AdminSettingsPage.jsx`**: added 5 fields to `BRANDING_KEYS`, `brandingForm` state, settings loader, and a new "About page" sub-section in the Store Branding form (long story is a 6-row `<textarea>`); removed the misleading help comment that told admins to edit `brand.js`. (5) **Frontend `src/components/Footer.jsx`**: removed the broken Privacy and Terms links that both pointed at `/about`. (6) **Frontend `src/components/homepage/AboutSection.jsx`**: deleted the orphaned component (was never imported anywhere). (7) **`src/config/brand.js`**: updated header comment to accurately describe what is/isn't admin-editable. (8) **Doc**: updated `kingdom-books-api/CLAUDE.md` to document the by-key route + drop `about` from seeded section keys list. **No backend restart strictly required** — `migrate.js` re-run is enough to seed the defaults, but storefront sees changes after a normal page reload. `AboutPage.jsx` JSX was not modified (already reads via `useBrand()`); stats and reasons stay hardcoded — Tier 3 work. **IMPORTANT — action needed**: run `npm run migrate` in `kingdom-books-api` so the `about_*` settings get seeded and the orphan `about` homepage row gets deleted.

## 9. New-page branding rule

> **MANDATORY: Every new page and component that displays store-specific text MUST follow this checklist.**

When you create a new page or component:

### Step 1 — No hardcoded store strings
Never write literal store names, addresses, taglines, or marketing copy directly in JSX or JS. Always use one of:
- `useBrand()` hook for any brand string that appears in the UI
- `PICKUP_POINT` from `src/config/delivery.js` for physical address / GPS / hours
- `process.env.STORE_NAME` (backend) for any store-name reference in server code

### Step 2 — Map new text to an admin field
If the text is something the store owner might want to change (a heading, a message, a tagline variant), it must have a corresponding entry in `AdminSettingsPage.jsx` → Store Branding. Add the key to:
1. `BRANDING_KEYS` array in `AdminSettingsPage.jsx`
2. `brandingForm` initial state in `AdminSettingsPage.jsx`
3. The `useEffect` settings loader in `AdminSettingsPage.jsx`
4. A clearly-labelled input field inside the Store Branding `<form>` JSX
5. `ALLOWED_SETTING_KEYS` in `kingdom-books-api/src/routes/admin.js`
6. `SETTINGS_MAP` in `src/context/BrandContext.jsx` (maps DB key → brand.js key)
7. A default value in `src/config/brand.js`

### Step 3 — Backend: use `getEmailBranding()` for emails
Any new email-sending function in `email.js` must call `await emailShell(content)` (which reads branding from DB automatically). Never call `transporter.sendMail` with a hardcoded `from:` name — always use `process.env.STORE_NAME || 'Kingdom Books & Stationery'`.

### Quick reference — where each text type lives
| Text | Source | Admin location |
|---|---|---|
| Store name (full) | `brand.storeName` / `store_name` DB key | Settings → Store Info |
| Store name (short) | `brand.storeNameShort` / `store_name_short` | Settings → Store Branding |
| Tagline (short) | `brand.taglineShort` / `store_tagline_short` | Settings → Store Branding |
| Footer copyright | `brand.footerCopyright` / `footer_copyright` | Settings → Store Branding |
| Contact/pickup card | `brand.contactStoreName` / `contact_store_name` | Settings → Store Branding |
| Login heading | `brand.loginHeading` / `login_heading` | Settings → Store Branding |
| Register subtitle | `brand.registerSubtitle` / `register_subtitle` | Settings → Store Branding |
| Order delivered msg | `brand.orderDeliveredThanks` / `order_delivered_thanks` | Settings → Store Branding |
| Account footer | `brand.accountFooterLine` / `account_footer_line` | Settings → Store Branding |
| Email header sub | `brand.emailHeaderSubtitle` / `email_header_subtitle` | Settings → Store Branding |
| Email footer | `brand.emailFooterLine` / `email_footer_line` | Settings → Store Branding |
| Email subjects/body | `email_templates` DB table | Admin → Email Templates |
| Store address | `PICKUP_POINT.address` / `store_address` DB key | Settings → Store Info |
| About hero label | `brand.aboutHeroLabel` / `about_hero_label` | Settings → Store Branding → About page |
| About hero heading | `brand.aboutHeroHeading` / `about_hero_heading` | Settings → Store Branding → About page |
| About hero subtitle | `brand.aboutHeroSubtitle` / `about_hero_subtitle` | Settings → Store Branding → About page |
| About story heading | `brand.aboutStoryHeading` / `about_story_heading` | Settings → Store Branding → About page |
| About story body | `brand.aboutStory` / `about_story` | Settings → Store Branding → About page |
| About stats / reasons | `brand.stats` / `brand.reasons` (hardcoded) | Not yet admin-editable — edit `src/config/brand.js` |
