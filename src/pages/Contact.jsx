export default function Contact({ content }) {
  const { lead, role, press, location } = content.contact

  return (
    <section className="contact-page">
      <h1 className="page-title">{content.navigation.contact}</h1>
      <p className="contact-intro">{lead}</p>
      <div className="contact-details">
        <div className="contact-group">
          <p className="contact-name">Mihaela Miklošić</p>
          <p className="contact-role">{role}</p>
          <a href="mailto:michelle@ultrasalix.com">michelle@ultrasalix.com</a>
        </div>
        <div className="contact-group">
          <p>{press}</p>
          <a href="mailto:media@ultrasalix.com">media@ultrasalix.com</a>
        </div>
      </div>
      <p className="contact-location">{location}</p>
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
