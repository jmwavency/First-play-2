"use client";

import Reveal from "./Reveal";

const services = [
  {
    title: "Identité de marque",
    desc: "Naming, systèmes visuels et principes de mouvement qui donnent à une marque une signature vivante et fluide.",
  },
  {
    title: "Produit numérique",
    desc: "Conception de produit de bout en bout — recherche, UX, systèmes d'interface et prototypes haute fidélité.",
  },
  {
    title: "Web & Interactif",
    desc: "Des sites web de calibre international avec WebGL, mouvement en temps réel et développement maison.",
  },
  {
    title: "Direction artistique",
    desc: "Campagnes, 3D, film et narration spatiale qui portent la marque sur chaque support.",
  },
];

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <h2 className="display">Nos expertises</h2>
            <p>
              Quatre disciplines, un seul savoir-faire continu. Nous passons de
              l&rsquo;une à l&rsquo;autre avec fluidité pour que le travail ne
              perde jamais son rythme.
            </p>
          </div>
        </Reveal>

        <div className="service-list">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="service-row" data-hover>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p className="desc">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
