import { useEffect, useRef, useState } from 'react'
import OptionalImage from '../components/OptionalImage.jsx'
import './ProjectPage.css'

/**
 * Blog-style write-up for one project: header, hero image, then the sections,
 * with a table of contents on the right that follows you down the page.
 * The content comes from src/projects/<slug>/index.jsx.
 */
export default function ProjectPage({ post }) {
  const { title, subtitle, tags, hero, sections, links = [] } = post
  const activeId = useActiveSection(sections)

  // External links (e.g. Github), shown beside the title and again at the end.
  const linkList = links.map((link) => (
    <a key={link.href} className="post__link" href={link.href} target="_blank" rel="noreferrer">
      {link.label}
    </a>
  ))

  return (
    <div className="post-layout">
      <article className="post">
        <a className="post__back" href="/#projects">
          &larr; Back to projects
        </a>

        <header className="post__header">
          <div className="post__title-row">
            <h1 className="post__title">{title}</h1>
            {linkList.length > 0 && <div className="post__links">{linkList}</div>}
          </div>
          {subtitle && <p className="post__subtitle">{subtitle}</p>}
          {tags?.length > 0 && (
            <ul className="post__tags" aria-label="Tags">
              {tags.map((tag) => (
                <li key={tag} className="post__tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {hero && (
          <figure className="post__hero">
            <div className="post__hero-media" style={{ aspectRatio: hero.aspectRatio }}>
              {hero.video ? (
                // Muted + playsInline is what lets browsers (including phones)
                // autoplay it, like a GIF. The poster shows until it starts.
                <video
                  src={hero.video}
                  poster={hero.src}
                  aria-label={hero.alt}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : (
                <OptionalImage src={hero.src} alt={hero.alt} />
              )}
              {hero.label && <span className="post__hero-label">{hero.label}</span>}
            </div>
            {hero.caption && <figcaption className="post__hero-caption">{hero.caption}</figcaption>}
          </figure>
        )}

        {sections.map((section) => (
          <section key={section.id} id={section.id} className="post__section">
            <h2>{section.title}</h2>
            {section.body}
          </section>
        ))}

        <footer className="post__footer">
          <a className="post__back" href="/#projects">
            &larr; Back to projects
          </a>
          {linkList.length > 0 && <div className="post__links">{linkList}</div>}
        </footer>
      </article>

      <aside className="post-toc" aria-labelledby="post-toc-heading">
        <p className="post-toc__heading" id="post-toc-heading">
          On this page
        </p>
        <nav aria-labelledby="post-toc-heading">
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={section.id === activeId ? 'is-active' : undefined}
                  onClick={(event) => {
                    // Scroll without adding the #section to the address bar,
                    // so the browser's Back button goes back to the projects.
                    event.preventDefault()
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}

/** The id of the section currently being read (the last one whose top has scrolled past ~1/3 of the screen). */
function useActiveSection(sections) {
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const frame = useRef(0)

  useEffect(() => {
    const scroller = document.querySelector('.page-scroll')
    if (!scroller) return

    function update() {
      const line = scroller.getBoundingClientRect().top + scroller.clientHeight / 3
      let current = sections[0]?.id
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      // At the very bottom, the last section counts as read even if it's short.
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
        current = sections[sections.length - 1]?.id
      }
      setActiveId(current)
    }

    function onScroll() {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(update)
    }

    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame.current)
    }
  }, [sections])

  return activeId
}
