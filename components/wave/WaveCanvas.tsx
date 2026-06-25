"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Ocean from "./Ocean";

// Full-bleed WebGL canvas behind the hero copy. The camera sits just above the
// sea looking toward the horizon so the water fills the frame and melts into
// the dark page via fog — like real ocean footage.
export default function WaveCanvas() {
  return (
    <Canvas
      className="wave-canvas"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 12, 48], fov: 46, near: 1, far: 4000 }}
    >
      <color attach="background" args={["#020b0d"]} />
      <fog attach="fog" args={["#020b0d", 70, 700]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-10, 30, -20]} intensity={0.4} color="#a9dde4" />
      <Suspense fallback={null}>
        <Ocean />
      </Suspense>
    </Canvas>
  );
}
