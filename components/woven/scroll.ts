/* One Lenis instance for the page, driven by GSAP's ticker so ScrollTrigger and smooth
   scroll share a single clock. Reduced motion gets native scrolling and no Lenis at all. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function startScroll() {
  if (lenis || reducedMotion()) return () => {};
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(500, 33); // never leap ahead after a stalled tab — a tour leg would be skipped
  return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; };
}

/* The scroll span a tour stop has to travel for its section's effects to play: pinned
   sections (wrapped in a ScrollTrigger pin-spacer) from the pin start to the pin end; ordinary
   sections from a little before they arrive until their bottom reaches the viewport bottom. */
export function sectionRange(id: string): [number, number] {
  if (id === "top") return [0, 0];
  const sec = document.getElementById(id);
  if (!sec) return [window.scrollY, window.scrollY];
  const spacer = sec.parentElement?.classList.contains("pin-spacer") ? sec.parentElement : null;
  const el = spacer ?? sec;
  const vh = window.innerHeight, max = document.documentElement.scrollHeight - vh;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const pinned = !!spacer || !!sec.querySelector(".pin-spacer");
  const start = Math.max(0, pinned ? top : top - vh * 0.25);
  const end = Math.min(max, Math.max(start, top + el.offsetHeight - vh * (pinned ? 1 : 0.5)));
  return [Math.min(start, max), end];
}

/* Drive the page scroll with a GSAP tween so a tour can pause, resume and be cancelled.
   Lenis is moved immediately each tick, so ScrollTrigger pins and scrubs run exactly as if
   the visitor were scrolling. */
export function glide(to: number, duration: number, ease = "sine.inOut", from = window.scrollY) {
  const p = { y: from };
  return gsap.to(p, {
    y: to, duration, ease,
    onUpdate: () => (lenis ? lenis.scrollTo(p.y, { immediate: true, force: true }) : window.scrollTo(0, p.y)),
  });
}

export { gsap, ScrollTrigger };
