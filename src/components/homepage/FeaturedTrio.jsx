import { Link } from 'react-router-dom'

const FEATURED_TRIO = [
  {
    title: 'New Arrivals',
    eyebrow: 'This Semester',
    desc: 'Fresh stock for the new academic year — required texts and recommended reading.',
    cta: 'Browse new',
    link: '/shop?filter=new',
    fallbackBg: 'linear-gradient(135deg, #001a36 0%, #002a5c 100%)',
    accent: '#C9920A',
  },
  {
    title: 'Stationery & Gifts',
    eyebrow: 'Everyday Essentials',
    desc: 'Notebooks, pens, planners and thoughtful gifts — curated for campus life.',
    cta: 'Shop stationery',
    link: '/shop?mainCategory=stationery',
    fallbackBg: 'linear-gradient(135deg, #C9920A 0%, #e6a80f 100%)',
    accent: '#001a36',
  },
  {
    title: 'Signed & Collectible',
    eyebrow: 'Limited Editions',
    desc: 'First editions, signed copies and rare finds from Ghanaian and African authors.',
    cta: 'See collection',
    link: '/shop',
    fallbackBg: 'linear-gradient(135deg, #1a4a8a 0%, #2d5fa6 100%)',
    accent: '#C9920A',
  },
]

function FeaturedTrio({ content }) {
  const images = Array.isArray(content?.images) ? content.images.filter(Boolean) : []

  return (
    <section className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-10 md:pb-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {FEATURED_TRIO.map((card, i) => {
          const img = images[i]
          const cardStyle = img
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.44)), url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: card.fallbackBg }

          return (
            <Link
              key={card.title}
              to={card.link}
              className="group relative overflow-hidden rounded-2xl p-5 md:p-6 text-white min-h-[170px] md:min-h-[190px] flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
              style={cardStyle}
            >
              <div>
                <div
                  className="text-[11px] uppercase tracking-[0.16em] font-bold mb-2"
                  style={{ color: img ? '#C9920A' : card.accent }}
                >
                  {card.eyebrow}
                </div>
                <div className="font-serif text-2xl md:text-[22px] leading-tight">{card.title}</div>
                <p className="text-white/80 text-[13px] mt-2 max-w-xs">{card.desc}</p>
              </div>
              <div
                className="text-[13px] font-bold inline-flex items-center gap-1.5 mt-4 group-hover:gap-2.5 transition-all"
                style={{ color: img ? '#C9920A' : card.accent }}
              >
                {card.cta} <span>→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedTrio
