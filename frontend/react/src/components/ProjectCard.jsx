import OptionalImage from './OptionalImage.jsx'
import './ProjectCard.css'

/**
 * One project: screenshot on top, then title and description, with the year
 * pinned to the card's bottom-right corner.
 * If the project has a `slug`, the card opens its write-up; with only an
 * `href`, it opens that link. Pills in the top-right corner say which (see below).
 */
export default function ProjectCard({ project }) {
  const { title, description, year, image, href, slug, wip } = project

  // Pills in the image's top-right corner, worked out from the project's fields:
  //   WIP    – nothing to open yet (no `slug` or `href`), or `wip: true`
  //   Blog   – has a write-up on this site (`slug`)
  //   GitHub – the card links to a GitHub repo (`href` on github.com)
  const linksToGithub = !slug && /^https?:\/\/(www\.)?github\.com\//i.test(href ?? '')
  const isWip = wip || (!slug && !href)
  const badges = []
  if (isWip) badges.push(<span key="wip" className="project-card__badge">WIP</span>)
  if (slug) badges.push(<span key="blog" className="project-card__badge">Blog</span>)
  if (linksToGithub) {
    badges.push(
      <span key="github" className="project-card__badge project-card__badge--icon" title="GitHub">
        <GithubIcon />
        <span className="visually-hidden">GitHub</span>
      </span>,
    )
  }

  const content = (
    <>
      <div className="project-card__media">
        <OptionalImage src={image} alt={`Screenshot of ${title}`} loading="lazy" />
        {badges.length > 0 && <div className="project-card__badges">{badges}</div>}
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

/** The GitHub mark (from GitHub's Octicons, MIT licence). Takes the text colour. */
function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}
