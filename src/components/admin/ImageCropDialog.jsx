import { useEffect, useRef, useState } from 'react'
import Modal from '../Modal.jsx'

const MAX_OUTPUT_DIM = 1600
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024
const QUALITY_STEPS = [0.85, 0.7, 0.55, 0.4]

// Canvas may refuse to encode at the first quality if the result still
// exceeds 5 MB. Step the quality down until we get a small-enough blob,
// or give up after the last step and return whatever we have — at 1600 px
// longest side and q=0.4 a realistic photo lands well below the cap.
function encodeJpegUnderLimit(canvas) {
  return new Promise((resolve) => {
    let i = 0
    function tryNext() {
      const q = QUALITY_STEPS[i] ?? QUALITY_STEPS[QUALITY_STEPS.length - 1]
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(null)
          if (blob.size <= MAX_OUTPUT_BYTES || i >= QUALITY_STEPS.length - 1) {
            return resolve(blob)
          }
          i += 1
          tryNext()
        },
        'image/jpeg',
        q,
      )
    }
    tryNext()
  })
}

function ImageCropDialog({ open, file, onCancel, onCropped }) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const [box, setBox] = useState(null)
  const [drag, setDrag] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!open || !file) {
      setImgUrl(null)
      setImgSize({ w: 0, h: 0 })
      setBox(null)
      setErr('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setImgUrl(url)
    setErr('')
    return () => URL.revokeObjectURL(url)
  }, [open, file])

  function onImgLoad(e) {
    const naturalW = e.target.naturalWidth
    const naturalH = e.target.naturalHeight
    const displayedW = e.target.clientWidth
    const displayedH = e.target.clientHeight
    setImgSize({ w: displayedW, h: displayedH, naturalW, naturalH })
    const side = Math.round(Math.min(displayedW, displayedH) * 0.8)
    setBox({
      x: Math.round((displayedW - side) / 2),
      y: Math.round((displayedH - side) / 2),
      w: side,
      h: side,
    })
  }

  function clampBox(next) {
    const maxW = imgSize.w
    const maxH = imgSize.h
    const w = Math.max(40, Math.min(next.w, maxW))
    const h = Math.max(40, Math.min(next.h, maxH))
    const x = Math.max(0, Math.min(next.x, maxW - w))
    const y = Math.max(0, Math.min(next.y, maxH - h))
    return { x, y, w, h }
  }

  function onPointerDown(mode, e) {
    if (!box) return
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDrag({
      mode,
      startX: e.clientX,
      startY: e.clientY,
      box: { ...box },
      pointerId: e.pointerId,
      target: e.currentTarget,
    })
  }

  function onPointerMove(e) {
    if (!drag || !box) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    let next = { ...drag.box }
    switch (drag.mode) {
      case 'move':
        next.x = drag.box.x + dx
        next.y = drag.box.y + dy
        break
      case 'nw':
        next.x = drag.box.x + dx
        next.y = drag.box.y + dy
        next.w = drag.box.w - dx
        next.h = drag.box.h - dy
        break
      case 'ne':
        next.y = drag.box.y + dy
        next.w = drag.box.w + dx
        next.h = drag.box.h - dy
        break
      case 'sw':
        next.x = drag.box.x + dx
        next.w = drag.box.w - dx
        next.h = drag.box.h + dy
        break
      case 'se':
        next.w = drag.box.w + dx
        next.h = drag.box.h + dy
        break
      default:
        break
    }
    setBox(clampBox(next))
  }

  function onPointerUp() {
    if (drag) {
      drag.target?.releasePointerCapture?.(drag.pointerId)
    }
    setDrag(null)
  }

  async function handleConfirm() {
    if (!box || !imgRef.current || !file) return
    setBusy(true)
    setErr('')
    try {
      const scale = imgSize.naturalW / imgSize.w
      const sx = Math.round(box.x * scale)
      const sy = Math.round(box.y * scale)
      const sw = Math.round(box.w * scale)
      const sh = Math.round(box.h * scale)
      const longest = Math.max(sw, sh)
      const outScale = longest > MAX_OUTPUT_DIM ? MAX_OUTPUT_DIM / longest : 1
      const dw = Math.max(1, Math.round(sw * outScale))
      const dh = Math.max(1, Math.round(sh * outScale))

      const canvas = document.createElement('canvas')
      canvas.width = dw
      canvas.height = dh
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, dw, dh)
      ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, dw, dh)

      const blob = await encodeJpegUnderLimit(canvas)
      if (!blob) {
        setErr('Could not encode the cropped image. Try a different file.')
        return
      }
      const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image'
      const cropped = new File([blob], `${baseName}-cropped.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      })
      onCropped?.(cropped)
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={() => !busy && onCancel?.()}
      title="Crop image"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => !busy && onCancel?.()}
            disabled={busy}
            className="text-sm font-bold text-brand-navy/70 hover:text-brand-navy px-4 h-10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || !box}
            className="bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
          >
            {busy ? 'Processing…' : 'Use this image'}
          </button>
        </div>
      }
    >
      <p className="text-[12px] text-brand-navy/60 mb-3">
        Drag the rectangle to move it, or drag a corner to resize. We&apos;ll re-encode the
        cropped area as a JPEG under 5&nbsp;MB.
      </p>
      <div
        ref={containerRef}
        className="relative inline-block max-w-full bg-brand-page rounded-xl overflow-hidden border border-brand-line select-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: 'none' }}
      >
        {imgUrl && (
          <img
            ref={imgRef}
            src={imgUrl}
            onLoad={onImgLoad}
            alt="Crop source"
            draggable={false}
            className="block max-w-full max-h-[60vh] w-auto h-auto"
          />
        )}
        {box && (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 0 9999px rgba(0, 13, 28, 0.55)`,
                clipPath: `polygon(
                  0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                  ${box.x}px ${box.y}px,
                  ${box.x}px ${box.y + box.h}px,
                  ${box.x + box.w}px ${box.y + box.h}px,
                  ${box.x + box.w}px ${box.y}px,
                  ${box.x}px ${box.y}px
                )`,
              }}
            />
            <div
              onPointerDown={(e) => onPointerDown('move', e)}
              className="absolute border-2 border-brand-gold cursor-move"
              style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
            >
              {(['nw', 'ne', 'sw', 'se']).map((corner) => {
                const cursor =
                  corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize'
                const pos = {
                  nw: { left: -7, top: -7 },
                  ne: { right: -7, top: -7 },
                  sw: { left: -7, bottom: -7 },
                  se: { right: -7, bottom: -7 },
                }[corner]
                return (
                  <div
                    key={corner}
                    onPointerDown={(e) => onPointerDown(corner, e)}
                    className="absolute w-3.5 h-3.5 bg-white border-2 border-brand-gold rounded-sm"
                    style={{ ...pos, cursor }}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
      {err && <p className="text-[12px] text-error mt-3">{err}</p>}
    </Modal>
  )
}

export default ImageCropDialog
