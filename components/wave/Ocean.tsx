"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

// The displaced plane. Tracks the pointer by raycasting onto the mesh so the
// ripple originates from the exact point under the cursor, and eases a
// "strength" value up on movement / down on stillness for a fluid feel.
export default function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { raycaster, pointer, camera } = useThree();

  // Target + smoothed pointer position in the plane's local space.
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  const targetStrength = useRef(0);
  const smoothStrength = useRef(0);
  const lastPointer = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0 },
      uElevation: { value: 0.085 },
      uSpeed: { value: 0.32 },
      uDepthColor: { value: new THREE.Color("#01181c") },
      uSurfaceColor: { value: new THREE.Color("#006f80") },
      uFoamColor: { value: new THREE.Color("#bfe6ea") },
      uColorOffset: { value: 0.18 },
      uColorMultiplier: { value: 3.0 },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
    }

    // Raycast the current pointer onto the wave plane.
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(meshRef.current, false)[0];
    if (hit) {
      const local = meshRef.current.worldToLocal(hit.point.clone());
      // Plane is rotated -90deg on X, so local X/Y maps to world X/Z.
      targetMouse.current.set(local.x, local.y);
    }

    // Detect movement to drive ripple strength.
    const moved = pointer.distanceTo(lastPointer.current);
    lastPointer.current.copy(pointer);
    targetStrength.current = THREE.MathUtils.clamp(moved * 40, 0, 1);

    // Ease everything for buttery motion.
    smoothMouse.current.lerp(targetMouse.current, 1 - Math.pow(0.001, delta));
    smoothStrength.current = THREE.MathUtils.damp(
      smoothStrength.current,
      Math.max(targetStrength.current, smoothStrength.current * 0.92),
      4,
      delta
    );

    if (matRef.current) {
      matRef.current.uniforms.uMouse.value.copy(smoothMouse.current);
      matRef.current.uniforms.uMouseStrength.value = smoothStrength.current;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
      <planeGeometry args={[24, 24, 256, 256]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
