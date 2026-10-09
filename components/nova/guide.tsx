"use client";
/* Nova as the site guide: the dock button, her audio toggle, her speech bubble and the
   narrated tour. The tour scrolls FOR the visitor: each stop glides to its section, then
   travels through the section's whole scroll range (pins, pans and scrubs included) for as
   long as Nova talks about it, and moves on by itself. The red button pauses everything —
   scroll, voice and auto-advance — and the same button continues. Scrolling by hand mid-tour
   pauses it too. Scripted on purpose — live answers (Agents SDK + OpenRouter) come after launch. */
import { useEffect, useState } from "react";
import { TOUR } from "@/content/woven";
import { nova, useNova } from "./store";
import { voice, useVoiceEnabled } from "./voice";
import { gsap, glide, reducedMotion, sectionRange } from "@/components/woven/scroll";

const TRAVEL = 1.1; // s to glide to a stop's section
const LIFTOFF = 3.4; // s for the first leg out of the hero — slow enough to watch Nova fly to her dock
const BREATH = 1.2; // s of quiet between stops

type Ui = { i: number | null; paused: boolean };
let setUi: ((u: Ui) => void) | null = null;
let token = 0;                                   // bumps on navigation; stale work checks it and bails
let currentStop: number | null = null;
let paused = false;
let pausedAt = 0;
let target = 0;                                  // scroll position the current stop ends at
let tl: gsap.core.Timeline | null = null;        // the current stop's scroll
let next: gsap.core.Tween | null = null;         // pending auto-advance
let scrolled: (() => void) | null = null;        // resolves when the current stop's scroll is done
const ui = () => setUi?.({ i: currentStop, paused });
const readTime = (line: string) => Math.max(4, line.split(" ").length * 0.38);

function runScroll(steps: (t: gsap.core.Timeline) => void) {
  tl?.kill();
  tl = gsap.timeline({ onComplete: () => scrolled?.() });
  steps(tl);
}

export function goToStop(i: number) {
  const stop = TOUR[i];
  if (!stop) return;
  const mine = ++token;
  currentStop = i; paused = false;
  next?.kill(); next = null;
  nova.touring(true); ui();

  /* audio first, synchronously inside the click — browsers only allow gesture-started sound */
  const audio = voice.enabled();
  nova.say(stop.line, stop.face, !audio);
  const heard = audio ? voice.play(stop.id) : Promise.resolve(false);
  if (!audio) voice.stop();

  const [from, to] = sectionRange(stop.id);
  const still = reducedMotion();
  target = still ? from : to;
  const done = new Promise<void>((r) => { scrolled = r; });

  void (async () => {
    const d = (audio ? await voice.duration() : null) ?? readTime(stop.line);
    if (mine !== token) return;
    runScroll((t) => {
      if (still) { t.add(glide(from, 0.01)); t.to({}, { duration: d }); return; }
      /* leaving the hero: one slow, even leg across Nova's flight to the dock, then on to the section */
      const heroH = document.getElementById("top")?.offsetHeight ?? window.innerHeight;
      const dockedAt = heroH * 0.75;
      if (window.scrollY < dockedAt && from > dockedAt) {
        t.add(glide(dockedAt, LIFTOFF, "power1.inOut"));
        t.add(glide(from, TRAVEL, "power2.inOut", dockedAt));
      } else t.add(glide(from, TRAVEL, "power2.inOut"));
      t.add(glide(to, Math.max(1, d - TRAVEL * 0.5), "sine.inOut", from));
    });
    if (paused) tl?.pause();
    await Promise.all([heard, done]);
    if (mine !== token || i >= TOUR.length - 1) return;
    next = gsap.delayedCall(BREATH, () => { if (mine === token) goToStop(i + 1); });
    if (paused) next.pause();
  })();
}

export function pauseTour() {
  if (currentStop === null || paused) return;
  paused = true; pausedAt = window.scrollY;
  tl?.pause(); next?.pause(); voice.pause();
  nova.face("listening"); ui();
}

export function resumeTour() {
  if (currentStop === null || !paused) return;
  paused = false;
  /* if the visitor scrolled away while paused, carry on from where they are now */
  if (tl && tl.progress() < 1 && Math.abs(window.scrollY - pausedAt) > 30) {
    const left = Math.max(0.8, tl.duration() - tl.time());
    runScroll((t) => { t.add(glide(target, left, "sine.inOut")); });
  } else tl?.resume();
  next?.resume(); voice.resume();
  nova.face(TOUR[currentStop].face); ui();
}

export const startTour = () => goToStop(0);
export const jumpTo = (id: string) => { const i = TOUR.findIndex((s) => s.id === id); if (i >= 0) goToStop(i); };
function endTour() {
  token++; currentStop = null; paused = false;
  tl?.kill(); next?.kill(); tl = null; next = null;
  voice.stop(); nova.touring(false); ui();
}

const Speaker = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    {on ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}
  </svg>
);

function AudioToggle({ className }: { className: string }) {
  const on = useVoiceEnabled();
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={on ? "Nova's voice is on. Turn it off" : "Nova's voice is off. Turn it on"}
      title={on ? "Mute Nova" : "Unmute Nova"}
      onClick={() => { voice.set(!on); if (!on && currentStop !== null && !paused) goToStop(currentStop); }}
    >
      <Speaker on={on} />
    </button>
  );
}

export function NovaGuide() {
  const s = useNova();
  const [open, setOpen] = useState(false);
  const [tour, setTour] = useState<Ui>({ i: null, paused: false });
  const [bubble, setBubble] = useState(false);

  useEffect(() => { setUi = (u) => { setTour(u); if (u.i !== null) setOpen(false); }; return () => { setUi = null; endTour(); }; }, []);
  useEffect(() => {
    if (!s.line) return;
    setBubble(true);
    const id = window.setTimeout(() => setBubble(false), Math.max(3500, s.talkUntil - performance.now() + 2600));
    return () => window.clearTimeout(id);
  }, [s.lineId, s.line, s.talkUntil]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); endTour(); return; }
      const t = e.target as HTMLElement;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key) && !t.closest("button, input, textarea, select")) pauseTour();
    };
    /* taking the wheel mid-tour means "let me look": pause rather than fight the visitor */
    const onManual = () => pauseTour();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onManual, { passive: true });
    window.addEventListener("touchmove", onManual, { passive: true });
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("wheel", onManual); window.removeEventListener("touchmove", onManual); };
  }, []);

  const end = () => { endTour(); nova.say("Any time. I'm down here.", "wink"); };
  const i = tour.i;

  return (
    <>
      {bubble && s.line && s.docked && i === null && !open && (
        <p className="nova-bubble" role="status" aria-live="polite">{s.line}</p>
      )}

      {s.docked && <AudioToggle className="nova-audio" />}

      <button
        type="button"
        className="nova-dock"
        data-on={s.docked || undefined}
        aria-label="Open Nova, the site guide"
        aria-expanded={open}
        onClick={() => { setOpen((o) => !o); nova.face(open ? "listening" : "happy"); }}
      />

      {open && (
        <div className="nova-panel" role="dialog" aria-label="Nova, site guide">
          <header>
            <span className="w-mono">Nova · site guide</span>
            <button type="button" className="nova-x" aria-label="Close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>
          <p>I can walk you through the studio in about two minutes, or take you straight to one part.</p>
          <div className="nova-panel-row">
            <button type="button" className="w-btn w-btn-mint" onClick={startTour}>Take the tour</button>
            <AudioToggle className="nova-audio-inline" />
          </div>
          <ul>
            {TOUR.slice(1).map((stop, k) => (
              <li key={stop.id}><button type="button" onClick={() => goToStop(k + 1)}>{stop.label}<span aria-hidden="true">→</span></button></li>
            ))}
          </ul>
          <small>Live answers are coming. For now a person handles anything you send through the form.</small>
        </div>
      )}

      {i !== null && (
        <div className="nova-tour" role="region" aria-label="Guided tour" data-paused={tour.paused || undefined}>
          <button
            type="button"
            className="nova-pause"
            aria-pressed={tour.paused}
            aria-label={tour.paused ? "Continue the tour" : "Pause the tour"}
            onClick={tour.paused ? resumeTour : pauseTour}
          >
            {tour.paused
              ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
              : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>}
            <span>{tour.paused ? "Continue" : "Pause"}</span>
          </button>
          <div className="nova-tour-text">
            <span className="w-mono">{tour.paused ? "Paused · " : "Tour · "}{i + 1} of {TOUR.length} · {TOUR[i].label}</span>
            <p aria-live="polite">{TOUR[i].line}</p>
            <i style={{ transform: `scaleX(${(i + 1) / TOUR.length})` }} />
          </div>
          <div className="nova-tour-ctl">
            <AudioToggle className="nova-audio-inline dark" />
            <button type="button" aria-label="Previous stop" disabled={i <= 0} onClick={() => goToStop(i - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            {i < TOUR.length - 1 ? (
              <button type="button" className="go" aria-label="Next stop" onClick={() => goToStop(i + 1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            ) : null}
            <button type="button" className="end" onClick={end}>End tour</button>
          </div>
        </div>
      )}
    </>
  );
}
