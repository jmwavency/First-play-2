"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Ocean from "./Ocean";

// Full-bleed WebGL canvas sitting behind the hero copy. The camera looks
// across the wave surface at a low angle so it reads as an endless ocean
// fading into the black of the page.
export default function WaveCanvas() {
  return (
    <Canvas
      className="wave-canvas"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 1.2, 5.5], fov: 42, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 6, 16]} />
      <Suspense fallback={null}>
        <Ocean />
      </Suspense>
    </Canvas>
  );
}
