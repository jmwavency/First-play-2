"use client";

import Reveal from "./Reveal";

const stats = [
  { n: "6", l: "Années en mouvement" },
  { n: "40+", l: "Marques façonnées" },
  { n: "12", l: "Prix & distinctions" },
  { n: "9", l: "Pays touchés" },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="shell">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: 44 }}>
            (Le studio)
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="manifesto">
            Nous croyons qu&rsquo;un grand design <em>coule</em>.{" "}
            <span className="muted">
              Il s&rsquo;adapte à ceux qu&rsquo;il sert, ne reste jamais figé, et
              laisse un sillage que l&rsquo;on a envie de suivre.
            </span>
          </p>
        </Reveal>

        <div className="about-stats">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.06}>
              <div className="stat">
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
