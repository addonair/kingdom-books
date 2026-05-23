import { useEffect, useRef, useState } from 'react'
import ImageCropDialog from './ImageCropDialog.jsx'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPT_ATTR = 'image/jpeg,image/png,image/webp'
const MAX_BYTES = 5 * 1024 * 1024

// Entry shape: { kind: 'existing', url } | { kind: 'new', file: File, preview: string }

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 8a2 2 0 012-2h2.5l1.5-2h6l1.5 2H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function srcOf(entry) {
  if (!entry) return null
  return entry.kind === 'new' ? entry.preview : entry.url
}

function ImageUploadSlots({ value = [], onChange, maxImages = 3 }) {
  const inputRefs = useRef([])
  // Track every object URL we create so we can revoke them on unmount.
  // Without this, switching between several large images in a single admin
  // session leaks detached image data.
  const objectUrlsRef = useRef(new Set())
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const [error, setError] = useState('')
  const [pendingOversize, setPendingOversize] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)

  useEffect(() => {
    const urls = objectUrlsRef.current
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
      urls.clear()
    }
  }, [])

  const slots = Array.from({ length: maxImages }, (_, i) => value[i] || null)

  function trackUrl(url) {
    objectUrlsRef.current.add(url)
    return url
  }

  function releaseEntry(entry) {
    if (entry && entry.kind === 'new' && entry.preview) {
      objectUrlsRef.current.delete(entry.preview)
      URL.revokeObjectURL(entry.preview)
    }
  }

  function openPicker(i) {
    setError('')
    inputRefs.current[i]?.click()
  }

  function placeEntryAt(i, entry) {
    const next = [...value]
    releaseEntry(next[i])
    next[i] = entry
    // Drop trailing nulls but keep ordering otherwise so slot 0 stays primary.
    onChange(next.filter(Boolean))
  }

  function onFileChange(i, e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG or WEBP images are allowed.')
      return
    }
    if (file.size > MAX_BYTES) {
      setPendingOversize({ file, slotIndex: i })
      setError('Image must be under 5MB — please crop or compress it.')
      return
    }
    const preview = trackUrl(URL.createObjectURL(file))
    placeEntryAt(i, { kind: 'new', file, preview })
    setError('')
  }

  function openCrop() {
    if (!pendingOversize) return
    setCropOpen(true)
  }

  function onCropped(croppedFile) {
    if (!pendingOversize) {
      setCropOpen(false)
      return
    }
    const preview = trackUrl(URL.createObjectURL(croppedFile))
    placeEntryAt(pendingOversize.slotIndex, {
      kind: 'new',
      file: croppedFile,
      preview,
    })
    setPendingOversize(null)
    setCropOpen(false)
    setError('')
  }

  function onCancelCrop() {
    setCropOpen(false)
  }

  function dismissOversize() {
    setPendingOversize(null)
    setError('')
  }

  function removeAt(i) {
    const removed = value[i]
    const next = value.filter((_, idx) => idx !== i)
    releaseEntry(removed)
    onChange(next)
  }

  function onDragStart(i) {
    if (!slots[i]) return
    setDragIdx(i)
  }
  function onDragOver(i, e) {
    if (dragIdx == null) return
    e.preventDefault()
    setOverIdx(i)
  }
  function onDrop(i, e) {
    e.preventDefault()
    if (dragIdx == null || dragIdx === i) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }
    const next = [...value]
    const moved = next[dragIdx]
    if (moved == null) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }
    next.splice(dragIdx, 1)
    const insertAt = Math.min(i, next.length)
    next.splice(insertAt, 0, moved)
    onChange(next.filter(Boolean))
    setDragIdx(null)
    setOverIdx(null)
  }
  function onDragEnd() {
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {slots.map((entry, i) => {
          const src = srcOf(entry)
          const filled = !!entry
          const isPrimary = i === 0 && filled
          const isOver = overIdx === i && dragIdx != null && dragIdx !== i
          return (
            <div
              key={i}
              onDragOver={(e) => onDragOver(i, e)}
              onDrop={(e) => onDrop(i, e)}
              onDragLeave={() => overIdx === i && setOverIdx(null)}
              className={`relative aspect-square rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                isOver
                  ? 'border-brand-gold bg-brand-gold-soft'
                  : filled
                  ? 'border-brand-line bg-white'
                  : 'border-brand-line bg-brand-page hover:border-brand-gold/60'
              }`}
            >
              <input
                ref={(el) => (inputRefs.current[i] = el)}
                type="file"
                accept={ACCEPT_ATTR}
                className="hidden"
                onChange={(e) => onFileChange(i, e)}
              />
              {filled ? (
                <div
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragEnd={onDragEnd}
                  className={`absolute inset-0 cursor-move ${
                    dragIdx === i ? 'opacity-50' : ''
                  }`}
                >
                  <img
                    src={src}
                    alt={`Product image ${i + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {isPrimary && (
                    <span className="absolute top-1.5 left-1.5 bg-brand-gold text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    aria-label="Remove image"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/65 hover:bg-error text-white flex items-center justify-center transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1 1l8 8M9 1L1 9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openPicker(i)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-brand-navy/55 hover:text-brand-gold transition-colors"
                >
                  <CameraIcon />
                  <span className="text-[11px] font-semibold">Add Image</span>
                  {i === 0 && (
                    <span className="text-[9px] uppercase tracking-wider text-brand-navy/40">
                      Primary
                    </span>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-brand-navy/55 mt-2">
        Up to {maxImages} images. JPG, PNG or WEBP, max 5 MB each. Drag to reorder; the first slot is the primary image.
      </p>
      {error && (
        <div className="mt-2 flex flex-wrap items-center gap-2 bg-error-bg text-error border border-error/20 rounded-xl px-3 py-2 text-[12px]">
          <span className="flex-1 min-w-[180px]">{error}</span>
          {pendingOversize && (
            <button
              type="button"
              onClick={openCrop}
              className="bg-brand-gold hover:bg-[#b7830a] text-white font-bold uppercase tracking-wider text-[10px] px-3 h-7 rounded-lg transition-colors"
            >
              Crop
            </button>
          )}
          {pendingOversize && (
            <button
              type="button"
              onClick={dismissOversize}
              className="text-error/80 hover:text-error font-bold uppercase tracking-wider text-[10px] px-2 h-7"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
      <ImageCropDialog
        open={cropOpen}
        file={pendingOversize?.file || null}
        onCancel={onCancelCrop}
        onCropped={onCropped}
      />
    </div>
  )
}

export default ImageUploadSlots
