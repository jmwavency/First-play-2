# Wavency

An award-style website for **Wavency**, a digital design studio. The hero is a
real-time **WebGL fluid wave** that ripples toward your cursor — built on a deep
black canvas with ocean-blue swells and white foam accents for a modern, luxe,
soothing feel.

## Highlights

- **Interactive wave header** — a custom GLSL shader (simplex noise + crossed
  sine swells) on a subdivided plane. The cursor is raycast onto the surface and
  drives a travelling ripple with eased strength.
- **Dark & luxe system** — near-black background, blue glow, white accents,
  Space Grotesk display type over Inter body.
- **Custom cursor** — instant dot + lagging ring that grows over interactive
  elements (`mix-blend-mode: difference`).
- **Inertial smooth scroll** via Lenis, with anchor links routed through it.
- **Scroll reveals** with Framer Motion.
- **Sections** — Hero, Selected Work, Services, Studio/Manifesto, Contact, Footer.
- **Accessible** — respects `prefers-reduced-motion`; coarse pointers fall back
  to the native cursor.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · react-three-fiber + three.js ·
Framer Motion · Lenis.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx          fonts + metadata
  page.tsx            composition of all sections
  globals.css         design system + section styles
components/
  wave/
    shaders.ts        GLSL vertex + fragment shaders
    Ocean.tsx         displaced plane + cursor raycasting
    WaveCanvas.tsx    R3F canvas / camera / fog
  Hero, Work, Services, About, Contact, Footer, Navbar
  Cursor, SmoothScroll, Reveal
```

Content is on-brand placeholder copy — swap project names, stats, email and
social links for the real thing when ready.
