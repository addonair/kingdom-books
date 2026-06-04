import { createContext, useContext, useEffect, useState } from 'react'
import { getPublicSettings } from '../api/settings.js'
import defaults from '../config/brand.js'

// Maps admin settings keys → brand.js keys so admin-saved values overlay defaults.
const SETTINGS_MAP = {
  logo_url:             'logoUrl',
  logo_height:          'logoHeight',
  store_name:           'storeName',
  store_name_short:     'storeNameShort',
  store_tagline:        'tagline',
  store_tagline_short:  'taglineShort',
  about_hero_label:     'aboutHeroLabel',
  about_hero_heading:   'aboutHeroHeading',
  about_hero_subtitle:  'aboutHeroSubtitle',
  about_story_heading:  'aboutStoryHeading',
  about_story:          'aboutStory',
  footer_copyright:     'footerCopyright',
  contact_store_name:   'contactStoreName',
  login_heading:        'loginHeading',
  register_subtitle:    'registerSubtitle',
  order_delivered_thanks: 'orderDeliveredThanks',
  account_footer_line:  'accountFooterLine',
  admin_login_subtitle: 'adminLoginSubtitle',
  email_header_subtitle: 'emailHeaderSubtitle',
  email_footer_line:    'emailFooterLine',
  page_title:           'pageTitle',
  // Pickup point
  pickup_address:       'pickupAddress',
  pickup_gps_code:      'pickupGpsCode',
  pickup_hours:         'pickupHours',
  pickup_description:   'pickupDescription',
  pickup_phone:         'pickupPhone',
  // Legal pages (markdown)
  terms_content:        'termsContent',
  privacy_content:      'privacyContent',
}

// Keys whose admin value is a JSON-stringified array; parse safely or fall back to defaults.
const JSON_ARRAY_KEYS = {
  about_stats_json:   'stats',
  about_reasons_json: 'reasons',
}

const BrandContext = createContext(defaults)

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(defaults)

  useEffect(() => {
    getPublicSettings()
      .then((s) => {
        if (!s) return
        const overrides = {}
        for (const [settingKey, brandKey] of Object.entries(SETTINGS_MAP)) {
          if (s[settingKey] != null && s[settingKey] !== '') {
            overrides[brandKey] = s[settingKey]
          }
        }
        // Numeric delivery fields are stored as TEXT in settings — parse them
        const threshold = Number(s.free_delivery_threshold)
        if (!isNaN(threshold) && threshold > 0) overrides.freeDeliveryThreshold = threshold
        const fee = Number(s.standard_delivery_fee)
        if (!isNaN(fee) && fee >= 0) overrides.deliveryFee = fee

        // JSON-array fields — parse safely, ignore on malformed data
        for (const [settingKey, brandKey] of Object.entries(JSON_ARRAY_KEYS)) {
          const raw = s[settingKey]
          if (typeof raw === 'string' && raw.trim()) {
            try {
              const parsed = JSON.parse(raw)
              if (Array.isArray(parsed) && parsed.length > 0) overrides[brandKey] = parsed
            } catch {
              // Malformed JSON — keep brand.js default
            }
          }
        }

        if (Object.keys(overrides).length > 0) {
          setBrand((prev) => ({ ...prev, ...overrides }))
        }
      })
      .catch(() => {
        // Network/auth failure — keep defaults
      })
  }, [])

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export function useBrand() {
  return useContext(BrandContext)
}
