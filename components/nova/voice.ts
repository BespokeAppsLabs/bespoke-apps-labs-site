/* Nova's narration player. One reused <audio> element plays public/nova/tour/<id>.mp3.
   Autoplay rules (Safari strictest) only let audio start inside a user gesture, so the first
   clip must be started synchronously from the click; reusing the same element keeps it
   unlocked for the clips that follow automatically. The Web Audio analyser that drives her
   lip-sync is attached only once its context is actually running — routing an element into
   a suspended context would silence it. The on/off choice is remembered per visitor. */
import { useSyncExternalStore } from "react";

const KEY = "nova-audio";
let enabled = true;
let el: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let buf: Uint8Array<ArrayBuffer> | null = null;
let wired = false;
let settle: ((ok: boolean) => void) | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

if (typeof window !== "undefined") {
  try { enabled = localStorage.getItem(KEY) !== "off"; } catch { /* storage blocked: default on */ }
}

function element() {
  if (el) return el;
  el = new Audio();
  el.preload = "auto";
  el.addEventListener("ended", () => { settle?.(true); settle = null; });
  el.addEventListener("error", () => { settle?.(false); settle = null; });
  return el;
}

/* Lip-sync analyser: optional. Must be called from the gesture so resume() is allowed. */
function wire(a: HTMLAudioElement) {
  if (wired) return;
  try {
    ctx ??= new AudioContext();
    const connect = () => {
      if (wired || ctx!.state !== "running") return;
      analyser = Object.assign(ctx!.createAnalyser(), { fftSize: 512 });
      buf = new Uint8Array(analyser.fftSize);
      const src = ctx!.createMediaElementSource(a);
      src.connect(analyser);
      analyser.connect(ctx!.destination);
      wired = true;
    };
    if (ctx.state === "running") connect();
    else { ctx.addEventListener("statechange", connect); void ctx.resume().then(connect, () => {}); }
  } catch { /* no Web Audio: the clip still plays directly, lip-sync uses a scripted envelope */ }
}

export const voice = {
  enabled: () => enabled,
  subscribe: (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; },
  set(on: boolean) {
    enabled = on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch { /* ignore */ }
    if (!on) voice.stop();
    emit();
  },
  /* Call synchronously inside the click that starts or steers the tour. Resolves true only
     when the clip played through to its end; false if audio is off, was blocked, failed to
     load, or was stopped — callers auto-advance only on true. */
  play(id: string): Promise<boolean> {
    voice.stop();
    if (!enabled) return Promise.resolve(false);
    const a = element();
    wire(a);
    a.src = `/nova/tour/${id}.mp3`;
    a.currentTime = 0;
    return new Promise((resolve) => {
      settle = resolve;
      a.play().catch(() => { if (settle === resolve) { settle = null; resolve(false); } });
    });
  },
  /* Hold and continue without ending the clip (the tour's pause button). */
  pause() { if (el && !el.paused) el.pause(); },
  resume() { if (el && el.paused && !el.ended && settle) void el.play().catch(() => {}); },
  /* Seconds in the current clip once its metadata is known; null if nothing is loading. */
  duration(): Promise<number | null> {
    const a = el;
    if (!a || !settle) return Promise.resolve(null);
    if (Number.isFinite(a.duration) && a.duration > 0) return Promise.resolve(a.duration);
    return new Promise((r) => {
      const ok = () => r(Number.isFinite(a.duration) ? a.duration : null);
      a.addEventListener("loadedmetadata", ok, { once: true });
      a.addEventListener("error", () => r(null), { once: true });
      window.setTimeout(() => r(null), 3000);
    });
  },
  stop() { if (el && !el.paused) el.pause(); settle?.(false); settle = null; },
  playing: () => !!el && !el.paused && !el.ended,
  /* 0..1 loudness of the playing clip, or -1 when nothing is playing. */
  level(): number {
    if (!el || el.paused || el.ended) return -1;
    if (!wired || !analyser || !buf) { const t = performance.now() / 1000; return 0.25 + 0.55 * Math.abs(Math.sin(t * 9.5) * Math.sin(t * 3.1)); }
    analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
    return Math.min(1, Math.sqrt(sum / buf.length) * 5);
  },
};

export const useVoiceEnabled = () => useSyncExternalStore(voice.subscribe, voice.enabled, () => true);
