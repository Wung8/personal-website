import './ResumeSection.css'

/**
 * Heading plus a link that opens the resume PDF in a new tab.
 * Edit the text and file path in src/data/siteContent.js.
 */
export default function ResumeSection({ resume }) {
  return (
    <section id="resume" className="resume">
      <h1 className="section-heading">{resume.heading}</h1>
      <a className="resume__link" href={resume.file} target="_blank" rel="noreferrer">
        {resume.linkText}
      </a>
    </section>
  )
}
