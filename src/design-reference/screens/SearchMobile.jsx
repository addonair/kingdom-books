
// Screen 2 (Mobile): Search Results — Mobile View (Kingdom Books · Stationery)
function SearchMobile({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const [query, setQuery] = React.useState('pens & notebooks');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [drawerEnter, setDrawerEnter] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('Stationery & Supplies');
  const [selectedSubcats, setSelectedSubcats] = React.useState(['Writing Instruments']);
  const [selectedBrands, setSelectedBrands] = React.useState(['Bic', 'Staedtler']);
  const [condition, setCondition] = React.useState('New');
  const [priceMin, setPriceMin] = React.useState(20);
  const [priceMax, setPriceMax] = React.useState(220);
  const [sortBy, setSortBy] = React.useState('Relevance');
  const [sortOpen, setSortOpen] = React.useState(false);

  // Animate the drawer in/out
  React.useEffect(() => {
    if (filtersOpen) {
      requestAnimationFrame(() => setDrawerEnter(true));
    } else {
      setDrawerEnter(false);
    }
  }, [filtersOpen]);

  const categories = [
    'Business', 'Science', 'Humanities', 'Vocational', 'General Books',
    'Stationery & Supplies', 'Gifts & Novelties',
  ];
  const subcatsByCat = {
    Business: ['Accounting', 'Marketing', 'Finance', 'Economics', 'Management'],
    Science: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
    Humanities: ['History', 'Philosophy', 'Literature', 'Linguistics'],
    Vocational: ['Agriculture', 'Catering', 'Tailoring'],
    'General Books': ['Fiction', 'Biography', 'Self-help', 'Reference'],
    'Stationery & Supplies': [
      'Writing Instruments', 'Paper & Notebooks', 'Office & School Supplies',
      'Filing & Organisation', 'Art & Drawing', 'Planners & Calendars',
    ],
    'Gifts & Novelties': ['UG Branded', 'Greeting Cards', 'Wrapping', 'Trinkets'],
  };
  const brands = ['Bic', 'Staedtler', 'Faber-Castell', 'Parker', 'Casio'];
  const conditions = ['New', 'Used — Good', 'Remaindered'];

  const toggleSubcat = (s) =>
    setSelectedSubcats(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleBrand = (b) =>
    setSelectedBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]);

  // Stationery product data
  const products = [
    { id: 1, name: 'Leuchtturm1917 A5 Dotted Notebook', brand: 'Leuchtturm', tag: 'Paper & Notebooks',  price: 65, oldPrice: 78, color: '#1a4a8a', accent: '#fff', shape: 'notebook', rating: 4.9, reviews: 412 },
    { id: 2, name: 'Casio FX-991EX Scientific Calculator', brand: 'Casio',     tag: 'Office Supplies',     price: 120, oldPrice: 140, color: '#2a2a2a', accent: gold,  shape: 'calculator', rating: 4.8, reviews: 1820 },
    { id: 3, name: 'Parker Jotter Ballpoint Pen', brand: 'Parker',             tag: 'Writing Instruments', price: 38, oldPrice: 48, color: '#7a8290', accent: '#d4d4d4', shape: 'pen', rating: 4.7, reviews: 384 },
    { id: 4, name: 'A4 Multipurpose Paper · 500 sheets · 80gsm', brand: 'Hi-Bright', tag: 'Paper & Notebooks',  price: 45, oldPrice: null, color: '#f5f5f0', accent: '#888', shape: 'ream', rating: 4.5, reviews: 612 },
    { id: 5, name: 'Staedtler Triplus Fineliner — Set of 10', brand: 'Staedtler', tag: 'Art & Drawing',        price: 72, oldPrice: 88, color: '#c0392b', accent: gold,  shape: 'markers', rating: 4.9, reviews: 728 },
  ];

  const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="9" height="9" viewBox="0 0 12 12">
          <path d="M6 1l1.4 3h3.1l-2.5 1.9.9 3L6 7.2 3.1 8.9l.9-3L1.5 4H4.6L6 1z" fill={s <= Math.round(rating) ? gold : '#e0e0e0'}/>
        </svg>
      ))}
    </div>
  );

  // Compact product icon for mobile cards
  const ProductIcon = ({ p }) => (
    <div style={{
      width: 80, height: 110, borderRadius: 6, flexShrink: 0,
      background: `linear-gradient(145deg, ${p.color}, ${p.color}dd)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      boxShadow: '2px 2px 6px rgba(0,0,0,0.15)',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 6px, transparent 6px 12px)' }}/>
      {p.shape === 'notebook' && (
        <div style={{ width: 48, height: 70, background: p.color === '#1a4a8a' ? '#0d3060' : p.color, borderRadius: '2px 5px 5px 2px', boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: 'rgba(0,0,0,0.3)' }}/>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1.2px solid ${p.accent}`, color: p.accent, fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>L</div>
        </div>
      )}
      {p.shape === 'calculator' && (
        <div style={{ width: 44, height: 76, background: '#1a1a1a', borderRadius: 4, padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ background: '#a8b89a', height: 14, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 3px', fontSize: 6, fontFamily: 'monospace', color: '#222' }}>0.</div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
            {Array.from({length: 16}).map((_, i) => <div key={i} style={{ background: i === 15 ? gold : '#3a3a3a', borderRadius: 0.5 }}/>)}
          </div>
        </div>
      )}
      {p.shape === 'pen' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transform: 'rotate(-22deg)' }}>
          <div style={{ width: 8, height: 60, background: `linear-gradient(180deg, #aaa 0%, ${p.accent} 30%, ${p.accent} 100%)`, borderRadius: '4px 4px 1.5px 1.5px', boxShadow: '1.5px 1.5px 4px rgba(0,0,0,0.3)' }}/>
          <div style={{ width: 3, height: 8, background: p.accent, borderRadius: '0 0 1.5px 1.5px' }}/>
        </div>
      )}
      {p.shape === 'ream' && (
        <div style={{ width: 60, height: 48, background: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.15), inset 0 -5px 0 #e8e8e8, inset 0 -10px 0 #f5f5f5', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#888', letterSpacing: '0.1em' }}>A4</div>
      )}
      {p.shape === 'markers' && (
        <div style={{ display: 'flex', gap: 2 }}>
          {['#c0392b', '#1a7a4a', '#1a4a8a', '#7c3d9e', gold].map((c, i) => (
            <div key={i} style={{ width: 5, height: 50, background: `linear-gradient(180deg, ${c}, ${c}cc)`, borderRadius: '1px 1px 2.5px 2.5px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -5, left: 0, right: 0, height: 8, background: c, borderRadius: '50% 50% 1.5px 1.5px' }}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: bg, minHeight: '100%', fontFamily: '"DM Sans", sans-serif', position: 'relative', paddingBottom: 80, overflow: 'hidden' }}>
      {/* Sticky header */}
      <div style={{ background: navy, padding: '52px 16px 14px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button
            onClick={() => onNavigate && onNavigate('home')}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8"/>
              <path d="M12.5 12.5L16 16" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}
            />
            {query && (
              <span onClick={() => setQuery('')} style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>×</span>
            )}
          </div>
          <div onClick={() => onNavigate && onNavigate('checkout')} style={{ position: 'relative', cursor: 'pointer' }}>
            <svg width="22" height="20" viewBox="0 0 26 24" fill="none">
              <path d="M1 1h3.5l2.2 11h12.6l2.2-11H22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="21" r="2" fill="#fff"/>
              <circle cx="18" cy="21" r="2" fill="#fff"/>
            </svg>
            <div style={{ position: 'absolute', top: -4, right: -6, width: 16, height: 16, borderRadius: '50%', background: gold, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.65)', overflow: 'hidden' }}>
          <span style={{ color: gold }}>Home</span>
          <span>›</span>
          <span style={{ color: gold }}>{selectedCategory}</span>
          <span>›</span>
          <span style={{ color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {selectedSubcats[0] || 'All'}
          </span>
        </div>
      </div>

      {/* Result count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
        <div style={{ fontSize: 12, color: '#666' }}>
          <span style={{ fontWeight: 700, color: navy }}>{products.length} of 184 products</span>
        </div>
      </div>

      {/* Filter / sort buttons */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', position: 'relative' }}>
        <button
          onClick={() => setFiltersOpen(true)}
          style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 10, background: '#fff', color: navy, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M6 12h12M10 18h4" stroke={navy} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Filters
          <span style={{ background: gold, color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 10, padding: '1px 6px' }}>
            {1 + selectedSubcats.length + selectedBrands.length + 1}
          </span>
        </button>
        <button
          onClick={() => setSortOpen(!sortOpen)}
          style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 10, background: '#fff', color: navy, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" stroke={navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sort: {sortBy}
        </button>
        {sortOpen && (
          <div style={{ position: 'absolute', top: '100%', right: 16, marginTop: 4, background: '#fff', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 20, minWidth: 160 }}>
            {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest'].map(s => (
              <div
                key={s}
                onClick={() => { setSortBy(s); setSortOpen(false); }}
                style={{ padding: '10px 14px', fontSize: 12, color: sortBy === s ? gold : navy, fontWeight: sortBy === s ? 700 : 500, cursor: 'pointer', borderBottom: '1px solid #f3f3f3' }}
              >{s}</div>
            ))}
          </div>
        )}
      </div>

      {/* Active filter chips */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px', overflowX: 'auto' }}>
        {[selectedCategory, ...selectedSubcats, condition].map(chip => (
          <div key={chip} style={{ background: navy, color: '#fff', borderRadius: 14, padding: '5px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            {chip}
            <span style={{ opacity: 0.7 }}>×</span>
          </div>
        ))}
      </div>

      {/* Product list — vertical cards (NO required reading badge for stationery) */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.map(p => (
          <div
            key={p.id}
            onClick={() => onNavigate && onNavigate('product')}
            style={{ background: '#fff', borderRadius: 14, padding: 12, display: 'flex', gap: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', cursor: 'pointer', position: 'relative' }}
          >
            <ProductIcon p={p} />

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ alignSelf: 'flex-start', background: '#f0f4ff', color: navy, fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', marginBottom: 6 }}>
                {p.tag}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: navy, lineHeight: 1.25, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {p.name}
              </div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{p.brand}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <StarRating rating={p.rating} />
                <span style={{ fontSize: 10, color: '#888' }}>{p.rating} ({p.reviews})</span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontWeight: 800, color: gold, fontSize: 14 }}>GH₵ {p.price}</span>
                  {p.oldPrice && <span style={{ fontSize: 10, color: '#aaa', textDecoration: 'line-through' }}>GH₵ {p.oldPrice}</span>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  style={{ background: navy, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >+ Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', padding: '10px 16px 18px', display: 'flex', justifyContent: 'space-around' }}>
        {[
          { id: 'home', label: 'Home', active: false },
          { id: 'search', label: 'Search', active: true },
          { id: 'orders', label: 'Orders', active: false },
          { id: 'account', label: 'Account', active: false },
        ].map(nav => (
          <div key={nav.id} onClick={() => onNavigate && nav.id === 'home' && onNavigate('home')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', color: nav.active ? gold : '#888' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {nav.id === 'home' && <path d="M3 12l9-9 9 9M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
              {nav.id === 'search' && <><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/><path d="M16 16l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>}
              {nav.id === 'orders' && <path d="M5 4h14v16H5V4zM9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
              {nav.id === 'account' && <><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>}
            </svg>
            <span style={{ fontSize: 10, fontWeight: nav.active ? 700 : 500 }}>{nav.label}</span>
          </div>
        ))}
      </div>

      {/* ──────────── FULL-HEIGHT FILTER DRAWER ──────────── */}
      {filtersOpen && (
        <div
          onClick={() => setFiltersOpen(false)}
          style={{
            position: 'absolute', inset: 0, zIndex: 30,
            background: drawerEnter ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
            transition: 'background 0.25s ease',
            display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              width: '100%',
              height: '95%',
              borderRadius: '20px 20px 0 0',
              display: 'flex', flexDirection: 'column',
              transform: drawerEnter ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
            }}
          >
            {/* Drag handle */}
            <div style={{ padding: '10px 0 6px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 40, height: 5, borderRadius: 3, background: '#d0d4dc' }}/>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 20px 14px', borderBottom: '1px solid #eef0f4' }}>
              <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: navy }}>Filters</div>
              <button
                onClick={() => setFiltersOpen(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="#444" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Subject Category — pill chips */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Subject Category</div>
                <div style={{ height: 1, background: '#eef0f4', marginBottom: 12 }}/>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {categories.map(c => (
                    <div
                      key={c}
                      onClick={() => {
                        setSelectedCategory(c);
                        // reset subcats when category changes
                        setSelectedSubcats([]);
                      }}
                      style={{
                        padding: '8px 14px', borderRadius: 20,
                        border: `1.5px solid ${selectedCategory === c ? gold : '#dde1e8'}`,
                        background: selectedCategory === c ? gold : '#fff',
                        color: selectedCategory === c ? '#fff' : '#444',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >{c}</div>
                  ))}
                </div>
              </div>

              {/* Sub-category — checkbox list */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Sub-category</div>
                <div style={{ height: 1, background: '#eef0f4', marginBottom: 12 }}/>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(subcatsByCat[selectedCategory] || []).map(s => (
                    <div
                      key={s}
                      onClick={() => toggleSubcat(s)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', cursor: 'pointer' }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: 5,
                        border: `2px solid ${selectedSubcats.includes(s) ? gold : '#cdd2da'}`,
                        background: selectedSubcats.includes(s) ? gold : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {selectedSubcats.includes(s) && <svg width="12" height="9" viewBox="0 0 12 9"><path d="M1 4.5L4.5 8 11 1.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontSize: 14, color: selectedSubcats.includes(s) ? navy : '#444', fontWeight: selectedSubcats.includes(s) ? 600 : 400 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand — checkbox list */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Brand</div>
                <div style={{ height: 1, background: '#eef0f4', marginBottom: 12 }}/>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {brands.map(b => (
                    <div
                      key={b}
                      onClick={() => toggleBrand(b)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', cursor: 'pointer' }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: 5,
                        border: `2px solid ${selectedBrands.includes(b) ? gold : '#cdd2da'}`,
                        background: selectedBrands.includes(b) ? gold : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {selectedBrands.includes(b) && <svg width="12" height="9" viewBox="0 0 12 9"><path d="M1 4.5L4.5 8 11 1.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontSize: 14, color: selectedBrands.includes(b) ? navy : '#444', fontWeight: selectedBrands.includes(b) ? 600 : 400 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition — radio buttons */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Condition</div>
                <div style={{ height: 1, background: '#eef0f4', marginBottom: 12 }}/>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {conditions.map(c => (
                    <div
                      key={c}
                      onClick={() => setCondition(c)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', cursor: 'pointer' }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: `2px solid ${condition === c ? gold : '#cdd2da'}`,
                        background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {condition === c && <div style={{ width: 10, height: 10, borderRadius: '50%', background: gold }}/>}
                      </div>
                      <span style={{ fontSize: 14, color: condition === c ? navy : '#444', fontWeight: condition === c ? 600 : 400 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range — dual handle slider */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Price Range</span>
                  <span style={{ color: gold, fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>GH₵ {priceMin} – GH₵ {priceMax}</span>
                </div>
                <div style={{ height: 1, background: '#eef0f4', marginBottom: 16 }}/>
                <DualRangeSlider
                  min={20}
                  max={300}
                  valueMin={priceMin}
                  valueMax={priceMax}
                  onChange={(lo, hi) => { setPriceMin(lo); setPriceMax(hi); }}
                  gold={gold}
                  navy={navy}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginTop: 12 }}>
                  <span>GH₵ 20</span>
                  <span>GH₵ 300</span>
                </div>
              </div>
            </div>

            {/* Fixed footer — Clear + Apply */}
            <div style={{ borderTop: '1px solid #eef0f4', padding: '14px 20px 22px', display: 'flex', gap: 10, background: '#fff' }}>
              <button
                onClick={() => {
                  setSelectedSubcats([]);
                  setSelectedBrands([]);
                  setCondition('New');
                  setPriceMin(20);
                  setPriceMax(300);
                }}
                style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1.5px solid ${navy}`, background: '#fff', color: navy, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >Clear All</button>
              <button
                onClick={() => setFiltersOpen(false)}
                style={{ flex: 1.6, padding: '14px', border: 'none', borderRadius: 12, background: gold, color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em' }}
              >Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dual-handle range slider — touch & mouse
function DualRangeSlider({ min, max, valueMin, valueMax, onChange, gold, navy }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(null); // 'lo' | 'hi' | null

  const pct = (v) => ((v - min) / (max - min)) * 100;

  const handleMove = React.useCallback((clientX) => {
    if (!dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const v = Math.round(min + ratio * (max - min));
    if (dragging === 'lo') onChange(Math.min(v, valueMax - 5), valueMax);
    else                    onChange(valueMin, Math.max(v, valueMin + 5));
  }, [dragging, min, max, valueMin, valueMax, onChange]);

  React.useEffect(() => {
    if (!dragging) return;
    const onMM = (e) => handleMove(e.clientX);
    const onTM = (e) => handleMove(e.touches[0].clientX);
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup',  onUp);
    window.addEventListener('touchmove', onTM);
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onTM);
      window.removeEventListener('touchend',  onUp);
    };
  }, [dragging, handleMove]);

  return (
    <div ref={trackRef} style={{ position: 'relative', height: 28, padding: '12px 0', userSelect: 'none' }}>
      {/* Track */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 4, background: '#e6e8ee', borderRadius: 2 }}/>
      {/* Active range */}
      <div style={{ position: 'absolute', top: 12, height: 4, background: gold, borderRadius: 2, left: pct(valueMin)+'%', right: (100 - pct(valueMax))+'%' }}/>
      {/* Handles */}
      {[
        { which: 'lo', val: valueMin },
        { which: 'hi', val: valueMax },
      ].map(h => (
        <div
          key={h.which}
          onMouseDown={() => setDragging(h.which)}
          onTouchStart={() => setDragging(h.which)}
          style={{
            position: 'absolute', top: 4, left: `calc(${pct(h.val)}% - 11px)`,
            width: 22, height: 22, borderRadius: '50%',
            background: '#fff', border: `2.5px solid ${gold}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            cursor: 'grab',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: gold }}/>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { SearchMobile });
