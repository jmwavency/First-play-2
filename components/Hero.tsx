"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// The WebGL canvas is client-only — load it lazily so it never blocks paint.
const WaveCanvas = dynamic(() => import("./wave/WaveCanvas"), { ssr: false });

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
      <WaveCanvas />

      <div className="hero-overlay">
        <div className="hero-content">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ marginBottom: 26 }}
          >
            Digital Design Studio · Est. 2019
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
                We design
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
                in <em>motion</em>.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Wavency is a studio for brands that refuse to sit still. We shape
            fluid identities, products and stories — engineered to move people.
          </motion.p>
        </div>
      </div>

      <div className="hero-meta">
        <div className="hero-meta-inner">
          <div className="scroll-hint">
            <span className="bar" />
            Scroll to explore
          </div>
          <div className="scroll-hint" style={{ letterSpacing: "0.14em" }}>
            Move your cursor · feel the wave
          </div>
        </div>
      </div>
    </header>
  );
}
