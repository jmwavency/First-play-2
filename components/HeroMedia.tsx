"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Header media. Prefers a real surf-wave video (public/hero-wave.mp4) for full
// photorealism; until that file exists it falls back to the WebGL ocean so the
// site is never broken. The video is graded toward the dark Wavency teal and
// parallaxes gently with the cursor.
const WaveCanvas = dynamic(() => import("./wave/WaveCanvas"), { ssr: false });

export default function HeroMedia() {
  const [useVideo, setUseVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Subtle cursor parallax on the video layer.
  useEffect(() => {
    if (!useVideo) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      tgt.x = (e.clientX / window.innerWidth - 0.5) * 2;
      tgt.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tick = () => {
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;
      wrap.style.transform = `scale(1.12) translate3d(${cur.x * -14}px, ${
        cur.y * -10
      }px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [useVideo]);

  return (
    <div className="hero-media">
      {!useVideo && <WaveCanvas />}

      <div ref={wrapRef} className="hero-video-wrap" aria-hidden={!useVideo}>
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setUseVideo(true)}
          onError={() => setUseVideo(false)}
          style={{ opacity: useVideo ? 1 : 0 }}
        >
          <source src="/hero-wave.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Teal colour grade + dark scrim so the brand tone reads and text stays legible. */}
      {useVideo && <div className="hero-grade" aria-hidden />}
    </div>
  );
}
