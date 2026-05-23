import { useEffect, useState } from 'react'
import { getHomepage } from '../api/homepage.js'
import { getProducts } from '../api/products.js'
import { mapProducts } from '../api/productMapper.js'
import useCategoryTree from '../hooks/useCategoryTree.js'

import AnnouncementBarSection from '../components/homepage/AnnouncementBarSection.jsx'
import HeroSection from '../components/homepage/HeroSection.jsx'
import CategoriesSection from '../components/homepage/CategoriesSection.jsx'
import BestsellersSection from '../components/homepage/BestsellersSection.jsx'
import FeaturesSection from '../components/homepage/FeaturesSection.jsx'
import FormatStrip from '../components/homepage/FormatStrip.jsx'
import FeaturedTrio from '../components/homepage/FeaturedTrio.jsx'

// Hardcoded content drives the homepage render. The CMS fetch below is a
// non-breaking overlay: when the API succeeds, individual fields override
// these values; when it fails or returns empty, the page still renders.
const HARDCODED = {
  announcement: {
    text: 'Free delivery on all campus orders over GH₵ 50 · Pay with Mobile Money or Card',
    bg_color: '#000d1c',
  },
  hero: {
    title: 'Books, stationery & gifts for the academic year',
    subtitle: 'Search 12,000+ titles. Free delivery on the Legon campus. Pay with Mobile Money.',
    bg_color: '#001a36',
    text_color: '#ffffff',
    button_text: 'Search',
    button_link: '/shop',
    images: [],
  },
  categories: { title: 'Shop by Section', max_items: 3 },
  bestsellers: { title: 'Bestsellers', strategy: 'auto', max_items: 5 },
  features: {
    title: 'Why Kingdom Books',
    cards: [
      { icon: 'truck', title: 'Free Delivery', description: 'On all campus orders over GH₵ 50 — same-day on Legon.' },
      { icon: 'return', title: '30-Day Returns', description: 'Bring it back unused for a full refund — no questions asked.' },
      { icon: 'gift', title: 'Gift Cards', description: 'Digital and physical gift cards from GH₵ 20 — perfect for any reader.' },
      { icon: 'phone', title: 'Mobile Money', description: 'Pay with MTN, Vodafone or AirtelTigo — instant confirmation.' },
    ],
  },
  featured_trio: { images: [] },
}

function findSection(sections, key) {
  if (!Array.isArray(sections)) return null
  return sections.find((s) => (s?.section_key || s?.type) === key) || null
}

// A section is visible when:
// - The API hasn't responded yet (sections===null) → show hardcoded defaults
// - The API responded AND the section IS in the response with is_visible !== false
// Explicitly NOT visible when the API responded but the section was omitted (hidden by admin).
function isVisible(sections, section) {
  if (sections === null) return true      // API not loaded yet — show hardcoded
  if (section == null) return false        // API loaded, section not returned → hidden
  return section.is_visible !== false
}

function resolveBestsellerProducts(content, cache) {
  if (!Array.isArray(cache) || cache.length === 0) return []
  const max = content?.max_items || 4
  if (content?.strategy === 'manual' && Array.isArray(content?.product_ids)) {
    const ids = content.product_ids.map((x) => Number(x))
    const byId = new Map(cache.map((p) => [Number(p.id), p]))
    return ids.map((id) => byId.get(id)).filter(Boolean).slice(0, max)
  }
  return cache.slice(0, max)
}

// Extract flat image URL strings from the section.images array the backend returns.
// Each entry is { id, image_url, public_id, ... }; we just need the URL string.
function extractImageUrls(section) {
  if (!Array.isArray(section?.images)) return []
  return section.images.map((img) => img?.image_url || img).filter(Boolean)
}

function HomePage() {
  // sections/settings start null so we render hardcoded content immediately.
  // The CMS fetch only fills them in if it succeeds — never blocks render.
  const [sections, setSections] = useState(null)
  const [settings, setSettings] = useState(null)
  const [productCache, setProductCache] = useState([])
  const tree = useCategoryTree()

  useEffect(() => {
    let cancelled = false
    getHomepage()
      .then((data) => {
        if (cancelled) return
        const rows = Array.isArray(data?.sections)
          ? data.sections
          : Array.isArray(data)
          ? data
          : null
        if (rows && rows.length > 0) setSections(rows)
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setSettings(data.settings || null)
        }
      })
      .catch(() => {
        // Silent fallback: hardcoded content is already rendering.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((rows) => {
        if (cancelled) return
        const mapped = mapProducts(rows).map((p) => ({
          id: p.id,
          title: p.title,
          author: p.brand || p.authorName || '',
          section: p.section,
          format: p.format,
          price: p.price,
          color: p.color,
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        }))
        setProductCache(mapped)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Look up the API row for each section (may be null when API is down).
  const heroSection = findSection(sections, 'hero')
  const categoriesSection = findSection(sections, 'categories')
  const bestsellersSection = findSection(sections, 'bestsellers')
  const featuresSection = findSection(sections, 'features')
  const featuredTrioSection = findSection(sections, 'featured_trio')

  // Build resolved content — API value if present, else hardcoded fallback.
  const heroImages = extractImageUrls(heroSection)
  const heroContent = {
    title: heroSection?.title || HARDCODED.hero.title,
    subtitle: heroSection?.subtitle || HARDCODED.hero.subtitle,
    bg_color: heroSection?.background_color || HARDCODED.hero.bg_color,
    text_color: heroSection?.text_color || HARDCODED.hero.text_color,
    button_text: heroSection?.button_text || HARDCODED.hero.button_text,
    button_link: heroSection?.button_link || HARDCODED.hero.button_link,
    images: heroImages.length > 0 ? heroImages : HARDCODED.hero.images,
  }

  const categoriesContent = {
    title: categoriesSection?.title || HARDCODED.categories.title,
    max_items: categoriesSection?.max_items ?? HARDCODED.categories.max_items,
    category_slugs: Array.isArray(categoriesSection?.content?.category_slugs)
      ? categoriesSection.content.category_slugs
      : undefined,
  }

  const bestsellersContent = {
    title: bestsellersSection?.title || HARDCODED.bestsellers.title,
    strategy: bestsellersSection?.content?.strategy || HARDCODED.bestsellers.strategy,
    max_items: bestsellersSection?.max_items ?? HARDCODED.bestsellers.max_items,
    product_ids: Array.isArray(bestsellersSection?.content?.product_ids)
      ? bestsellersSection.content.product_ids
      : undefined,
  }

  const featuresContent = {
    title: featuresSection?.title || HARDCODED.features.title,
    cards:
      Array.isArray(featuresSection?.content?.cards) && featuresSection.content.cards.length > 0
        ? featuresSection.content.cards
        : HARDCODED.features.cards,
  }

  const featuredTrioImages = extractImageUrls(featuredTrioSection)
  const featuredTrioContent = {
    images: featuredTrioImages.length > 0 ? featuredTrioImages : HARDCODED.featured_trio.images,
  }

  const announcementText = settings?.announcement_text || HARDCODED.announcement.text
  const announcementColor = settings?.announcement_color || HARDCODED.announcement.bg_color
  // announcement_visible is stored as TEXT in the DB → comes back as 'true'/'false' string.
  const announcementVisible =
    settings?.announcement_visible === true || settings?.announcement_visible === 'true'

  const bestsellerProducts = resolveBestsellerProducts(bestsellersContent, productCache)

  return (
    <div className="bg-brand-page">
      {announcementVisible && announcementText && (
        <AnnouncementBarSection
          content={{ text: announcementText, bg_color: announcementColor }}
        />
      )}
      {isVisible(sections, heroSection) && <HeroSection content={heroContent} />}
      {isVisible(sections, categoriesSection) && (
        <CategoriesSection content={categoriesContent} categoryTree={tree} />
      )}
      <FormatStrip />
      {isVisible(sections, bestsellersSection) && (
        <BestsellersSection content={bestsellersContent} products={bestsellerProducts} />
      )}
      {isVisible(sections, featuredTrioSection) && <FeaturedTrio content={featuredTrioContent} />}
      {isVisible(sections, featuresSection) && <FeaturesSection content={featuresContent} />}
    </div>
  )
}

export default HomePage
