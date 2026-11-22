import OptionalImage from './OptionalImage.jsx'
import './ProjectCard.css'

/**
 * One project: screenshot on top, then title and description, with the year
 * pinned to the card's bottom-right corner.
 * If the project has an `href`, the whole card becomes a link.
 */
export default function ProjectCard({ project }) {
  const { title, description, year, image, href, slug } = project

  const content = (
    <>
      <div className="project-card__media">
        <OptionalImage src={image} alt={`Screenshot of ${title}`} loading="lazy" />
      </div>
      <div className="project-card__info">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__description">{description}</p>
      </div>
      <span className="project-card__year">{year}</span>
    </>
  )

  // A write-up on this site opens in the same tab (App.jsx handles the page swap).
  if (slug) {
    return (
      <a className="project-card project-card--link" href={`/projects/${slug}`}>
        {content}
      </a>
    )
  }

  return href ? (
    <a className="project-card project-card--link" href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <article className="project-card">{content}</article>
  )
}
