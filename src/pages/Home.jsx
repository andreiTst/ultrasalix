import { useState, useEffect, useRef } from 'react'

const projects = [
    {
        title: 'ZOOm Art: animale, obiective și expresie vizuală',
        description: 'Concurs de fotografie dedicat tinerilor între 12-19 ani și vizitatorilor Grădinii zoologice Târgu-Mureș. Fotografiile trebuie realizate în incinta Zoo Târgu-Mureș în perioada 20 septembrie – 20 octombrie 2025. Organizat în parteneriat cu Grădina zoologică Târgu-Mureș și Consiliul Județean Mureș. Mai multe informații: https://sites.google.com/ultrasalix.com/zoomart/home'
    },
    {
        title: 'Și altele...',
        description: 'Urmăriți-ne creșterea!'
    }
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
