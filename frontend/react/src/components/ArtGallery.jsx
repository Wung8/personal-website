import ImageGallery from './ImageGallery.jsx'

/**
 * The Art section on the home page: pieces laid out in justified rows (see
 * ImageGallery.jsx). Add or reorder pieces in src/data/siteContent.js.
 */
export default function ArtGallery({ art }) {
  return (
    <section id="art" className="art">
      <h1 className="section-heading">{art.heading}</h1>
      <ImageGallery pieces={art.pieces} />
    </section>
  )
}
