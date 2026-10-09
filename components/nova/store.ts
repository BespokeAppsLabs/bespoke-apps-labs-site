/* Tiny shared state for Nova: what face she wears and what she is saying. Sections, the
   guide and the 3D rig all talk through this, so none of them import each other. */
import { useSyncExternalStore } from "react";
import type { Face } from "./pearl";

type State = { face: Face; line: string; lineId: number; talkUntil: number; hop: number; docked: boolean; touring: boolean };
let state: State = { face: "listening", line: "", lineId: 0, talkUntil: 0, hop: 0, docked: false, touring: false };
const subs = new Set<() => void>();
const set = (patch: Partial<State>) => { state = { ...state, ...patch }; subs.forEach((f) => f()); };

export const nova = {
  get: () => state,
  subscribe: (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; },
  face: (face: Face) => set({ face }),
  /* She keeps the given expression and lip-syncs over it for roughly the reading time.
     talk=false when a real narration clip is playing — voice.level() drives the mouth then. */
  say: (line: string, face: Face = "happy", talk = true) =>
    set({ line, face, lineId: state.lineId + 1, talkUntil: talk ? performance.now() + Math.min(5200, 600 + line.split(" ").length * 230) : 0 }),
  hush: () => set({ line: "" }),
  hop: () => set({ hop: state.hop + 1 }),
  touring: (touring: boolean) => { if (touring !== state.touring) set({ touring }); },
  dock: (docked: boolean) => { if (docked !== state.docked) set({ docked }); },
};

export const useNova = () => useSyncExternalStore(nova.subscribe, nova.get, nova.get);
