"use client";
/* The Loom field behind the hero: warp threads drifting on a slow current, one gold weft
   thread pulled across them, all leaning toward the pointer. Native 2D canvas, paused when
   off screen; reduced motion draws a single still frame. */
import { useEffect, useRef } from "react";
import { reducedMotion } from "./scroll";

export function Loom({ threads = 34 }: { threads?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!;
    let w = 0, h = 0, raf = 0, visible = true, px = 0.5, py = 0.5, tx = 0.5, ty = 0.5;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const size = () => { w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };

    const draw = (t: number) => {
      px += (tx - px) * 0.04; py += (ty - py) * 0.04;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < threads; i++) {
        const f = i / (threads - 1), y0 = h * (0.06 + f * 0.92);
        const amp = 26 + 40 * Math.sin(f * 3.1 + t * 0.15);
        const lean = (px - 0.5) * 90 * (1 - Math.abs(f - py) * 1.4);
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 24) {
          const u = x / w;
          const y = y0 + Math.sin(u * 5.2 + f * 6 + t * 0.32) * amp * 0.5 + Math.sin(u * 2.1 - t * 0.21 + f * 3) * amp * 0.4 + lean * Math.sin(u * Math.PI);
          if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const mint = i % 5 === 2;
        ctx.strokeStyle = mint ? "rgba(79,224,166,.16)" : `rgba(0,143,100,${0.14 + 0.16 * Math.sin(f * Math.PI)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      /* the gold weft */
      ctx.beginPath();
      for (let x = -20; x <= w + 20; x += 16) {
        const u = x / w;
        const y = h * (0.52 + (py - 0.5) * 0.12) + Math.sin(u * 4 + t * 0.5) * h * 0.09 + Math.sin(u * 9 - t * 0.8) * 10;
        if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(199,163,90,.85)"; ctx.lineWidth = 2; ctx.shadowColor = "rgba(199,163,90,.6)"; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
    };

    size();
    const still = reducedMotion();
    if (still) { draw(4); return; }
    const loop = (ms: number) => { raf = requestAnimationFrame(loop); if (visible && !document.hidden) draw(ms / 1000); };
    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);
    const onMove = (e: PointerEvent) => { tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", size);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", size); };
  }, [threads]);

  return <canvas ref={ref} className="w-loom" aria-hidden="true" />;
}
