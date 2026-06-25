"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three-stdlib";

// Photoreal ocean built on the classic three.js Water shader: a flat reflective
// sea whose ripples come from an animated tiling normal map, lit by a sun glint.
// It reacts to the cursor three ways: the sun glitter follows the pointer, the
// camera parallaxes toward it, and the water stirs (more chop + faster drift)
// the faster you move — so the sea visibly responds to you.
export default function Ocean() {
  const waterRef = useRef<Water>(null!);
  const { pointer, camera } = useThree();

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
    (w.material as THREE.ShaderMaterial).uniforms.size.value = 3.2;
    return w;
  }, [normals]);

  // Eased sun azimuth/elevation targets driven by the cursor.
  const sun = useRef({ az: 0.2, el: 0.16 });
  const target = useRef({ az: 0.2, el: 0.16 });
  // Cursor-velocity driven agitation + camera parallax state.
  const lastPointer = useRef(new THREE.Vector2(0, 0));
  const agitation = useRef(0);
  const timeFlow = useRef(0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const mat = water.material as THREE.ShaderMaterial;

    // Cursor speed -> agitation (decays when the pointer is still).
    const moved = Math.hypot(
      pointer.x - lastPointer.current.x,
      pointer.y - lastPointer.current.y
    );
    lastPointer.current.set(pointer.x, pointer.y);
    const targetAgit = Math.min(moved * 14, 1);
    agitation.current += (targetAgit - agitation.current) * (1 - Math.pow(0.02, d));

    // Drift speed and surface chop both rise with agitation.
    timeFlow.current += d * (0.35 + agitation.current * 1.1);
    mat.uniforms.time.value = timeFlow.current;
    mat.uniforms.distortionScale.value = 3.0 + agitation.current * 4.5;

    // Sun glitter eases toward the cursor.
    target.current.az = pointer.x * 0.8;
    target.current.el = 0.1 + (pointer.y * 0.5 + 0.5) * 0.2;
    const k = 1 - Math.pow(0.0015, d);
    sun.current.az += (target.current.az - sun.current.az) * k;
    sun.current.el += (target.current.el - sun.current.el) * k;
    mat.uniforms.sunDirection.value
      .set(Math.sin(sun.current.az), Math.max(sun.current.el, 0.02), -Math.cos(sun.current.az))
      .normalize();

    // Gentle camera parallax toward the cursor for a living, reactive feel.
    const px = pointer.x * 7;
    const py = 12 + pointer.y * 3.5;
    camera.position.x += (px - camera.position.x) * (1 - Math.pow(0.02, d));
    camera.position.y += (py - camera.position.y) * (1 - Math.pow(0.02, d));
    camera.lookAt(0, 2.5, 0);
  });

  return <primitive ref={waterRef} object={water} position={[0, 0, 0]} />;
}

