"use client";

import Reveal from "./Reveal";

const stats = [
  { n: "6", l: "Years in motion" },
  { n: "40+", l: "Brands shaped" },
  { n: "12", l: "Awards & honours" },
  { n: "9", l: "Countries reached" },
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="shell">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: 44 }}>
            (The studio)
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="manifesto">
            We believe great design <em>flows</em>.{" "}
            <span className="muted">
              It bends to the people it serves, it never stands still, and it
              leaves a wake worth following.
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
