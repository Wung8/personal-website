import { useEffect, useRef } from 'react'

/**
 * A short looping video for a write-up, used like a GIF: muted, no controls.
 * It doesn't download until it scrolls into view, and it pauses when it
 * scrolls out, so a post with many clips stays fast.
 *
 *   src     – an imported video file
 *   alt     – what the clip shows, for screen readers
 *   caption – optional line under it
 *   aspectRatio – optional shape of the box while it loads, e.g. '16 / 9'
 *                 (default '1', square)
 *   controls – optional; shows the player controls so visitors can unmute,
 *              scrub or go fullscreen (it still starts muted on scroll)
 *   wide     – optional; lets a single clip use the full column width
 *              instead of the small centred size
 */
export default function PostClip({ src, alt, caption, aspectRatio, controls, wide }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        // play() can be refused (e.g. power-saving modes); the clip then just stays still.
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      // Only play once most of the clip is on screen, so clips half-scrolled past
      // don't keep decoding; pages with many clips (Raiders) lag otherwise.
      { threshold: 0.6 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <figure className={wide ? 'post-clip post-clip--wide' : 'post-clip'}>
      <video
        ref={videoRef}
        src={src}
        aria-label={alt}
        style={aspectRatio ? { aspectRatio } : undefined}
        controls={controls}
        muted
        loop
        playsInline
        preload="none"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
