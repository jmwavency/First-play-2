"use client";

export default function Navbar() {
  return (
    <nav className="nav">
      <a href="#top" className="nav-logo" aria-label="Wavency">
        <img src="/wavency-logo.png" alt="Wavency" />
      </a>
      <div className="nav-links">
        <a href="#work">Réalisations</a>
        <a href="#services">Expertises</a>
        <a href="#about">Studio</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
