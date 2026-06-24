"use client";

import { useRef } from "react";
import Reveal from "./Reveal";

type Project = {
  title: string;
  tag: string;
  year: string;
  role: string;
  hue: string;
};

const projects: Project[] = [
  {
    title: "Tidal — Banking Reimagined",
    tag: "Brand · Product",
    year: "2025",
    role: "Identity, App, Motion",
    hue: "188",
  },
  {
    title: "Lumen Studios",
    tag: "Web · Art Direction",
    year: "2024",
    role: "Website, 3D, WebGL",
    hue: "192",
  },
  {
    title: "Atlas Mobility",
    tag: "Product · Design System",
    year: "2024",
    role: "UX, System, Prototype",
    hue: "184",
  },
  {
    title: "Nocturne Records",
    tag: "Brand · Campaign",
    year: "2023",
    role: "Identity, Spatial, Film",
    hue: "194",
  },
];

function Card({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);

  // Subtle cursor-tracked glow inside each card.
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} className="work-card" onMouseMove={onMove}>
      <div
        className="glow"
        style={{
          background: `radial-gradient(420px circle at var(--mx) var(--my), hsla(${project.hue}, 100%, 62%, 0.18), transparent 60%)`,
        }}
      />
      <div className="work-card-inner">
        <span className="tag">{project.tag}</span>
        <div>
          <h3>{project.title}</h3>
          <div className="meta">
            <span>{project.role}</span>
            <span className="arrow">↗</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section className="work" id="work">
      <div className="shell">
        <Reveal>
          <div className="section-head">
            <h2 className="display">Selected work</h2>
            <p>
              A glimpse of recent collaborations — each one a partnership built
              to make brands move with intent.
            </p>
          </div>
        </Reveal>

        <div className="work-grid">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08}>
              <Card project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
