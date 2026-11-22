import './NavBar.css'

/**
 * Top bar with the site name on the left and page links on the right.
 */
export default function NavBar({ siteName, links }) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="nav__brand" href="/">
          {siteName}
        </a>
        <nav aria-label="Main">
          <ul className="nav__links">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
