"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-col" style={{ maxWidth: 280 }}>
            <h4>Studio Wavency</h4>
            <p style={{ color: "var(--white-dim)" }}>
              Un studio de design numérique qui crée des expériences de marque et
              de produit fluides, partout dans le monde.
            </p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <a href="#work">Réalisations</a>
            <a href="#services">Expertises</a>
            <a href="#about">Studio</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Réseaux</h4>
            <a href="#">Instagram</a>
            <a href="#">Behance</a>
            <a href="#">LinkedIn</a>
            <a href="#">Dribbble</a>
          </div>
          <div className="footer-col">
            <h4>Écrivez-nous</h4>
            <a href="mailto:hello@wavency.studio">hello@wavency.studio</a>
            <a href="tel:+10000000000">+1 (000) 000-0000</a>
          </div>
        </div>

        <img className="footer-mark" src="/wavency-logo.png" alt="Wavency" />

        <div className="footer-bottom">
          <span>© {2026} Studio Wavency. Tous droits réservés.</span>
          <span>Conçu en mouvement · Réalisé avec soin</span>
        </div>
      </div>
    </footer>
  );
}
