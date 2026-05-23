import { useEffect, useState } from 'react'

// Renders `fallback` when src is missing or the image fails to load.
// Reset on src change so a new URL gets another chance.
function ImgWithFallback({ src, fallback, alt = '', className, onLoad, ...rest }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) return fallback ?? null

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      onLoad={onLoad}
      {...rest}
    />
  )
}

export default ImgWithFallback
