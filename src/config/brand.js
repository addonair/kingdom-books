// Central brand configuration — default values used when admin hasn't customized.
// Most text fields below are admin-editable from Admin → Settings → Store Branding
// (admin-saved values override these defaults at runtime via BrandContext).
// Exceptions still hardcoded for now: `stats` and `reasons` on the About page,
// `adminOrderEmailSubjectPrefix`, and the delivery/pickup numeric defaults
// (those live in the settings table under their own keys but aren't surfaced in the
// branding form — see Delivery Settings and Admin → Delivery page instead).

const brand = {
  // ── Logo ─────────────────────────────────────────────────────────────────
  // Leave empty to use the built-in SVG icon + store name text.
  // Set to a URL (e.g. '/logo.png' or a Cloudinary URL) to show your own logo.
  logoUrl: '',
  // Max height of your logo image in the navbar (px). Adjust to taste.
  logoHeight: 40,

  // ── Core identity ────────────────────────────────────────────────────────
  storeName: 'Kingdom Books & Stationery',
  storeNameShort: 'Kingdom Books',       // Navbar / compact spaces
  tagline: 'Books, Stationery & Gifts',  // Sub-headline under the store name
  taglineShort: 'Books & Stationery',    // Even shorter contexts

  // ── About page ───────────────────────────────────────────────────────────
  aboutHeroLabel: 'Our Story',
  aboutHeroHeading: 'Serving our community',
  aboutHeroSubtitle:
    'Your local bookshop — books, stationery and gifts for every reader.',
  aboutStoryHeading: 'A Bookshop Built for Readers',
  aboutStory:
    'We opened our doors with a simple promise: every student and reader should be able to find the right book at a fair price. That promise still guides us. We have grown from a single counter into a full-service bookshop stocking thousands of titles, premium stationery, and thoughtful gifts — but we still measure success the same way: by the customers we send home ready to learn, create, and grow.',

  // ── Stats strip on About page ─────────────────────────────────────────────
  stats: [
    { number: '12k+', label: 'Titles in stock' },
    { number: '24h',  label: 'Fast delivery' },
    { number: '4.9★', label: 'Average rating' },
    { number: '100%', label: 'Satisfaction' },
  ],

  // ── Why-us reasons on About page ──────────────────────────────────────────
  reasons: [
    {
      title: 'Curated Selection',
      desc: 'Required course texts plus general reading — hand-picked for our community.',
    },
    {
      title: 'Trusted Quality',
      desc: 'Every title and product is vetted for quality and value before it hits the shelf.',
    },
    {
      title: 'Local Expertise',
      desc: 'Staff who know the stock and can recommend confidently across every category.',
    },
    {
      title: 'Built for Customers',
      desc: 'Mobile Money payment, fast delivery, and fair prices that respect your budget.',
    },
  ],

  // ── Footer ────────────────────────────────────────────────────────────────
  footerCopyright: `© ${new Date().getFullYear()} Kingdom Books & Stationery Ltd`,

  // ── Contact card ─────────────────────────────────────────────────────────
  contactStoreName: 'Kingdom Books & Stationery',

  // ── Auth pages ────────────────────────────────────────────────────────────
  loginHeading: 'Sign in to Kingdom Books',
  registerSubtitle: 'Join Kingdom Books for faster checkout and order tracking.',

  // ── Order confirmation ────────────────────────────────────────────────────
  orderDeliveredThanks: 'Your order has been delivered. Thank you for shopping with us!',

  // ── Account page ──────────────────────────────────────────────────────────
  accountFooterLine: 'Kingdom Books & Stationery',

  // ── Admin login ───────────────────────────────────────────────────────────
  adminLoginSubtitle: 'Kingdom Books Admin · Staff Dashboard',

  // ── Email templates ───────────────────────────────────────────────────────
  emailHeaderSubtitle: 'Your Bookstore',
  emailFooterLine: `© ${new Date().getFullYear()} Kingdom Books & Stationery`,

  // ── Admin email subject default ───────────────────────────────────────────
  adminOrderEmailSubjectPrefix: 'Your order #',

  // ── Page <title> ─────────────────────────────────────────────────────────
  pageTitle: 'Kingdom Books',

  // ── Legal pages (markdown) ────────────────────────────────────────────────
  termsContent: `# Terms of Service

Welcome to Kingdom Books. By using this site, you agree to these terms.

## 1. Orders
We accept orders at our discretion and reserve the right to refuse service.

## 2. Payments
Payment is processed securely through Paystack. We do not store your card details.

## 3. Delivery
Delivery times are estimates. We are not liable for delays caused by third parties.

## 4. Returns
Contact us within 7 days of receipt for refund or exchange requests.

## 5. Account
You are responsible for keeping your password secure.

*The store owner is responsible for keeping these terms accurate and legally compliant.*`,
  privacyContent: `# Privacy Policy

Kingdom Books respects your privacy.

## What we collect
- Name and email (for account + order processing)
- Delivery address (per order)
- Payment reference (from Paystack — no card details)

## How we use it
- Fulfilling your orders
- Sending order updates
- Improving our service

## Sharing
We do not sell your data. We share only with delivery partners and Paystack as required to complete orders.

## Your rights
You can edit or delete your account at any time from your account settings.

## Contact
Reach us via the Contact page for any privacy questions.

*The store owner is responsible for keeping this policy accurate and legally compliant.*`,

  // ── Delivery & Pickup ─────────────────────────────────────────────────────
  freeDeliveryThreshold: 50,
  deliveryFee: 15,
  pickupAddress: 'Main Store, Accra, Ghana',
  pickupGpsCode: 'GA-044-0059',
  pickupHours: 'Mon – Fri: 8:00am – 5:00pm  ·  Sat: 9:00am – 2:00pm',
  pickupDescription:
    'Pick up at our main store counter. Your order will be ready within 2 hours of payment confirmation.',
  pickupPhone: '+233 20 000 0000',
}

export default brand
