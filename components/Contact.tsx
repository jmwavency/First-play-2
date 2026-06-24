"use client";

import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-glow" />
      <div className="shell contact-inner">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: 30 }}>
            Have something in motion?
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2>
            Let&rsquo;s make
            <br />
            waves together.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <a className="contact-mail" href="mailto:hello@wavency.studio">
            hello@wavency.studio <span aria-hidden>↗</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
