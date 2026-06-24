// GLSL shaders for the Wavency interactive fluid wave.
// A subdivided plane is displaced by layered noise + sine swells, and the
// cursor pushes a travelling ripple across the surface. Colouring stays in a
// deep-black -> ocean-blue -> white-foam range for a soothing, luxe feel.

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;        // mouse position in plane-local space (XZ-ish)
  uniform float uMouseStrength;
  uniform float uBigWaveElevation;
  uniform vec2 uBigWaveFrequency;
  uniform float uBigWaveSpeed;

  varying float vElevation;
  varying vec2 vUv;
  varying float vMouseDist;

  //
  // Classic 3D Simplex noise — Ashima Arts / Stefan Gustavson (MIT).
  //
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Large rolling swell built from two crossed sine waves.
    float elevation =
        sin(modelPosition.x * uBigWaveFrequency.x + uTime * uBigWaveSpeed)
      * sin(modelPosition.z * uBigWaveFrequency.y + uTime * uBigWaveSpeed)
      * uBigWaveElevation;

    // Layered fractal noise for organic surface detail.
    for (float i = 1.0; i <= 4.0; i++) {
      elevation -= abs(
        snoise(vec3(
          modelPosition.xz * (1.2 * i),
          uTime * 0.18
        )) * (0.18 / i)
      );
    }

    // Cursor ripple: a travelling ring that pushes the surface up near the
    // pointer and fades out with distance.
    float dist = distance(modelPosition.xz, uMouse);
    vMouseDist = dist;
    float ripple = sin(dist * 6.0 - uTime * 4.0) * exp(-dist * 1.6);
    elevation += ripple * uMouseStrength * 0.4;
    elevation += exp(-dist * 2.2) * uMouseStrength * 0.35;

    modelPosition.y += elevation;

    vElevation = elevation;
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

export const fragmentShader = /* glsl */ `
  uniform vec3 uDepthColor;
  uniform vec3 uSurfaceColor;
  uniform vec3 uFoamColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;

  varying float vElevation;
  varying vec2 vUv;
  varying float vMouseDist;

  void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = clamp(mixStrength, 0.0, 1.0);

    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // White foam on the highest crests and around the cursor.
    float foam = smoothstep(0.18, 0.42, vElevation);
    foam += (1.0 - smoothstep(0.0, 0.35, vMouseDist)) * 0.25;
    color = mix(color, uFoamColor, clamp(foam, 0.0, 1.0));

    // Vignette toward the horizon so the plane melts into the black page.
    float fade = smoothstep(0.0, 0.55, vUv.y);
    color = mix(vec3(0.0), color, fade);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;
