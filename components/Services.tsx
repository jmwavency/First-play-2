"use client";

import Reveal from "./Reveal";

const services = [
  {
    title: "Brand Identity",
    desc: "Naming, visual systems and motion principles that give a brand a living, fluid signature.",
  },
  {
    title: "Digital Product",
    desc: "End-to-end product design — research, UX, interface systems and high-fidelity prototypes.",
  },
  {
    title: "Web & Interactive",
    desc: "Award-calibre websites with WebGL, real-time motion and engineering done in-house.",
  },
  {
    title: "Art Direction",
    desc: "Campaigns, 3D, film and spatial storytelling that carry the brand across every surface.",
  },
];

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <h2 className="display">What we do</h2>
            <p>
              Four disciplines, one continuous craft. We move fluidly between
              them so the work never loses its rhythm.
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
