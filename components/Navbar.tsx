"use client";

export default function Navbar() {
  return (
    <nav className="nav">
      <a href="#top" className="nav-logo">
        <span className="dot" />
        Wavency
      </a>
      <div className="nav-links">
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#about">Studio</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
