"use client";
/* The one live Nova on the page. A fixed WebGL canvas that sits on her hero plinth and,
   as the hero scrolls away, flies down to the dock in the bottom-right corner. Only a
   transform changes per frame; the canvas never resizes while scrolling. */
import { useEffect, useRef } from "react";
import { createNova } from "./pearl";
import { nova } from "./store";
import { voice } from "./voice";
import { reducedMotion } from "@/components/woven/scroll";

const DOCK = 120; // px, matches .nova-dock in woven.css
const ease = (x: number) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

export function NovaRig() {
  const rig = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = rig.current!, cv = canvas.current!;
    let scene: ReturnType<typeof createNova>;
    try { scene = createNova(cv); } catch { el.hidden = true; return; } // no WebGL: the static fallback in the hero stays
    document.documentElement.classList.add("nova-live");
    const still = reducedMotion();
    let size = 0, anchor = { x: 0, y: 0, w: 1 }, heroH = 1, raf = 0, hop = nova.get().hop;

    const measure = () => {
      size = Math.round(Math.min(window.innerWidth * 0.9, 620));
      el.style.width = el.style.height = `${size}px`;
      scene.resize(size, size);
      const a = document.querySelector<HTMLElement>("[data-nova-anchor]");
      const hero = document.getElementById("top");
      if (a) { const r = a.getBoundingClientRect(); anchor = { x: r.left + r.width / 2, y: r.top + window.scrollY + r.height / 2, w: r.width }; }
      heroH = hero?.offsetHeight || window.innerHeight;
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(document.body);

    const onMove = (e: PointerEvent) => scene.look(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    window.addEventListener("pointermove", onMove, { passive: true });

    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const t = ms / 1000, s = nova.get();
      const p = ease(window.scrollY / (heroH * 0.7));
      const dx = window.innerWidth - 24 - DOCK / 2, dy = window.innerHeight - 24 - DOCK / 2;
      const x = anchor.x + (dx - anchor.x) * p, y = anchor.y - window.scrollY + (dy - (anchor.y - window.scrollY)) * p;
      const k = (anchor.w + (DOCK * 1.6 - anchor.w) * p) / size; // pearl fills ~60% of the canvas
      el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) scale(${k})`;
      nova.dock(p > 0.97);
      scene.setPlinth(p < 0.6);
      if (s.hop !== hop) { hop = s.hop; scene.hop(); }
      scene.setFace(s.face);
      /* real narration drives the mouth; captions without audio get a scripted envelope */
      const lv = voice.level();
      scene.setAmp(lv >= 0 ? lv : ms < s.talkUntil ? 0.25 + 0.55 * Math.abs(Math.sin(t * 9.5) * Math.sin(t * 3.1)) : 0);
      scene.frame(t, still);
    };
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", onMove); scene.dispose(); };
  }, []);

  return (
    <div ref={rig} className="nova-rig" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
