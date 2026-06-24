"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-col" style={{ maxWidth: 280 }}>
            <h4>Wavency Studio</h4>
            <p style={{ color: "var(--white-dim)" }}>
              A digital design studio crafting fluid brand and product
              experiences from anywhere on earth.
            </p>
          </div>
          <div className="footer-col">
            <h4>Sitemap</h4>
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#about">Studio</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Social</h4>
            <a href="#">Instagram</a>
            <a href="#">Behance</a>
            <a href="#">LinkedIn</a>
            <a href="#">Dribbble</a>
          </div>
          <div className="footer-col">
            <h4>Say hello</h4>
            <a href="mailto:hello@wavency.studio">hello@wavency.studio</a>
            <a href="tel:+10000000000">+1 (000) 000-0000</a>
          </div>
        </div>

        <div className="footer-mark">Wavency</div>

        <div className="footer-bottom">
          <span>© {2026} Wavency Studio. All rights reserved.</span>
          <span>Designed in motion · Built with care</span>
        </div>
      </div>
    </footer>
  );
}
