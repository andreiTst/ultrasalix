export default function Contact({ content }) {
  const { lead, role, press, location } = content.contact

  return (
    <section className="contact-page">
      <h1 className="page-title">{content.navigation.contact}</h1>
      <p>{lead}</p>
      <p className="lead">
        Mihaela Miklošić<br />
        <span className="contact-role">{role}</span><br />
        <a href="mailto:michelle@ultrasalix.com">michelle@ultrasalix.com</a>
      </p>
      <p>
        {press}<br />
        <a href="mailto:media@ultrasalix.com">media@ultrasalix.com</a>
      </p>
      <p>{location}</p>
      <div className="social-links">
        <a href="https://www.facebook.com/profile.php?id=61580857511834"
          target="_blank" rel="noopener noreferrer" className="social-btn social-btn--facebook">
          Facebook
        </a>
        <a href="https://www.instagram.com/ultra_salix/"
          target="_blank" rel="noopener noreferrer" className="social-btn social-btn--instagram">
          Instagram
        </a>
      </div>
    </section>
  )
}
