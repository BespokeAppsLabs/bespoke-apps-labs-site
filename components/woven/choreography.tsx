"use client";
/* Every scroll-driven move on the homepage, declared against data-* hooks in home.tsx.
   House rules from the animate skill: 0.4s sharp-in, then a clean hold; one green punch per
   section; nothing auto-plays that a reader needs to have seen. Reduced motion: none of the
   pins or scrubs are created and everything renders in its final state (woven.css). */
import { useEffect } from "react";
import { gsap, ScrollTrigger, reducedMotion, startScroll } from "./scroll";
import { nova } from "@/components/nova/store";
import type { Face } from "@/components/nova/pearl";

const EASE = "expo.out";

export function Choreography() {
  useEffect(() => {
    document.documentElement.classList.add("w-js");
    if (reducedMotion()) {
      document.documentElement.classList.add("w-still");
      return reactions();
    }
    const stopScroll = startScroll();
    const offReactions = reactions();
    const offPointer = pointerEffects();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* page progress hairline + nav condense */
      gsap.to("[data-progress]", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      ScrollTrigger.create({ start: 80, end: "max", toggleClass: { targets: "[data-nav]", className: "is-condensed" } });

      /* hero intro: words rise from masks, then the supporting copy */
      const intro = gsap.timeline({ defaults: { ease: EASE, duration: 1 } });
      intro.from("#top [data-split] .w-word > span", { yPercent: 115, rotate: 4, stagger: 0.06 })
        .from("#top [data-rise]", { y: 28, opacity: 0, stagger: 0.09, duration: 0.8 }, "-=0.7")
        .from("[data-nav]", { y: -24, opacity: 0, duration: 0.6 }, "-=0.8")
        .call(() => nova.say("Hi, I'm Nova. I work here.", "happy"), [], "-=0.2");

      /* hero scroll-out: copy lifts faster than the page, the glow drifts slower */
      gsap.to("[data-hero-copy]", { yPercent: -18, opacity: 0.15, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });

      /* section headlines (everything except the hero) */
      gsap.utils.toArray<HTMLElement>("main section:not(#top) [data-split]").forEach((h) => {
        gsap.from(h.querySelectorAll(".w-word > span"), { yPercent: 115, rotate: 3, stagger: 0.05, duration: 0.9, ease: EASE, scrollTrigger: { trigger: h, start: "top 85%" } });
      });
      gsap.utils.toArray<HTMLElement>("main section:not(#top) [data-rise]").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.8, ease: EASE, scrollTrigger: { trigger: el, start: "top 90%" } });
      });

      /* parallax layers */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const k = parseFloat(el.dataset.parallax || "0");
        gsap.fromTo(el, { yPercent: -k * 100 }, { yPercent: k * 100, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* manifesto: words light up as you read */
      const scrub = document.querySelector<HTMLElement>("[data-scrub-words]");
      if (scrub) {
        const words = scrub.textContent!.trim().split(/\s+/);
        scrub.setAttribute("aria-label", scrub.textContent!.trim());
        scrub.innerHTML = words.map((w) => `<span aria-hidden="true">${w} </span>`).join("");
        gsap.fromTo(scrub.children, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: scrub, start: "top 75%", end: "bottom 45%", scrub: true } });
      }

      /* layers: vertical scroll becomes a horizontal pan on wide screens */
      mm.add("(min-width: 900px)", () => {
        const sec = document.querySelector<HTMLElement>("[data-hscroll]");
        const tr = document.querySelector<HTMLElement>("[data-htrack]");
        const path = document.querySelector<SVGPathElement>("[data-hthread]");
        if (!sec || !tr) return;
        const dist = () => Math.max(0, tr.scrollWidth + tr.offsetLeft - window.innerWidth + 64);
        const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${dist()}`, pin: ".w-layers-pin", scrub: 0.6, invalidateOnRefresh: true } });
        tl.to(tr, { x: () => -dist(), ease: "none" }, 0);
        if (path) { const len = path.getTotalLength(); gsap.set(path, { strokeDasharray: len, strokeDashoffset: len }); tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0); }
        tr.querySelectorAll(".w-slab").forEach((card, i) => {
          tl.fromTo(card, { y: 60, rotateY: -14, opacity: 0.35 }, { y: 0, rotateY: 0, opacity: 1, ease: "power2.out", duration: 0.18 }, i * 0.11);
        });
      });

      /* agents: pin the pipeline and play it with the scroll; step four waits */
      const pipe = document.querySelector<HTMLElement>("[data-pipeline]");
      if (pipe) {
        mm.add("(min-width: 900px)", () => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: pipe, start: "top top", end: "+=140%", pin: true, scrub: 0.5 } });
          pipe.querySelectorAll("[data-step]").forEach((st, i) => tl.to(st, { "--on": 1, duration: 1 }, i * 1.2).from(st, { x: 40, opacity: 0, duration: 0.6 }, i * 1.2));
          tl.from("[data-approve]", { y: 60, scale: 0.94, opacity: 0, duration: 1, ease: "back.out(1.6)" }, 3.8)
            .call(() => nova.face("happy"), [], 4.6).to({}, { duration: 1.5 });
        });
        mm.add("(max-width: 899px)", () => {
          gsap.to(pipe.querySelectorAll("[data-step]"), { "--on": 1, stagger: 0.4, scrollTrigger: { trigger: ".w-pipe", start: "top 70%" } });
        });
      }

      /* BespokeOS: the window tilts up out of the page */
      gsap.fromTo("[data-os-window]", { rotateX: 28, scale: 0.86, y: 120, opacity: 0.4 },
        { rotateX: 0, scale: 1, y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: ".w-os-stage", start: "top 95%", end: "top 25%", scrub: 0.6 } });
      gsap.from("[data-os-item]", { x: -24, opacity: 0, stagger: 0.07, duration: 0.5, ease: EASE, scrollTrigger: { trigger: ".w-os-stage", start: "top 45%" } });
      gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((b) => {
        gsap.fromTo(b, { scaleX: 0 }, { scaleX: parseFloat(b.dataset.bar || "0"), duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 80%" } });
      });

      /* method: the thread draws and a mint dot rides it from gate to gate */
      const mp = document.querySelector<SVGPathElement>("[data-method-path]");
      const dot = document.querySelector<HTMLElement>("[data-method-dot]");
      if (mp && dot) {
        const len = mp.getTotalLength(), svg = mp.ownerSVGElement!, nodes = gsap.utils.toArray<HTMLElement>("[data-node]");
        gsap.set(mp, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({
          trigger: "[data-method]", start: "top 65%", end: "bottom 70%", scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            mp.style.strokeDashoffset = String(len * (1 - p));
            const pt = mp.getPointAtLength(len * p), box = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
            dot.style.transform = `translate(${(pt.x / vb.width) * box.width}px, ${(pt.y / vb.height) * box.height}px)`;
            nodes.forEach((n, i) => n.classList.toggle("is-on", p >= i / (nodes.length - 1) - 0.02));
          },
        });
      }

      /* the gold thread motif on every slab tile */
      gsap.utils.toArray<SVGPathElement>(".w-tile path, .w-card-art path").forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: (i % 9) * 0.04, scrollTrigger: { trigger: p.closest("article")!, start: "top 85%" } });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    return () => { ctx.revert(); stopScroll(); offReactions(); offPointer(); };
  }, []);
  return null;
}

/* Nova reacts once to each section as it arrives, once she is docked. */
function reactions() {
  const said = new Set<string>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement, face = el.dataset.novaFace as Face | undefined, line = el.dataset.novaLine;
      if (nova.get().touring) continue; // the tour sets her face and words itself
      if (face) nova.face(face);
      if (line && !said.has(el.id) && nova.get().docked) { said.add(el.id); nova.say(line, face); }
    }
  }, { rootMargin: "-45% 0px -45% 0px" });
  document.querySelectorAll("[data-nova-face]").forEach((s) => io.observe(s));
  const onSent = () => { nova.say("Sent. A person will reply — not a sequence.", "excited"); nova.hop(); };
  window.addEventListener("contact:sent", onSent);
  return () => { io.disconnect(); window.removeEventListener("contact:sent", onSent); };
}

/* Tilt on slabs and cards, magnetic pull on primary buttons. Fine pointers only. */
function pointerEffects() {
  if (!window.matchMedia("(pointer: fine)").matches) return () => {};
  const offs: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    const rx = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3" }), ry = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 10); rx(-((e.clientY - r.top) / r.height - 0.5) * 10); el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`); el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`); };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    offs.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
  });
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" }), y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.3); };
    const leave = () => { x(0); y(0); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    offs.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
  });
  return () => offs.forEach((f) => f());
}
