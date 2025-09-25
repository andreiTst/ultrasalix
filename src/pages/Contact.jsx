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
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
          <a
            href="https://www.facebook.com/profile.php?id=61580857511834"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#1877f2',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/ultra_salix/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#e4405f',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Instagram
          </a>
        </div>
      </section>
    )
  }
  