import OptionalImage from './OptionalImage.jsx'
import './ProfileSidebar.css'

/**
 * Left column: photo, "About Me" text, and contact links.
 */
export default function ProfileSidebar({ profile }) {
  return (
    <aside className="profile">
      <div className="profile__photo">
        <OptionalImage src={profile.photo} alt={profile.photoAlt} />
      </div>

      <h2 className="profile__heading">{profile.aboutHeading}</h2>
      <div className="profile__bio">
        {profile.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <ul className="profile__contacts">
        {profile.contacts.map((contact) => (
          <li key={contact.label}>
            <span className="profile__contact-label">{contact.label}:</span>{' '}
            <a href={contact.href} target="_blank" rel="noreferrer">
              {contact.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
