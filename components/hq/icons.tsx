import { Bot, Command, GraduationCap, Network, ShoppingBag, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

/* The same icons the current site already uses for these six capabilities
   (components/v2/landing-page.tsx) — continuity, not a new vocabulary. */
export const ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  apps: Command,
  agents: Bot,
  media: Sparkles,
  square: ShoppingBag,
  networks: Network,
  academy: GraduationCap,
};

export function CapIcon({ id, size = 22 }: { id: string; size?: number }) {
  const I = ICONS[id];
  return I ? <I size={size} strokeWidth={1.5} className="hq-icon" /> : null;
}
