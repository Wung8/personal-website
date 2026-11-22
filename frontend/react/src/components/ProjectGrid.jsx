import ProjectCard from './ProjectCard.jsx'
import './ProjectGrid.css'

/**
 * Two-column grid of project cards (one column on narrow screens).
 * Add projects in src/data/siteContent.js; the grid grows automatically.
 */
export default function ProjectGrid({ projects }) {
  return (
    <section id="projects" className="projects">
      <h1 className="section-heading">Projects</h1>
      <div className="projects__grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  )
}
