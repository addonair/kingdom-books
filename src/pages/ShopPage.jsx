import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useBrand } from '../context/BrandContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { sortOptions } from '../data/products.js'
import {
  CONDITIONS,
  PRICE_MAX,
  PRICE_MIN,
  STATIONERY_BRANDS,
  findItemType,
  findSubcategory,
  getSubcategories,
  leafSlugsForMain,
  leafSlugsForSubcategory,
} from '../data/categories.js'
import { getProducts } from '../api/products.js'
import { getCategories } from '../api/categories.js'
import { mapProducts } from '../api/productMapper.js'
import ImgWithFallback from '../components/ImgWithFallback.jsx'
import useCategoryTree from '../hooks/useCategoryTree.js'

const MAIN_CATEGORIES = [
  { key: 'books', label: 'Books' },
  { key: 'stationery', label: 'Stationery' },
]

function ProductVisualSwatch({ p }) {
  const brand = useBrand()
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${p.color}, ${p.color}dd)` }}
    >
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 8px, transparent 8px 16px)',
        }}
      />
      {p.shape === 'book' && (
        <div
          className="relative flex items-center justify-center shadow-[4px_4px_12px_rgba(0,0,0,0.25)]"
          style={{
            width: 84,
            height: 110,
            background: p.color,
            borderRadius: '3px 8px 8px 3px',
            boxShadow:
              '4px 4px 12px rgba(0,0,0,0.25), inset -3px 0 6px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{ width: 8, background: 'rgba(0,0,0,0.3)' }}
          />
          <div
            className="text-[8px] font-bold uppercase tracking-widest text-center px-2"
            style={{ color: p.accent }}
          >
            {p.title.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>
      )}
      {p.shape === 'notebook' && (
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 76,
            height: 100,
            background: '#0d3060',
            borderRadius: '3px 8px 8px 3px',
            boxShadow:
              '4px 4px 12px rgba(0,0,0,0.25), inset -3px 0 6px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{ width: 8, background: 'rgba(0,0,0,0.3)' }}
          />
          <div
            className="w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center text-[10px] font-bold"
            style={{ borderColor: p.accent, color: p.accent }}
          >
            L
          </div>
        </div>
      )}
      {p.shape === 'calculator' && (
        <div
          className="flex flex-col gap-1 p-1.5"
          style={{
            width: 64,
            height: 100,
            background: '#1a1a1a',
            borderRadius: 6,
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="h-5 rounded-sm flex items-center justify-end px-1 text-[8px] font-mono text-[#222]"
            style={{ background: '#a8b89a' }}
          >
            0.
          </div>
          <div className="flex-1 grid grid-cols-4 gap-[2px]">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[1px]"
                style={{ background: i === 15 ? '#C9920A' : '#3a3a3a' }}
              />
            ))}
          </div>
        </div>
      )}
      {p.shape === 'pen' && (
        <div
          className="flex flex-col items-center gap-1.5"
          style={{ transform: 'rotate(-25deg)' }}
        >
          <div
            style={{
              width: 12,
              height: 90,
              background: `linear-gradient(180deg, ${
                p.color === '#f0c040' ? '#fff' : '#aaa'
              } 0%, ${p.accent} 30%, ${p.accent} 100%)`,
              borderRadius: '6px 6px 2px 2px',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
            }}
          />
          <div
            style={{
              width: 4,
              height: 12,
              background: p.accent,
              borderRadius: '0 0 2px 2px',
            }}
          />
        </div>
      )}
      {p.shape === 'markers' && (
        <div className="flex gap-[3px]">
          {['#c0392b', '#1a7a4a', '#1a4a8a', '#7c3d9e', '#C9920A'].map((c, i) => (
            <div
              key={i}
              className="relative"
              style={{
                width: 8,
                height: 70,
                background: `linear-gradient(180deg, ${c}, ${c}cc)`,
                borderRadius: '2px 2px 4px 4px',
                boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              <div
                className="absolute -top-2 left-0 right-0"
                style={{
                  height: 12,
                  background: c,
                  borderRadius: '50% 50% 2px 2px',
                }}
              />
            </div>
          ))}
        </div>
      )}
      {p.shape === 'ream' && (
        <div
          className="flex items-center justify-center text-xs font-extrabold tracking-widest"
          style={{
            width: 100,
            height: 76,
            background: '#fff',
            color: '#888',
            borderRadius: 2,
            boxShadow:
              '0 4px 14px rgba(0,0,0,0.15), inset 0 -8px 0 #e8e8e8, inset 0 -16px 0 #f5f5f5',
          }}
        >
          A4
        </div>
      )}
      {p.shape === 'tote' && (
        <div className="relative flex items-end justify-center" style={{ width: 90, height: 100 }}>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 border-[3px] rounded-t-full"
            style={{ width: 56, height: 28, borderColor: p.accent, borderBottom: 'none' }}
          />
          <div
            className="w-full"
            style={{
              height: 78,
              background: p.accent,
              borderRadius: '4px 4px 6px 6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="font-serif text-base" style={{ color: p.color }}>
              {brand.storeNameShort.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductVisual({ p }) {
  const primaryImage =
    Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-white">
      <ImgWithFallback
        src={primaryImage}
        alt={p.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        fallback={<ProductVisualSwatch p={p} />}
      />
    </div>
  )
}

function ProductCard({ p, wishlisted, onToggleWishlist, onAddToCart }) {
  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
      <Link to={`/product/${p.id}`} className="relative block">
        <ProductVisual p={p} />
        <span className="absolute top-2.5 left-2.5 bg-white/95 text-brand-navy text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
          {p.format}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleWishlist(p.id)
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#C9920A' : 'none'}>
            <path
              d="M12 21s-7-4.5-9.5-9C.8 8.7 2.6 5 6 5c2 0 3.5 1.2 4 2.5C10.5 6.2 12 5 14 5c3.4 0 5.2 3.7 3.5 7C19 16.5 12 21 12 21z"
              stroke={wishlisted ? '#C9920A' : '#001a36'}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Link>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-wider text-brand-gold font-bold mb-1.5">
          {p.section}
        </div>
        <Link
          to={`/product/${p.id}`}
          className="text-[13px] md:text-sm font-semibold text-brand-navy leading-snug line-clamp-2 min-h-[2.6em] hover:text-brand-gold transition-colors"
        >
          {p.title}
        </Link>
        <div className="text-[11px] md:text-xs text-brand-navy/55 mt-1">{p.brand}</div>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="text-brand-gold font-extrabold text-base md:text-lg">GH₵ {p.price}</div>
          <button
            type="button"
            onClick={() => onAddToCart(p)}
            className="bg-brand-navy hover:bg-brand-navy-deep text-white text-[11px] md:text-xs font-bold px-3 py-2 rounded-lg transition-colors"
          >
            + Cart
          </button>
        </div>
      </div>
    </article>
  )
}

function CategoryIcon({ keyName }) {
  if (keyName === 'books') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M19 3v18" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (keyName === 'stationery') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 3l5 5-11 11H5v-5L16 3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MainCategoryCards({ value, onChange, categories }) {
  const list = categories && categories.length > 0 ? categories : MAIN_CATEGORIES
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-5">
      {list.map((c) => {
        const active = value === c.key
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            aria-pressed={active}
            className={`rounded-xl px-2 py-3 text-[12px] font-bold uppercase tracking-wider transition-all border-2 ${
              active
                ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                : 'bg-white text-brand-navy border-brand-line hover:border-brand-gold'
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <CategoryIcon keyName={c.key} />
              <span className="truncate max-w-full">{c.label}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-[12px] font-semibold rounded-full px-3 py-1.5 border transition-colors ${
        active
          ? 'bg-brand-gold text-white border-brand-gold'
          : 'bg-white text-brand-navy border-brand-line hover:border-brand-gold'
      }`}
    >
      {children}
    </button>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div className="mb-5">
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-navy mb-2">
        {title}
      </div>
      <div className="h-px bg-brand-line mb-3" />
      {children}
    </div>
  )
}

function Checkbox({ checked, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2 text-left"
    >
      <span
        className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked ? 'bg-brand-gold border-brand-gold' : 'bg-white border-[#cdd2da]'
        }`}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 12 9" fill="none">
            <path
              d="M1 4.5L4.5 8 11 1.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={`text-[13px] ${
          checked ? 'text-brand-navy font-semibold' : 'text-brand-navy/75'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

function Radio({ checked, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2 text-left"
    >
      <span
        className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 bg-white ${
          checked ? 'border-brand-gold' : 'border-[#cdd2da]'
        }`}
      >
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />}
      </span>
      <span
        className={`text-[13px] ${
          checked ? 'text-brand-navy font-semibold' : 'text-brand-navy/75'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

function PriceRangeControl({ minPrice, maxPrice, setMinPrice, setMaxPrice }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] mb-2">
        <span className="text-brand-navy/60">GH₵ {minPrice}</span>
        <span className="font-bold text-brand-gold">GH₵ {maxPrice}</span>
      </div>
      <div className="space-y-2">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-brand-navy/55">Min</label>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={minPrice}
            onChange={(e) => {
              const v = Number(e.target.value)
              setMinPrice(Math.min(v, maxPrice))
            }}
            className="w-full cursor-pointer"
            style={{ accentColor: '#C9920A' }}
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-brand-navy/55">Max</label>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={maxPrice}
            onChange={(e) => {
              const v = Number(e.target.value)
              setMaxPrice(Math.max(v, minPrice))
            }}
            className="w-full cursor-pointer"
            style={{ accentColor: '#C9920A' }}
          />
        </div>
      </div>
    </div>
  )
}

function AuthorSearch({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="absolute left-3 top-1/2 -translate-y-1/2"
      >
        <circle cx="11" cy="11" r="7" stroke="#C9920A" strokeWidth="2" />
        <path d="M20 20l-3.5-3.5" stroke="#C9920A" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search author…"
        className="w-full bg-white border border-brand-line rounded-lg pl-9 pr-3 py-2 text-[13px] text-brand-navy outline-none focus:border-brand-gold"
      />
    </div>
  )
}

function KeywordSearch({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="absolute left-3 top-1/2 -translate-y-1/2"
      >
        <circle cx="11" cy="11" r="7" stroke="#C9920A" strokeWidth="2" />
        <path d="M20 20l-3.5-3.5" stroke="#C9920A" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search title, author, ISBN…"
        aria-label="Search products"
        className="w-full bg-white border border-brand-line rounded-lg pl-9 pr-3 py-2 text-[13px] text-brand-navy outline-none focus:border-brand-gold"
      />
    </div>
  )
}

function CascadingFilters({
  tree,
  mainCategory,
  subCategory,
  itemType,
  onChangeSub,
  onChangeItemType,
  subjects,
  subjectsLoading,
}) {
  const subcats = getSubcategories(tree, mainCategory)
  const subObj = findSubcategory(tree, mainCategory, subCategory)
  const isBooks = mainCategory === 'books'
  const thirdLevelOptions = isBooks ? subjects : subObj?.itemTypes || []
  const thirdLevelTitle = isBooks ? 'Subject' : 'Item Type'
  const showThirdLevel =
    !!subCategory &&
    (isBooks ? subjectsLoading || thirdLevelOptions.length > 0 : thirdLevelOptions.length > 0)

  return (
    <>
      <FilterGroup title="Subcategory">
        <div className="flex flex-wrap gap-2">
          {subcats.map((s) => (
            <Pill
              key={s.slug}
              active={subCategory === s.slug}
              onClick={() => onChangeSub(subCategory === s.slug ? '' : s.slug)}
            >
              {s.label}
            </Pill>
          ))}
        </div>
      </FilterGroup>

      {showThirdLevel && (
        <FilterGroup title={thirdLevelTitle}>
          {isBooks && subjectsLoading ? (
            <div className="text-[12px] text-brand-navy/60">Loading subjects…</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {thirdLevelOptions.map((it) => (
                <Pill
                  key={it.slug}
                  active={itemType === it.slug}
                  onClick={() => onChangeItemType(itemType === it.slug ? '' : it.slug)}
                >
                  {it.label}
                </Pill>
              ))}
            </div>
          )}
        </FilterGroup>
      )}
    </>
  )
}

function FiltersBody({
  tree,
  mainCategories,
  mainCategory,
  setMainCategory,
  subCategory,
  setSubCategory,
  itemType,
  setItemType,
  subjects,
  subjectsLoading,
  searchInput,
  setSearchInput,
  authorInput,
  setAuthorInput,
  brand,
  setBrand,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  condition,
  setCondition,
}) {
  return (
    <>
      <FilterGroup title="Search">
        <KeywordSearch value={searchInput} onChange={setSearchInput} />
      </FilterGroup>

      <MainCategoryCards
        value={mainCategory}
        onChange={setMainCategory}
        categories={mainCategories}
      />

      {mainCategory && (
        <CascadingFilters
          tree={tree}
          mainCategory={mainCategory}
          subCategory={subCategory}
          itemType={itemType}
          onChangeSub={setSubCategory}
          onChangeItemType={setItemType}
          subjects={subjects}
          subjectsLoading={subjectsLoading}
        />
      )}

      {mainCategory === 'books' && (
        <FilterGroup title="Author">
          <AuthorSearch value={authorInput} onChange={setAuthorInput} />
        </FilterGroup>
      )}

      {mainCategory === 'stationery' && (
        <FilterGroup title="Brand">
          <div className="flex flex-col">
            {STATIONERY_BRANDS.map((b) => (
              <Checkbox
                key={b}
                checked={brand === b}
                label={b}
                onClick={() => setBrand(brand === b ? '' : b)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Price Range">
        <PriceRangeControl
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </FilterGroup>

      <FilterGroup title="Condition">
        <div className="flex flex-col">
          {CONDITIONS.map((c) => (
            <Radio
              key={c}
              checked={condition === c}
              label={c}
              onClick={() => setCondition(condition === c ? '' : c)}
            />
          ))}
        </div>
      </FilterGroup>
    </>
  )
}

function AccordionSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-brand-line">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[13px] font-bold uppercase tracking-[0.06em] text-brand-navy">
          {title}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 12 8"
          fill="none"
          className={`text-brand-navy/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  )
}

function MobileFiltersBody(props) {
  const {
    tree,
    mainCategories,
    mainCategory,
    setMainCategory,
    subCategory,
    setSubCategory,
    itemType,
    setItemType,
    subjects,
    subjectsLoading,
    searchInput,
    setSearchInput,
    authorInput,
    setAuthorInput,
    brand,
    setBrand,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    condition,
    setCondition,
  } = props

  const [open, setOpen] = useState({
    search: true,
    sub: true,
    item: true,
    authorBrand: true,
    price: false,
    condition: false,
  })
  const toggle = (k) => setOpen((s) => ({ ...s, [k]: !s[k] }))

  const subcats = getSubcategories(tree, mainCategory)
  const subObj = findSubcategory(tree, mainCategory, subCategory)
  const isBooks = mainCategory === 'books'
  const thirdLevelOptions = isBooks ? subjects : subObj?.itemTypes || []
  const thirdLevelTitle = isBooks ? 'Subject' : 'Item Type'
  const showThirdLevel =
    !!subCategory &&
    (isBooks ? subjectsLoading || thirdLevelOptions.length > 0 : thirdLevelOptions.length > 0)

  return (
    <div>
      <MainCategoryCards
        value={mainCategory}
        onChange={setMainCategory}
        categories={mainCategories}
      />

      <AccordionSection
        title="Search"
        isOpen={open.search}
        onToggle={() => toggle('search')}
      >
        <KeywordSearch value={searchInput} onChange={setSearchInput} />
      </AccordionSection>

      {mainCategory && (
        <AccordionSection
          title="Subcategory"
          isOpen={open.sub}
          onToggle={() => toggle('sub')}
        >
          <div className="flex flex-wrap gap-2">
            {subcats.map((s) => (
              <Pill
                key={s.slug}
                active={subCategory === s.slug}
                onClick={() => setSubCategory(subCategory === s.slug ? '' : s.slug)}
              >
                {s.label}
              </Pill>
            ))}
          </div>
        </AccordionSection>
      )}

      {mainCategory && showThirdLevel && (
        <AccordionSection
          title={thirdLevelTitle}
          isOpen={open.item}
          onToggle={() => toggle('item')}
        >
          {isBooks && subjectsLoading ? (
            <div className="text-[12px] text-brand-navy/60">Loading subjects…</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {thirdLevelOptions.map((it) => (
                <Pill
                  key={it.slug}
                  active={itemType === it.slug}
                  onClick={() => setItemType(itemType === it.slug ? '' : it.slug)}
                >
                  {it.label}
                </Pill>
              ))}
            </div>
          )}
        </AccordionSection>
      )}

      {mainCategory && (
        <AccordionSection
          title={mainCategory === 'books' ? 'Author' : 'Brand'}
          isOpen={open.authorBrand}
          onToggle={() => toggle('authorBrand')}
        >
          {mainCategory === 'books' ? (
            <AuthorSearch value={authorInput} onChange={setAuthorInput} />
          ) : (
            <div className="flex flex-col">
              {STATIONERY_BRANDS.map((b) => (
                <Checkbox
                  key={b}
                  checked={brand === b}
                  label={b}
                  onClick={() => setBrand(brand === b ? '' : b)}
                />
              ))}
            </div>
          )}
        </AccordionSection>
      )}

      <AccordionSection title="Price Range" isOpen={open.price} onToggle={() => toggle('price')}>
        <PriceRangeControl
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </AccordionSection>

      <AccordionSection
        title="Condition"
        isOpen={open.condition}
        onToggle={() => toggle('condition')}
      >
        <div className="flex flex-col">
          {CONDITIONS.map((c) => (
            <Radio
              key={c}
              checked={condition === c}
              label={c}
              onClick={() => setCondition(condition === c ? '' : c)}
            />
          ))}
        </div>
      </AccordionSection>
    </div>
  )
}

function ActiveChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-brand-navy text-white text-[12px] font-semibold px-3 py-1.5 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 1l6 6M7 1L1 7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  )
}

// The categories endpoint returns a nested tree; different backends use
// different field names for the children array. Read whichever is present.
function childrenOf(row) {
  return row?.subcategories || row?.children || row?.items || []
}

function ShopPage() {
  const { addToCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()

  const tree = useCategoryTree()
  const mainCategories = useMemo(
    () => Object.entries(tree).map(([key, v]) => ({ key, label: v.label })),
    [tree],
  )
  const [mainCategory, setMainCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [itemType, setItemType] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [authorInput, setAuthorInput] = useState('')
  const [authorQuery, setAuthorQuery] = useState('')
  const [brand, setBrand] = useState('')
  const [minPrice, setMinPrice] = useState(PRICE_MIN)
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [condition, setCondition] = useState('')
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('Relevance')
  const { isWishlisted, toggle: toggleWishlistApi } = useWishlist()
  const navigate = useNavigate()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [drawerEnter, setDrawerEnter] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [subjects, setSubjects] = useState([])
  const [subjectsLoading, setSubjectsLoading] = useState(false)
  // Map of Books subcategory slug → backend id.
  const [booksSubcatIdsBySlug, setBooksSubcatIdsBySlug] = useState({})
  // Map of Books subcategory slug → the full row object as returned by
  // the API. Used to read pre-nested subjects without a second API call
  // when the backend already embeds children.
  const [booksSubcatRowsBySlug, setBooksSubcatRowsBySlug] = useState({})

  // The backend returns categories as a nested tree: each top-level row
  // carries its children inline (typically under `subcategories` or
  // `children`). One call is therefore enough to learn every Books
  // subcategory id. Stationery is unaffected — it keeps the static tree.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const top = await getCategories()
        if (cancelled) return
        if (top?.[0]) {
          // One-shot diagnostic: prove which field name carries the children.
          console.log('[ShopPage] top-level row keys →', Object.keys(top[0]))
        }
        const books = (top || []).find((c) => {
          const slug = (c?.slug || '').toLowerCase()
          const name = (c?.name || c?.label || '').toLowerCase()
          return slug === 'books' || name === 'books'
        })
        if (!books) {
          console.warn('[ShopPage] Books not found in top-level response')
          return
        }
        const subRows = childrenOf(books)
        console.log(
          `[ShopPage] Books id=${books.id}, ${subRows.length} subcategories nested in response`,
        )
        const idMap = {}
        const rowMap = {}
        subRows.forEach((s) => {
          if (s?.slug) {
            idMap[s.slug] = s.id
            rowMap[s.slug] = s
          }
        })
        console.log('[ShopPage] booksSubcatIdsBySlug →', idMap)
        setBooksSubcatIdsBySlug(idMap)
        setBooksSubcatRowsBySlug(rowMap)
      } catch (err) {
        console.error('[ShopPage] failed to bootstrap Books categories', err)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // For Books only: populate the 3rd-level "Subject" list when a
  // subcategory is picked. Prefer the children already embedded in the
  // bootstrap response; only fall back to a network call if they aren't
  // there. Stationery keeps its static itemTypes.
  useEffect(() => {
    let cancelled = false
    if (mainCategory !== 'books' || !subCategory) {
      setSubjects([])
      setSubjectsLoading(false)
      return undefined
    }

    const cachedRow = booksSubcatRowsBySlug[subCategory]
    const cachedChildren = childrenOf(cachedRow)
    if (cachedChildren.length > 0) {
      setSubjects(
        cachedChildren.map((r) => ({
          id: r.id,
          slug: r.slug,
          label: r.label || r.name || r.slug,
        })),
      )
      setSubjectsLoading(false)
      return undefined
    }

    const subId = booksSubcatIdsBySlug[subCategory]
    if (subId == null) {
      setSubjects([])
      setSubjectsLoading(false)
      return undefined
    }

    setSubjectsLoading(true)
    getCategories(subId)
      .then((rows) => {
        if (cancelled) return
        // The fallback response can itself be either a flat array of
        // children, or a single nested row whose `subcategories` we need.
        let source = rows || []
        if (
          source.length === 1 &&
          source[0]?.id === subId &&
          childrenOf(source[0]).length > 0
        ) {
          source = childrenOf(source[0])
        }
        const list = source.map((r) => ({
          id: r.id,
          slug: r.slug,
          label: r.label || r.name || r.slug,
        }))
        setSubjects(list)
      })
      .catch((err) => {
        console.error(
          `[ShopPage] subjects fetch failed for parent_id=${subId}`,
          err,
        )
        if (!cancelled) setSubjects([])
      })
      .finally(() => {
        if (!cancelled) setSubjectsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [mainCategory, subCategory, booksSubcatIdsBySlug, booksSubcatRowsBySlug])

  // Hydrate state from URL once on mount and whenever URL changes externally.
  const lastUrlRef = useRef('')
  useEffect(() => {
    const key = searchParams.toString()
    if (key === lastUrlRef.current) return
    lastUrlRef.current = key

    const mcRaw = (searchParams.get('mainCategory') || '').toLowerCase()
    const mc = mcRaw === 'books' || mcRaw === 'stationery' ? mcRaw : ''
    setMainCategory(mc)
    setSubCategory(searchParams.get('subCategory') || '')
    setItemType(searchParams.get('itemType') || '')
    const s = searchParams.get('search') || ''
    setSearchInput(s)
    setSearchQuery(s)
    const a = searchParams.get('author') || ''
    setAuthorInput(a)
    setAuthorQuery(a)
    setBrand(searchParams.get('brand') || '')
    setMinPrice(Number(searchParams.get('minPrice')) || PRICE_MIN)
    setMaxPrice(Number(searchParams.get('maxPrice')) || PRICE_MAX)
    setCondition(searchParams.get('condition') || '')
    const f = (searchParams.get('filter') || '').toLowerCase()
    const nextFilter = f === 'new' || f === 'deals' ? f : ''
    setFilter(nextFilter)
    if (nextFilter === 'new') setSortBy('Newest')
  }, [searchParams])

  // Debounce author input → authorQuery (300ms)
  useEffect(() => {
    const t = setTimeout(() => setAuthorQuery(authorInput.trim()), 300)
    return () => clearTimeout(t)
  }, [authorInput])

  // Debounce keyword search input → searchQuery (300ms)
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // Sync state → URL (without history spam)
  useEffect(() => {
    const next = new URLSearchParams()
    if (mainCategory) next.set('mainCategory', mainCategory)
    if (subCategory) next.set('subCategory', subCategory)
    if (itemType) next.set('itemType', itemType)
    if (searchQuery) next.set('search', searchQuery)
    if (authorQuery) next.set('author', authorQuery)
    if (brand) next.set('brand', brand)
    if (minPrice !== PRICE_MIN) next.set('minPrice', String(minPrice))
    if (maxPrice !== PRICE_MAX) next.set('maxPrice', String(maxPrice))
    if (condition) next.set('condition', condition)
    if (filter) next.set('filter', filter)
    const str = next.toString()
    if (str !== lastUrlRef.current) {
      lastUrlRef.current = str
      setSearchParams(next, { replace: true })
    }
  }, [
    mainCategory,
    subCategory,
    itemType,
    searchQuery,
    authorQuery,
    brand,
    minPrice,
    maxPrice,
    condition,
    filter,
    setSearchParams,
  ])

  // Fetch products whenever any filter changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    const filters = {
      ...(mainCategory ? { mainCategory } : {}),
      ...(subCategory ? { subCategory } : {}),
      ...(itemType ? { itemType } : {}),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(authorQuery ? { author: authorQuery } : {}),
      ...(brand ? { brand } : {}),
      ...(condition ? { condition } : {}),
      ...(minPrice !== PRICE_MIN ? { minPrice } : {}),
      ...(maxPrice !== PRICE_MAX ? { maxPrice } : {}),
    }
    getProducts(filters)
      .then((rows) => {
        if (cancelled) return
        setProducts(mapProducts(rows))
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.response?.data?.error || 'Failed to load products')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [
    mainCategory,
    subCategory,
    itemType,
    searchQuery,
    authorQuery,
    brand,
    minPrice,
    maxPrice,
    condition,
  ])

  const handleSetMain = useCallback((key) => {
    setMainCategory((prev) => (prev === key ? '' : key))
    setSubCategory('')
    setItemType('')
    setAuthorInput('')
    setAuthorQuery('')
    setBrand('')
  }, [])

  // Reset itemType when subcategory changes (it's no longer valid)
  const handleSetSub = useCallback((next) => {
    setSubCategory(next)
    setItemType('')
  }, [])

  const toggleWishlist = async (id) => {
    const result = await toggleWishlistApi(id)
    if (result?.needsAuth) navigate('/login')
  }

  const clearAll = () => {
    setMainCategory('')
    setSubCategory('')
    setItemType('')
    setSearchInput('')
    setSearchQuery('')
    setAuthorInput('')
    setAuthorQuery('')
    setBrand('')
    setMinPrice(PRICE_MIN)
    setMaxPrice(PRICE_MAX)
    setCondition('')
    setFilter('')
  }

  useEffect(() => {
    if (filtersOpen) {
      requestAnimationFrame(() => setDrawerEnter(true))
      document.body.style.overflow = 'hidden'
    } else {
      setDrawerEnter(false)
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [filtersOpen])

  // Defensive client-side narrowing — guarantees the grid narrows correctly
  // even when the backend has not yet been restarted with the new filter
  // params. Once backend filtering is live these checks are no-ops.
  const narrowedProducts = useMemo(() => {
    const mainLeaves = mainCategory ? leafSlugsForMain(tree, mainCategory) : null
    const subLeaves =
      mainCategory && subCategory
        ? leafSlugsForSubcategory(tree, mainCategory, subCategory)
        : null
    const aq = authorQuery.toLowerCase()
    const sq = searchQuery.toLowerCase()

    return products.filter((p) => {
      const slug = p.categorySlug
      if (mainLeaves && slug && !mainLeaves.has(slug)) return false
      if (subLeaves && slug && !subLeaves.has(slug)) return false
      if (itemType && slug !== itemType && (p.itemType || '').toLowerCase() !== itemType.toLowerCase()) return false
      if (aq && !(p.authorName || p.brand || '').toLowerCase().includes(aq)) return false
      if (sq) {
        const haystack = [p.title, p.authorName, p.brand, p.brandName, p.description, p.isbn]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(sq)) return false
      }
      if (brand) {
        const candidate = (p.brandName || p.publisher || '').toLowerCase()
        if (!candidate.includes(brand.toLowerCase())) return false
      }
      if (condition && p.condition && p.condition !== condition) return false
      if (p.price < minPrice || p.price > maxPrice) return false
      if (filter === 'deals' && p.badge !== 'Sale' && p.oldPrice == null) return false
      return true
    })
  }, [
    products,
    tree,
    mainCategory,
    subCategory,
    itemType,
    searchQuery,
    authorQuery,
    brand,
    condition,
    minPrice,
    maxPrice,
    filter,
  ])

  const sortedProducts = useMemo(() => {
    const list = [...narrowedProducts]
    const tsOf = (p) => (p.created_at ? new Date(p.created_at).getTime() : 0)
    if (sortBy === 'Price: Low to High') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'Price: High to Low') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'Newest') {
      list.sort((a, b) => {
        const diff = tsOf(b) - tsOf(a)
        return diff !== 0 ? diff : b.id - a.id
      })
    }
    return list
  }, [narrowedProducts, sortBy])

  const subcatLabel = (slug) =>
    findSubcategory(tree, mainCategory, slug)?.label || slug
  const itemTypeLabel = (slug) => {
    if (mainCategory === 'books') {
      return subjects.find((s) => s.slug === slug)?.label || slug
    }
    return findItemType(tree, mainCategory, subCategory, slug)?.label || slug
  }

  const activeChips = []
  if (mainCategory)
    activeChips.push({
      label: mainCategory === 'books' ? 'Books' : 'Stationery',
      clear: () => handleSetMain(mainCategory),
    })
  if (filter === 'new')
    activeChips.push({ label: 'New Arrivals', clear: () => setFilter('') })
  if (filter === 'deals')
    activeChips.push({ label: 'Deals', clear: () => setFilter('') })
  if (searchQuery)
    activeChips.push({
      label: `Search: ${searchQuery}`,
      clear: () => {
        setSearchInput('')
        setSearchQuery('')
      },
    })
  if (subCategory)
    activeChips.push({
      label: subcatLabel(subCategory),
      clear: () => {
        setSubCategory('')
        setItemType('')
      },
    })
  if (itemType)
    activeChips.push({ label: itemTypeLabel(itemType), clear: () => setItemType('') })
  if (authorQuery)
    activeChips.push({
      label: `Author: ${authorQuery}`,
      clear: () => {
        setAuthorInput('')
        setAuthorQuery('')
      },
    })
  if (brand) activeChips.push({ label: brand, clear: () => setBrand('') })
  if (minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX)
    activeChips.push({
      label: `GH₵ ${minPrice}–${maxPrice}`,
      clear: () => {
        setMinPrice(PRICE_MIN)
        setMaxPrice(PRICE_MAX)
      },
    })
  if (condition) activeChips.push({ label: condition, clear: () => setCondition('') })

  const filtersProps = {
    tree,
    mainCategories,
    mainCategory,
    setMainCategory: handleSetMain,
    subCategory,
    setSubCategory: handleSetSub,
    itemType,
    setItemType,
    subjects,
    subjectsLoading,
    searchInput,
    setSearchInput,
    authorInput,
    setAuthorInput,
    brand,
    setBrand,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    condition,
    setCondition,
  }

  const mainLabel =
    mainCategories.find((c) => c.key === mainCategory)?.label || 'All Products'

  return (
    <div className="bg-brand-page min-h-screen pb-20 lg:pb-12">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-3 flex items-center gap-2 text-xs text-brand-navy/60">
        <span className="cursor-pointer text-brand-gold">Home</span>
        <span>›</span>
        <span className="font-semibold text-brand-navy">Shop</span>
        <span>›</span>
        <span className="font-semibold text-brand-navy">{mainLabel}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 lg:flex lg:gap-7">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-6 bg-white rounded-2xl shadow-sm p-5 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] font-bold uppercase tracking-[0.06em] text-brand-navy">
                Filters
              </div>
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] font-semibold text-brand-gold hover:underline"
              >
                Clear all
              </button>
            </div>
            <FiltersBody {...filtersProps} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Top bar: result count + sort + mobile filter button */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="text-[13px] text-brand-navy/70">
              {loading ? (
                <span>Loading products…</span>
              ) : error ? (
                <span className="text-error">{error}</span>
              ) : (
                <>
                  Showing{' '}
                  <strong className="text-brand-navy">
                    {sortedProducts.length} products
                  </strong>{' '}
                  <span className="hidden sm:inline">
                    in{' '}
                    <em className="text-brand-navy/80">
                      {filter === 'new'
                        ? 'New Arrivals'
                        : filter === 'deals'
                        ? 'Deals'
                        : mainLabel}
                    </em>
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white border border-brand-line rounded-lg px-3 py-2 text-[13px] font-semibold text-brand-navy"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M6 12h12M10 18h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Filters
                {activeChips.length > 0 && (
                  <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gold text-white text-[10px] font-bold flex items-center justify-center">
                    {activeChips.length}
                  </span>
                )}
              </button>

              <label className="flex items-center gap-2 bg-white border border-brand-line rounded-lg pl-3 pr-2 py-1.5">
                <span className="text-[12px] text-brand-navy/60 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] font-semibold text-brand-navy pr-1"
                >
                  {sortOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeChips.map((c, i) => (
                <ActiveChip key={i} label={c.label} onRemove={c.clear} />
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-[12px] font-semibold text-brand-gold hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product grid */}
          {!loading && !error && sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-brand-navy/60">
              <div className="text-base font-semibold text-brand-navy mb-1">
                No products match your filters.
              </div>
              <button
                type="button"
                onClick={clearAll}
                className="text-[13px] font-semibold text-brand-gold hover:underline mt-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  wishlisted={isWishlisted(p.id)}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom-sheet drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              drawerEnter ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setFiltersOpen(false)}
          />
          <div
            className={`absolute inset-x-0 bottom-0 top-0 bg-white flex flex-col transition-transform duration-300 ease-out ${
              drawerEnter ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {/* Drag handle */}
            <div className="pt-2.5 pb-1.5 flex justify-center">
              <div className="w-10 h-1.5 rounded-full bg-[#d0d4dc]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-brand-line">
              <div className="font-serif text-2xl text-brand-navy">Filters</div>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="w-9 h-9 rounded-full bg-brand-page flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 2l10 10M12 2L2 12"
                    stroke="#444"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <MobileFiltersBody {...filtersProps} />
            </div>

            {/* Fixed footer */}
            <div className="border-t border-brand-line px-5 py-4 pb-6 flex gap-2.5 bg-white">
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 py-3.5 rounded-xl border-[1.5px] border-brand-navy text-brand-navy text-[13px] font-bold"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex-[1.6] py-3.5 rounded-xl bg-brand-gold text-white text-[13px] font-extrabold tracking-wide"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopPage
