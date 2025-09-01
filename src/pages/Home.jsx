import { useState, useEffect, useRef } from 'react'

const projects = [
    { title: 'Din Arhiva in Realitatea Virtuală: Procesul moașei Barbala Farkas', 
        description: 'burger' },
    { title: 'ZOOmArt- animale, obiectiv, expresie vizuală', 
        description: 'zoo burger' },
]

export default function Home() {
    // track which card is expanded; null means none
    const [openIndex, setOpenIndex] = useState(null)

    const toggle = (i) => {
        setOpenIndex((prev) => (prev === i ? null : i))
    }

    return (
        <section className="home-wrap">
            <h1 className="page-title">Proiectele noastre</h1>

            <div className="grid-2">
                {projects.map((p, i) => {
                    const isOpen = openIndex === i
                    return (
                        <button
                            key={i}
                            className={`project-card ${isOpen ? 'open' : ''}`}
                            onClick={() => toggle(i)}
                            aria-expanded={isOpen}
                        >
                            <div className="project-card-head">
                                <h2 className="project-title">{p.title}</h2>
                                <span className="chevron" aria-hidden="true">{isOpen ? '–' : '+'}</span>
                            </div>

                            <div className="project-body" style={{ maxHeight: isOpen ? '200px' : '0px' }}>
                                <p>{p.description}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
