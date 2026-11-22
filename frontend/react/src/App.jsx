import { useEffect } from 'react'
import NavBar from './components/NavBar.jsx'
import { navLinks, profile } from './data/siteContent.js'
import { projectPosts } from './projects/index.js'
import HomePage from './pages/HomePage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import { useLinkInterception, usePath, useScrollToHash } from './router.js'

/*
 * Picks the page from the URL:
 *   /                     → home page
 *   /projects/<slug>      → that project's write-up (see projects/index.js)
 * Anything else falls back to the home page.
 */
export default function App() {
  const path = usePath()
  useLinkInterception()
  useScrollToHash(path)

  const match = path.match(/^\/projects\/([^/]+)\/?$/)
  const post = match ? projectPosts[match[1]] : null

  useEffect(() => {
    document.title = post ? `${post.title} | ${profile.name}` : profile.name
  }, [post])

  return (
    <>
      <NavBar siteName={profile.name} links={navLinks} />
      {/* Only this area scrolls, so the scrollbar starts below the nav. The key
          gives each page a fresh scroll area, so a new page starts at the top. */}
      <div className="page-scroll" key={path}>
        {post ? <ProjectPage post={post} /> : <HomePage />}
      </div>
    </>
  )
}
