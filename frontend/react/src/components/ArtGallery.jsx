import ImageGallery from './ImageGallery.jsx'

/**
 * The Art section on the home page: pieces laid out in justified rows (see
 * ImageGallery.jsx). Add or reorder pieces in src/data/siteContent.js.
 *
 * The grid shows the small copies in public/images/art/thumbs/ (made by
 * scripts/make_art_thumbnails.py); the originals open full size.
 */
const withThumb = (piece) => ({
  ...piece,
  thumb: piece.image.replace(/\/art\/([^/]+)\.\w+$/, '/art/thumbs/$1.webp'),
})

export default function ArtGallery({ art }) {
  return (
    <section id="art" className="art">
      <h1 className="section-heading">{art.heading}</h1>
      <ImageGallery pieces={art.pieces.map(withThumb)} />
    </section>
  )
}
