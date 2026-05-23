function AnnouncementBarSection({ content }) {
  const text = content?.text || ''
  const bg = content?.bg_color || '#000d1c'
  if (!text) return null
  return (
    <div
      className="text-white text-[11px] sm:text-xs leading-relaxed px-4 pb-2.5 pt-[max(env(safe-area-inset-top),1.25rem)] text-center"
      style={{ backgroundColor: bg }}
    >
      <span className="text-brand-gold mr-1.5">★</span>
      <span>{text}</span>
    </div>
  )
}

export default AnnouncementBarSection
