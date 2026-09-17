export default function Contact() {
    return (
      <section>
        <h1 className="page-title">Contactează-ne!</h1>
        <p className="lead" style={{ textAlign: 'center' }}>
          Mihaela Miklošić
        </p>
        <p style={{ textAlign: 'center' }}>
          <a href="mailto:michelle@ultrasalix.com">michelle@ultrasalix.com</a>
        </p>
        <div className="social-links">
          <a
            href="https://www.facebook.com/profile.php?id=61580857511834"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn social-btn--facebook"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/ultra_salix/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn social-btn--instagram"
          >
            Instagram
          </a>
        </div>
      </section>
    )
  }
  