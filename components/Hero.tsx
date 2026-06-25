"use client";

import { motion } from "framer-motion";
import HeroMedia from "./HeroMedia";

const rise = {
  hidden: { opacity: 0, y: "110%" },
  show: (i: number) => ({
    opacity: 1,
    y: "0%",
    transition: { duration: 1.1, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  return (
    <header className="hero" id="top">
      <HeroMedia />

      <div className="hero-overlay">
        <div className="hero-content">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ marginBottom: 26 }}
          >
            Studio de Design Numérique · Depuis 2019
          </motion.p>

          <h1 className="display">
            <span style={{ display: "block", overflow: "hidden" }}>
              <motion.span
                style={{ display: "block" }}
                variants={rise}
                initial="hidden"
                animate="show"
                custom={0}
              >
                Nous créons
              </motion.span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <motion.span
                style={{ display: "block" }}
                variants={rise}
                initial="hidden"
                animate="show"
                custom={1}
              >
                en <em>mouvement</em>.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Wavency est un studio pour les marques qui refusent l&rsquo;immobilité.
            Nous façonnons des identités, produits et récits fluides — conçus
            pour faire vibrer.
          </motion.p>
        </div>
      </div>

      <div className="hero-meta">
        <div className="hero-meta-inner">
          <div className="scroll-hint">
            <span className="bar" />
            Défilez pour explorer
          </div>
          <div className="scroll-hint" style={{ letterSpacing: "0.14em" }}>
            Bougez votre curseur · sentez la vague
          </div>
        </div>
      </div>
    </header>
  );
}
