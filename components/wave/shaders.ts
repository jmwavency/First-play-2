// GLSL shaders for the Wavency interactive ocean.
// A subdivided plane is displaced by directional swells + fractal noise to read
// as real, calm dark water. Per-fragment lighting (diffuse + specular glints +
// fresnel sheen) sells the realism, and the cursor pushes a soft ripple across
// the surface. Palette stays in deep-teal -> Wavency #006F80 -> pale foam.

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;        // mouse position in plane-local space
  uniform float uMouseStrength;
  uniform float uElevation;   // overall wave height (calm = small)
  uniform float uSpeed;

  varying float vElevation;
  varying vec2 vUv;
  varying float vMouseDist;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

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

  // Surface height at a point — two gentle directional swells plus several
  // octaves of drifting noise for fine, realistic chop. Kept low-amplitude so
  // the water reads calm.
  float getElevation(vec2 p) {
    float t = uTime * uSpeed;
    float e = 0.0;
    e += sin(dot(p, vec2(1.0, 0.35)) * 0.5 + t * 0.9) * 0.55;
    e += sin(dot(p, vec2(-0.35, 1.0)) * 0.7 + t * 0.7) * 0.40;

    float amp = 0.5;
    float freq = 0.9;
    for (int i = 0; i < 4; i++) {
      e += snoise(vec3(p * freq, t * 0.18)) * amp;
      freq *= 1.95;
      amp *= 0.5;
    }
    return e * uElevation;
  }

  void main() {
    vec3 pos = position;
    vec2 p = pos.xy;

    float elevation = getElevation(p);

    // Soft cursor ripple — a gentle swell + a slow travelling ring.
    float dist = distance(p, uMouse);
    vMouseDist = dist;
    float ring = sin(dist * 4.5 - uTime * 3.0) * exp(-dist * 1.4);
    elevation += ring * uMouseStrength * 0.18;
    elevation += exp(-dist * 1.8) * uMouseStrength * 0.22;

    pos.z += elevation;

    // Normal via finite differences of the height field (for lighting).
    float eps = 0.12;
    float hL = getElevation(p - vec2(eps, 0.0));
    float hR = getElevation(p + vec2(eps, 0.0));
    float hD = getElevation(p - vec2(0.0, eps));
    float hU = getElevation(p + vec2(0.0, eps));
    vec3 n = normalize(vec3(hL - hR, hD - hU, 2.0 * eps));

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * n);
    vElevation = elevation;
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
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
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // Key light low on the horizon for long, calm glints across the swell.
    vec3 lightDir = normalize(vec3(0.35, 0.55, 0.45));
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 80.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    // Base depth->surface gradient driven by height.
    float mixStrength = clamp((vElevation + uColorOffset) * uColorMultiplier, 0.0, 1.0);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Gentle teal diffuse + a restrained fresnel sheen (kept low so there is
    // no bright glowing horizon — the water stays dark and uniform).
    color += uSurfaceColor * diff * 0.14;
    color = mix(color, uSurfaceColor * 1.15, fresnel * 0.12);

    // Sparse specular glints — subtle, like moonlight on calm water.
    color += vec3(0.55, 0.78, 0.82) * spec * 0.45;

    // A whisper of foam only on the highest crests + a soft halo at the cursor.
    float foam = smoothstep(0.6, 0.98, vElevation);
    foam += (1.0 - smoothstep(0.0, 0.45, vMouseDist)) * 0.1;
    color = mix(color, uFoamColor, clamp(foam, 0.0, 0.5));

    // Keep the surface calm and nocturnal, but still readable.
    color *= 0.95;

    // Gently settle the far edge into the page.
    float depthFade = smoothstep(0.0, 0.4, vUv.y);
    color = mix(uDepthColor, color, depthFade);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;
