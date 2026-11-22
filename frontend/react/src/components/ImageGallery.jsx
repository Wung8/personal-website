import { useState } from 'react'
import Lightbox from './Lightbox.jsx'
import './ArtGallery.css'

/**
 * Images laid out in "justified rows": every image in a row is the same
 * height and none are cropped. Clicking one opens it full size.
 * Used by the Art section on the home page and by project write-ups.
 *
 *   pieces – [{ image, width, height, alt, title }]. width/height are the
 *            image's size in pixels (used for the layout before it loads);
 *            title is optional and shows under it when opened full size;
 *            thumb is an optional smaller copy to show in the grid.
 */
export default function ImageGallery({ pieces }) {
  // Index of the image open in the full-size viewer, or null when it's closed.
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <div className="art__grid">
        {pieces.map((piece, index) => (
          <button
            key={piece.image}
            type="button"
            className="art__item"
            // Wider images take proportionally more of the row (see ArtGallery.css).
            style={{ '--ratio': piece.width / piece.height }}
            onClick={() => setOpenIndex(index)}
            aria-label={`Open full size: ${piece.title ?? piece.alt}`}
          >
            <img
              // A small thumbnail when there is one; the full image opens in the Lightbox.
              src={piece.thumb ?? piece.image}
              alt={piece.alt}
              width={piece.width}
              height={piece.height}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          pieces={pieces}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  )
}
