import ArtGallery from '../components/ArtGallery.jsx'
import ProfileSidebar from '../components/ProfileSidebar.jsx'
import ProjectGrid from '../components/ProjectGrid.jsx'
import ResumeSection from '../components/ResumeSection.jsx'
import { art, profile, projects, resume } from '../data/siteContent.js'
import './HomePage.css'

export default function HomePage() {
  return (
    <main className="home">
      <ProfileSidebar profile={profile} />
      {/* Right-hand column: one section after another. */}
      <div className="home__main">
        <ProjectGrid projects={projects} />
        <ResumeSection resume={resume} />
        <ArtGallery art={art} />
      </div>
    </main>
  )
}
