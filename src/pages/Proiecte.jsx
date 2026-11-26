import { useState } from 'react'

const sections = [
  { id: 'completed', projects: ['zoomart', 'borbala'] },
  { id: 'development', projects: ['foodAtlas'] },
  { id: 'collaboration', projects: ['epidemix', 'integrationAtlas'] },
]

const destinations = {
  zoomart: ['https://sites.google.com/ultrasalix.com/zoomart/home'],
  borbala: ['https://borbala-farkas.vercel.app/', 'https://muzeulmures.ro/tururi-virtuale/'],
}

export default function Proiecte({ content }) {
  const [openId, setOpenId] = useState(null)

  return (
    <section className="projects-page">
      {sections.map(({ id: sectionId, projects }) => (
        <section key={sectionId} className="project-section">
          <div className="section-heading">
            <h2>{content.sections[sectionId]}</h2>
          </div>
          <div className={`section-divider section-divider--${sectionId}`} aria-hidden="true" />
          <div className="grid-2">
            {projects.map(id => {
              const { title, badge, paragraphs, actions } = content.projects[id]
              const isOpen = openId === id
              return (
                <article key={id} className={`project-card${isOpen ? ' open' : ''}`}>
                  <h3 className="project-title">
                    <button
                      type="button"
                      className="project-card-head"
                      aria-expanded={isOpen}
                      aria-controls={`project-${id}`}
                      onClick={() => setOpenId(current => current === id ? null : id)}
                    >
                      <span className="project-card-heading">
                        <span className={`status-badge status-badge--${sectionId}`}>{badge}</span>
                        <span>{title}</span>
                      </span>
                      <span className="chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                  </h3>
                  <div id={`project-${id}`} className="project-body" inert={!isOpen}>
                    <div className="project-body-inner">
                      {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                      {destinations[id]?.map((url, index) => (
                        <a key={url} className={index === 0 ? 'card-link-btn' : 'card-secondary-link'}
                          href={url} target="_blank" rel="noopener noreferrer">
                          {actions[index]}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </section>
  )
}
