import { useEffect, useRef } from 'react'

/**
 * A short looping video for a write-up, used like a GIF: muted, no controls.
 * It doesn't download until it scrolls into view, and it pauses when it
 * scrolls out, so a post with many clips stays fast.
 *
 *   src     – an imported video file
 *   alt     – what the clip shows, for screen readers
 *   caption – optional line under it
 */
export default function PostClip({ src, alt, caption }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        // play() can be refused (e.g. power-saving modes); the clip then just stays still.
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <figure className="post-clip">
      <video ref={videoRef} src={src} aria-label={alt} muted loop playsInline preload="none" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
