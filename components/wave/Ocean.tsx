"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three-stdlib";

// Photoreal ocean built on the classic three.js Water shader: a flat reflective
// sea whose ripples come from an animated tiling normal map, lit by a sun glint.
// The sun direction eases toward the cursor, so the glitter path follows the
// pointer — the water still "reacts" to you while reading as real footage.
export default function Ocean() {
  const waterRef = useRef<Water>(null!);
  const { pointer } = useThree();

  const normals = useLoader(THREE.TextureLoader, "/waternormals.jpg");
  normals.wrapS = normals.wrapT = THREE.RepeatWrapping;

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(2000, 2000);
    const w = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: normals,
      sunDirection: new THREE.Vector3(0.2, 0.16, -0.6).normalize(),
      sunColor: 0xc4eef4,
      waterColor: 0x00606e, // Wavency teal, kept deep
      distortionScale: 3.0,
      fog: true,
      alpha: 1.0,
    });
    w.rotation.x = -Math.PI / 2;
    // Tighten the ripple scale so the sea reads detailed, not stretched.
    (w.material as THREE.ShaderMaterial).uniforms.size.value = 3.2;
    return w;
  }, [normals]);

  // Eased sun azimuth/elevation targets driven by the cursor.
  const sun = useRef({ az: 0.2, el: 0.16 });
  const target = useRef({ az: 0.2, el: 0.16 });

  useFrame((_, delta) => {
    const mat = water.material as THREE.ShaderMaterial;
    mat.uniforms.time.value += delta * 0.35; // calm drift

    target.current.az = pointer.x * 0.6;
    target.current.el = 0.12 + (pointer.y * 0.5 + 0.5) * 0.18;
    const k = 1 - Math.pow(0.0015, delta);
    sun.current.az += (target.current.az - sun.current.az) * k;
    sun.current.el += (target.current.el - sun.current.el) * k;

    const az = sun.current.az;
    const el = sun.current.el;
    mat.uniforms.sunDirection.value
      .set(Math.sin(az), Math.max(el, 0.02), -Math.cos(az))
      .normalize();
  });

  return <primitive ref={waterRef} object={water} position={[0, 0, 0]} />;
}
