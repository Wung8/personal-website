import { useState } from 'react'

/**
 * An <img> that renders nothing if its file is missing, so the placeholder
 * background behind it shows instead of the browser's broken-image icon.
 * Accepts the same props as <img>.
 */
export default function OptionalImage(props) {
  const [failed, setFailed] = useState(false)

  if (!props.src || failed) return null
  return <img {...props} onError={() => setFailed(true)} />
}
