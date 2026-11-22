import { useEffect, useRef } from 'react'
import './Lightbox.css'

/**
 * Full-size viewer for one piece at a time, with previous/next arrows.
 * Built on the browser's <dialog>, which handles focus and the Escape key.
 *
 *   pieces   – the full list of art pieces
 *   index    – which piece is showing
 *   onChange – called with a new index when moving to another piece
 *   onClose  – called when the viewer should close
 */
export default function Lightbox({ pieces, index, onChange, onClose }) {
  const dialogRef = useRef(null)
  const piece = pieces[index]
  const showPrevious = () => onChange((index - 1 + pieces.length) % pieces.length)
  const showNext = () => onChange((index + 1) % pieces.length)

  // Open as a modal once, when the viewer first appears.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') showPrevious()
    if (event.key === 'ArrowRight') showNext()
  }

  // A click on the dark area around the image (the dialog itself) closes it.
  function handleClick(event) {
    if (event.target === dialogRef.current) dialogRef.current.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={piece.title ?? piece.alt}
      // Fires for every way of closing: the × button, Escape, or a click outside.
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <figure className="lightbox__figure">
        <img className="lightbox__image" src={piece.image} alt={piece.alt} />
        {piece.title && <figcaption className="lightbox__caption">{piece.title}</figcaption>}
      </figure>

      <button
        type="button"
        className="lightbox__button lightbox__button--close"
        onClick={() => dialogRef.current.close()}
        aria-label="Close"
      >
        ×
      </button>
      <button
        type="button"
        className="lightbox__button lightbox__button--previous"
        onClick={showPrevious}
        aria-label="Previous piece"
      >
        ‹
      </button>
      <button
        type="button"
        className="lightbox__button lightbox__button--next"
        onClick={showNext}
        aria-label="Next piece"
      >
        ›
      </button>
    </dialog>
  )
}
