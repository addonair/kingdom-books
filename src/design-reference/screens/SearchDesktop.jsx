
// Screen 2: Search Results / Catalogue — Desktop View (Kingdom Books)
// Stationery & Supplies category showcase
function SearchDesktop({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const [priceRange, setPriceRange] = React.useState(150);
  const [selectedCategory, setSelectedCategory] = React.useState('Stationery & Supplies');
  const [selectedSubcat, setSelectedSubcat] = React.useState('Writing Instruments');
  const [selectedBrands, setSelectedBrands] = React.useState(['Bic', 'Staedtler']);
  const [selectedCondition, setSelectedCondition] = React.useState('New');
  const [sortBy, setSortBy] = React.useState('Relevance');

  const categories = [
    'Business', 'Science', 'Humanities', 'Vocational', 'General Books',
    'Stationery & Supplies', 'Gifts & Novelties',
  ];
  const subcatsByCat = {
    Business: ['Accounting', 'Marketing', 'Finance', 'Economics', 'Management'],
    Science: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'Engineering'],
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

  const toggleBrand = (b) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  // Stationery products — colored "package" placeholders + product details
  const products = [
    { id: 1, name: 'Leuchtturm1917 A5 Hardcover Notebook', brand: 'Leuchtturm', tag: 'Paper & Notebooks',  price: 95, rating: 4.9, reviews: 412, color: '#1a4a8a', accent: '#fff', shape: 'notebook' },
    { id: 2, name: 'Casio FX-991EX Scientific Calculator', brand: 'Casio',      tag: 'Office Supplies',     price: 220, rating: 4.8, reviews: 1820, color: '#2a2a2a', accent: gold, shape: 'calculator' },
    { id: 3, name: 'Parker Jotter Ballpoint Pen — Stainless Steel', brand: 'Parker', tag: 'Writing Instruments', price: 145, rating: 4.7, reviews: 384, color: '#7a8290', accent: '#d4d4d4', shape: 'pen' },
    { id: 4, name: 'A4 Multipurpose Paper · 500 sheets · 80gsm', brand: 'Hi-Bright', tag: 'Paper & Notebooks',  price: 48, rating: 4.5, reviews: 612, color: '#f5f5f0', accent: '#888', shape: 'ream' },
    { id: 5, name: 'Staedtler Triplus Fineliner — Set of 10', brand: 'Staedtler', tag: 'Art & Drawing',        price: 92, rating: 4.9, reviews: 728, color: '#c0392b', accent: gold, shape: 'markers' },
    { id: 6, name: 'Bic Cristal Original Ballpoint — Pack of 12', brand: 'Bic',     tag: 'Writing Instruments', price: 28, rating: 4.6, reviews: 2104, color: '#f0c040', accent: navy, shape: 'pen' },
  ];

  const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="11" height="11" viewBox="0 0 12 12">
          <path d="M6 1l1.4 3h3.1l-2.5 1.9.9 3L6 7.2 3.1 8.9l.9-3L1.5 4H4.6L6 1z" fill={s <= Math.round(rating) ? gold : '#e0e0e0'}/>
        </svg>
      ))}
    </div>
  );

  // Iconographic placeholder per product type
  const ProductIcon = ({ p }) => {
    const isLight = p.color === '#f5f5f0' || p.color === '#f0c040';
    return (
      <div style={{
        background: `linear-gradient(145deg, ${p.color}, ${p.color}dd)`,
        height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 8px, transparent 8px 16px)' }}/>
        {p.shape === 'notebook' && (
          <div style={{ width: 80, height: 100, background: p.color === '#1a4a8a' ? '#0d3060' : p.color, borderRadius: '3px 8px 8px 3px', boxShadow: '4px 4px 12px rgba(0,0,0,0.25), inset -3px 0 6px rgba(0,0,0,0.3)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: 'rgba(0,0,0,0.3)' }}/>
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${p.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: p.accent, fontWeight: 700 }}>L</div>
          </div>
        )}
        {p.shape === 'calculator' && (
          <div style={{ width: 70, height: 110, background: '#1a1a1a', borderRadius: 6, padding: 6, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}>
            <div style={{ background: '#a8b89a', height: 24, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 4px', fontSize: 8, color: '#222', fontFamily: 'monospace' }}>0.</div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {Array.from({length: 16}).map((_, i) => <div key={i} style={{ background: i === 15 ? gold : '#3a3a3a', borderRadius: 1 }}/>)}
            </div>
          </div>
        )}
        {p.shape === 'pen' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: 'rotate(-25deg)' }}>
            <div style={{ width: 12, height: 90, background: `linear-gradient(180deg, ${p.color === '#f0c040' ? '#fff' : '#aaa'} 0%, ${p.accent} 30%, ${p.accent} 100%)`, borderRadius: '6px 6px 2px 2px', boxShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}/>
            <div style={{ width: 4, height: 12, background: p.accent, borderRadius: '0 0 2px 2px' }}/>
          </div>
        )}
        {p.shape === 'ream' && (
          <div style={{ width: 90, height: 70, background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.15), inset 0 -8px 0 #e8e8e8, inset 0 -16px 0 #f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#888', letterSpacing: '0.1em' }}>A4</div>
        )}
        {p.shape === 'markers' && (
          <div style={{ display: 'flex', gap: 3 }}>
            {['#c0392b', '#1a7a4a', '#1a4a8a', '#7c3d9e', gold].map((c, i) => (
              <div key={i} style={{ width: 8, height: 70, background: `linear-gradient(180deg, ${c}, ${c}cc)`, borderRadius: '2px 2px 4px 4px', boxShadow: '1px 1px 3px rgba(0,0,0,0.3)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -8, left: 0, right: 0, height: 12, background: c, borderRadius: '50% 50% 2px 2px' }}/>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: bg, height: '100%', overflowY: 'auto', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Top nav */}
      <div style={{ background: navy, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
              <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" strokeLinejoin="round" fill={navy}/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 14, lineHeight: 1.1 }}>Kingdom Books</span>
            <span style={{ color: gold, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>& Stationery · UG</span>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', margin: '0 12px' }}/>
          {['Browse', 'New Arrivals', 'Stationery', 'Gifts', 'Deals'].map(l => (
            <span key={l} style={{ color: l === 'Stationery' ? gold : 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', padding: '0 4px', fontWeight: l === 'Stationery' ? 700 : 400 }}>{l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, width: 240 }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8"/>
              <path d="M12.5 12.5L16 16" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Search products…</span>
          </div>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('checkout')}>
            <svg width="22" height="20" viewBox="0 0 26 24" fill="none">
              <path d="M1 1h3.5l2.2 11h12.6l2.2-11H22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="21" r="2" fill="#fff"/><circle cx="18" cy="21" r="2" fill="#fff"/>
            </svg>
            <div style={{ position: 'absolute', top: -4, right: -6, width: 16, height: 16, borderRadius: '50%', background: gold, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '12px 32px', display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#666' }}>
        <span onClick={() => onNavigate && onNavigate('home')} style={{ cursor: 'pointer', color: gold }}>Home</span>
        <span>›</span>
        <span style={{ cursor: 'pointer', color: gold }}>{selectedCategory}</span>
        <span>›</span>
        <span style={{ color: navy, fontWeight: 600 }}>{selectedSubcat}</span>
      </div>

      <div style={{ display: 'flex', gap: 0, padding: '0 32px 32px' }}>
        {/* Sidebar */}
        <div style={{ width: 240, flexShrink: 0, marginRight: 28 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: navy, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11 }}>Filters</div>
              <span style={{ fontSize: 10, color: gold, fontWeight: 600, cursor: 'pointer' }}>Clear all</span>
            </div>
            <div style={{ fontSize: 10, color: '#999', fontStyle: 'italic', marginBottom: 16, lineHeight: 1.4 }}>
              Filters change based on selected category.
            </div>

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 8 }}>Category</div>
              {categories.map(c => (
                <div
                  key={c}
                  onClick={() => { setSelectedCategory(c); setSelectedSubcat((subcatsByCat[c] || [])[0]); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}
                >
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: `2px solid ${selectedCategory === c ? gold : '#ccc'}`,
                    background: selectedCategory === c ? gold : 'transparent', flexShrink: 0,
                  }}/>
                  <span style={{ fontSize: 12, color: selectedCategory === c ? gold : '#555', fontWeight: selectedCategory === c ? 700 : 400 }}>{c}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: '#eee', margin: '0 -4px 16px' }}/>

            {/* Sub-category */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 8 }}>Sub-category</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(subcatsByCat[selectedCategory] || []).map(s => (
                  <div
                    key={s}
                    onClick={() => setSelectedSubcat(s)}
                    style={{
                      padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                      background: selectedSubcat === s ? '#fffbf0' : 'transparent',
                      color: selectedSubcat === s ? navy : '#555',
                      fontSize: 12, fontWeight: selectedSubcat === s ? 700 : 400,
                      border: `1px solid ${selectedSubcat === s ? gold : 'transparent'}`,
                    }}
                  >{s}</div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#eee', margin: '0 -4px 16px' }}/>

            {/* Brand */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 8 }}>Brand</div>
              {brands.map(b => (
                <div
                  key={b}
                  onClick={() => toggleBrand(b)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}
                >
                  <div style={{
                    width: 14, height: 14, borderRadius: 4,
                    border: `2px solid ${selectedBrands.includes(b) ? gold : '#ccc'}`,
                    background: selectedBrands.includes(b) ? gold : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selectedBrands.includes(b) && <svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 12, color: selectedBrands.includes(b) ? navy : '#555' }}>{b}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: '#eee', margin: '0 -4px 16px' }}/>

            {/* Condition */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 8 }}>Condition</div>
              {conditions.map(c => (
                <div
                  key={c}
                  onClick={() => setSelectedCondition(c)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}
                >
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: `2px solid ${selectedCondition === c ? gold : '#ccc'}`,
                    background: selectedCondition === c ? gold : 'transparent', flexShrink: 0,
                  }}/>
                  <span style={{ fontSize: 12, color: selectedCondition === c ? navy : '#555' }}>{c}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: '#eee', margin: '0 -4px 16px' }}/>

            {/* Price Range */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>Price Range</span>
                <span style={{ color: gold, fontWeight: 600 }}>GH₵ {priceRange}</span>
              </div>
              <input
                type="range" min={20} max={300} value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: gold, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginTop: 4 }}>
                <span>GH₵ 20</span><span>GH₵ 300</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#666' }}>
              Showing <strong style={{ color: navy }}>48 products</strong> in <em>{selectedCategory} › {selectedSubcat}</em>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#888' }}>Sort by:</span>
              {['Relevance', 'Price Low–High', 'Newest'].map(s => (
                <div
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                    background: sortBy === s ? navy : '#fff',
                    color: sortBy === s ? '#fff' : '#555',
                    border: `1.5px solid ${sortBy === s ? navy : '#ddd'}`,
                    fontWeight: sortBy === s ? 600 : 400,
                  }}
                >{s}</div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {products.map(p => (
              <div
                key={p.id}
                onClick={() => onNavigate && onNavigate('product')}
                style={{
                  background: '#fff', borderRadius: 14,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
                }}
              >
                <ProductIcon p={p}/>
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#f0f4ff', color: navy,
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                    padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
                    marginBottom: 6,
                  }}>{p.tag}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: navy, marginBottom: 3, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#777', marginBottom: 6 }}>{p.brand}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <StarRating rating={p.rating} />
                    <span style={{ fontSize: 10, color: '#999' }}>({p.reviews})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: gold }}>GH₵ {p.price}</div>
                    <div
                      onClick={e => { e.stopPropagation(); onNavigate && onNavigate('checkout'); }}
                      style={{ background: navy, color: '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >Add to Cart</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SearchDesktop });
