function AboutSection({ content }) {
  const title = content?.title || 'About Kingdom Books'
  const body =
    content?.body ||
    'Serving the University of Ghana since 1991, we are the campus destination for academic books, stationery, and gifts.'
  const bgColor = content?.bg_color || '#001a36'
  const stats = Array.isArray(content?.stats) ? content.stats.slice(0, 4) : []

  return (
    <section className="pb-10 md:pb-14">
      <div className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div
          className="rounded-2xl p-6 md:p-10 text-white"
          style={{ backgroundColor: bgColor }}
        >
          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 md:gap-10 items-center">
            <div>
              <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-3">
                About us
              </div>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight mb-4">
                {title}
              </h2>
              <p className="text-white/75 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {body}
              </p>
            </div>

            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5"
                  >
                    <div className="font-serif text-3xl md:text-4xl text-brand-gold leading-none mb-2">
                      {s.number}
                    </div>
                    <div className="text-[12px] md:text-[13px] text-white/70 uppercase tracking-wider">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
