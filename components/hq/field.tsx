"use client";

import { useEffect, useRef, useState } from "react";
import type { Capability } from "@/content/capabilities";
import { CapIcon } from "./icons";

/* Ported from the design artboard (docs/operator-console/artboards/Main.dc.html, paint()).
   ~616 points: a 360-point shell that gives the sphere its silhouette, a 240-point inner
   cloud, and 16 brighter pulses. Depth scales BOTH alpha and radius — that is what makes it
   read as a sphere rather than a flat scatter. */

const AC = [199, 163, 90];   // gold  #c7a35a
const LV = [52, 211, 153];   // live  #34d399
const PP = [243, 240, 231];  // paper #f3f0e7
const COLS = [AC, LV, PP];

type P = { x: number; y: number; z: number; s: number; a: number; c: number; ph: number; sp: number };

function buildField(): P[] {
  let seed = 1337;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const out: P[] = [];
  const GA = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < 360; i++) {                      // shell — the silhouette
    const y = 1 - (i / 359) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * GA, j = 0.97 + rnd() * 0.06;
    out.push({ x: Math.cos(th) * r * j, y: y * j, z: Math.sin(th) * r * j,
      s: 0.5 + rnd() * 0.7, a: 0.28 + rnd() * 0.34,
      c: rnd() > 0.82 ? 2 : 0, ph: rnd() * 6.28, sp: 0.4 + rnd() * 0.5 });
  }
  for (let i = 0; i < 240; i++) {                      // inner cloud
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2;
    const r = Math.pow(rnd(), 0.55) * 0.7, w = Math.sqrt(Math.max(0, 1 - u * u));
    out.push({ x: Math.cos(th) * w * r, y: u * r, z: Math.sin(th) * w * r,
      s: 0.6 + rnd() * 1.1, a: 0.34 + rnd() * 0.5,
      c: rnd() > 0.72 ? 1 : rnd() > 0.5 ? 2 : 0, ph: rnd() * 6.28, sp: 0.7 + rnd() * 1.3 });
  }
  for (let i = 0; i < 16; i++) {                       // pulses
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2;
    const r = 0.3 + rnd() * 0.55, w = Math.sqrt(Math.max(0, 1 - u * u));
    out.push({ x: Math.cos(th) * w * r, y: u * r, z: Math.sin(th) * w * r,
      s: 1.5 + rnd() * 1.1, a: 0.6 + rnd() * 0.35, c: 1, ph: rnd() * 6.28, sp: 1.4 + rnd() * 1.2 });
  }
  return out;
}

const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* The node ring is a circle in pixels. Deriving it from percentages of a non-square
   box turns it into a wide ellipse, which is not the design. */
export function geom(W: number, H: number) {
  const NR = Math.max(120, Math.min(W / 2 - 62, H - 96));
  const R = Math.min(NR * 0.76, H / 2 - 18);
  return { C: W / 2, CY: H / 2, NR, R };
}

export function Field({ items, hot, active, onOpen, onHot }: {
  items: Capability[]; hot?: string; active?: string;
  onOpen: (id: string) => void; onHot: (id: string | undefined) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const state = useRef({ mx: 0, my: 0, rx: 0, ry: 0, spin: 0, held: false, ai: -1 });

  state.current.held = !!active;
  state.current.ai = items.findIndex((i) => i.id === (active ?? hot));

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const pts = buildField();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = cv.parentElement as HTMLElement;   // pointer frame
    const t0 = Date.now();
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      if (!r.width) return;
      state.current.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      state.current.my = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => { state.current.mx = 0; state.current.my = 0; };

    const frame = () => {
      const s = state.current;
      const box = cv.getBoundingClientRect();   // the canvas band, which is shorter than the field on mobile
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = box.width, H = box.height;
      if (!W || !H) { raf = requestAnimationFrame(frame); return; }
      if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const { C, CY, NR, R } = geom(W, H);
      const t = (Date.now() - t0) / 1000;

      if (!reduce) {
        const k = s.held ? 0.02 : 0.075;
        s.rx += ((s.held ? 0 : -s.my * 0.34) - s.rx) * k;
        s.ry += ((s.held ? 0 : s.mx * 0.46) - s.ry) * k;
        if (!s.held) s.spin += 0.0019;
      }
      const breathe = !reduce && !s.held;
      const Rb = R * (breathe ? 1 + Math.sin(t * 0.55) * 0.03 : 1);

      ctx.globalCompositeOperation = "lighter";

      const g = ctx.createRadialGradient(C, CY, 0, C, CY, Rb * 1.35);
      g.addColorStop(0, rgba(LV, 0.09));
      g.addColorStop(0.34, rgba(AC, 0.05));
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      /* below 700px the nodes leave the ring for a grid, so the ring and spokes go with them */
      const compact = window.innerWidth < 700;
      const D = Math.PI / 180;
      if (!compact) {
      for (const [a0, a1] of [[138 * D, 222 * D], [-42 * D, 42 * D]]) {
        ctx.strokeStyle = rgba(AC, 0.2); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(C, CY, NR, a0, a1); ctx.stroke();
        ctx.setLineDash([2, 24]);
        ctx.lineDashOffset = breathe ? -(t * 9) % 26 : 0;
        ctx.strokeStyle = rgba(LV, 0.2);
        ctx.beginPath(); ctx.arc(C, CY, NR, a0, a1); ctx.stroke();
        ctx.setLineDash([]);
      }

      /* spokes: sphere surface out to each node, impulse travelling on the live one */
      ctx.lineCap = "round";
      items.forEach((item, i) => {
        const a = item.angle * D;
        const px = C + Math.cos(a) * NR, py = CY + Math.sin(a) * NR;
        const dx = px - C, dy = py - CY, L = Math.hypot(dx, dy) || 1;
        const ux = dx / L, uy = dy / L;
        const x0 = C + ux * Rb * 1.06, y0 = CY + uy * Rb * 1.06;
        const x1 = px - ux * 36, y1 = py - uy * 36;
        const on = i === s.ai, c = on ? LV : AC;
        ctx.strokeStyle = rgba(c, on ? 0.6 : s.ai >= 0 ? 0.07 : 0.17);
        ctx.lineWidth = on ? 1.5 : 0.85;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        if (on && !reduce) {
          const u = (t * 0.55) % 1, hx = x0 + (x1 - x0) * u, hy = y0 + (y1 - y0) * u;
          const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 14);
          hg.addColorStop(0, rgba(LV, 0.55)); hg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, 14, 0, 6.2832); ctx.fill();
          ctx.fillStyle = "rgba(243,240,231,.9)";
          ctx.beginPath(); ctx.arc(hx, hy, 2.1, 0, 6.2832); ctx.fill();
        }
      });
      }

      /* the core */
      const yaw = s.spin + s.ry, pitch = s.rx;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
      const dim = s.ai >= 0 ? 0.78 : 1;
      for (const p of pts) {
        const puff = reduce ? 1 : 1 + Math.sin(t * p.sp + p.ph) * 0.045;
        const X = p.x * puff, Y = p.y * puff, Z = p.z * puff;
        const x1 = X * cy - Z * sy, z1 = X * sy + Z * cy;
        const y1 = Y * cx - z1 * sx, z2 = Y * sx + z1 * cx;
        const d = 2.9 / (2.9 + z2);
        const col = COLS[p.c];
        const al = p.a * dim * (0.22 + 0.78 * (d - 0.62) / 0.55) *
          (p.c === 1 && !reduce ? 0.65 + 0.35 * Math.sin(t * p.sp + p.ph) : 1);
        if (al <= 0.01) continue;
        ctx.fillStyle = rgba(col, Math.min(1, al));
        ctx.beginPath();
        ctx.arc(C + x1 * Rb * d, CY + y1 * Rb * d, Math.max(0.35, p.s * d * 1.35), 0, 6.2832);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    };

    frame();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    const ro = new ResizeObserver(() => {
      const r = host.getBoundingClientRect();
      setBox((b) => (Math.abs(b.w - r.width) > 1 || Math.abs(b.h - r.height) > 1 ? { w: r.width, h: r.height } : b));
    });
    ro.observe(host);
    const r0 = host.getBoundingClientRect();
    setBox({ w: r0.width, h: r0.height });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      ro.disconnect();
    };
  }, [items]);

  return (
    <div className={`hq-field ${active ? "is-paused" : ""}`}>
      <canvas ref={ref} className="hq-core" aria-hidden="true" />
      {box.w > 0 && items.map((x) => {
        const a = (x.angle * Math.PI) / 180;
        const g = geom(box.w, box.h);
        return (
          <button
            key={x.id}
            data-node={x.id}
            className={`hq-node ${hot === x.id || active === x.id ? "is-hot" : ""}`}
            style={{ left: g.C + g.NR * Math.cos(a), top: g.CY + g.NR * Math.sin(a) }}
            onClick={() => onOpen(x.id)}
            onMouseEnter={() => onHot(x.id)}
            onMouseLeave={() => onHot(undefined)}
          >
            <span className="hq-disc">
              <span className="hq-ring" aria-hidden="true" />
              <CapIcon id={x.id} />
            </span>
            <small>{x.name}</small>
          </button>
        );
      })}
    </div>
  );
}
