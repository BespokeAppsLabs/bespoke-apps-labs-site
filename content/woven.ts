/* Content added for the v4 "Woven Studio" homepage. Capabilities, method and engagement
   copy stay in capabilities.ts; this file holds only what is new. Project and founder facts
   are taken from the founder's profile site (lucas_semenya_profile_site/lib/data.ts),
   trimmed to claims that are verifiable — no unaudited counts. */
import type { Face } from "@/components/nova/pearl";

export const FOUNDER = {
  name: "Lucas Semenya",
  role: "Founder & CEO",
  site: "https://lucassemenya.co.za",
  linkedin: "https://www.linkedin.com/in/lucas-semenya-50665564/",
  thesis: "Every manual process is a systemic bug.",
  bio: "Lucas founded Bespoke Applications Labs in 2023 to build the systems complex businesses actually run on. Before that he shipped production platforms at Technanimals — the Msaada gig-worker platform, the NUM case-management system and the NSFAS accommodation portal.",
  timeline: [
    { period: "2023 — now", title: "Founder & CEO", org: "Bespoke Applications Labs" },
    { period: "2024 — 2025", title: "Software Engineer", org: "Technanimals" },
  ],
};

export type Project = {
  id: string; mark: string; title: string; layer: string; line: string; stack: string[];
  status: "Live" | "Active" | "In build" | "In-house"; tone: "green" | "gold" | "night";
  links?: { label: string; href: string }[];
};

/* Descriptions checked 2026-10-09 against the live sites and the wiki project pages. */
export const PROJECTS: Project[] = [
  { id: "malume", mark: "MU", title: "Malume", layer: "Applications", status: "Active", tone: "green",
    line: "School-transport platform for operators, drivers and parents: live trip tracking, digital agreements and recurring billing for South African operators.",
    stack: ["Expo", "React Native", "Convex", "Paystack"] },
  { id: "schoolrecord", mark: "SR", title: "School Record", layer: "Applications", status: "In build", tone: "night",
    line: "School management for South African primary schools — learners, staff, classes, marks and report cards, each school kept strictly to its own data.",
    stack: ["Next.js", "Convex", "Clerk"] },
  { id: "academy", mark: "BA", title: "Bespoke Academy", layer: "Academy", status: "Live", tone: "gold",
    line: "A 40-week AI robotics programme for Grades 8 to 11 in Lephalale, Limpopo. Hands-on, all equipment included, no prior experience needed.",
    stack: ["AI", "Robotics", "STEM"],
    links: [{ label: "Visit site", href: "https://www.bespokeacademy.co.za" }] },
  { id: "bonram", mark: "BR", title: "Bonram", layer: "Applications", status: "Live", tone: "night",
    line: "Two sites for one group: the corporate site for Bonram (Pty) Ltd, a BBBEE Level 1 multi-service company, and a quote-first hire portal for events and plant.",
    stack: ["Next.js", "Convex", "TypeScript"],
    links: [{ label: "Main site", href: "https://www.bonram.co.za" }, { label: "Rentals", href: "https://bonramrentals.co.za" }] },
  { id: "safetyshelf", mark: "SS", title: "The Safety Shelf", layer: "Applications", status: "Live", tone: "green",
    line: "A digital bookstore of practical health and safety guides for families, homes and workplaces — instant access, read in your language on any device.",
    stack: ["Next.js", "Convex", "Paystack"],
    links: [{ label: "Visit site", href: "https://www.safety-shelf.co.za" }] },
  { id: "nova", mark: "NV", title: "NOVA", layer: "Media Engine", status: "In-house", tone: "gold",
    line: "The guide on this page. Researches, drafts and produces creative for three accounts — every post approved by a person.",
    stack: ["Agents", "Three.js", "HyperFrames", "Voice"],
    /* the brand accounts Nova runs (wiki: Projects/NOVA-Social-Agent); LinkedIn is the founder's personal profile, so not listed here */
    links: [
      { label: "X", href: "https://x.com/BespokeAppsLabs" },
      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61594024137840" },
      { label: "YouTube", href: "https://www.youtube.com/@BespokeApplicationsLabs" },
    ] },
];

/* Nova's scripted tour. `line` is both her caption and the exact script of her narration
   clip, public/nova/tour/<id>.mp3 (Voicebox profile Nova-Video — her locked public voice).
   Change a line and the clip must be regenerated: scripts/nova-tour-audio.sh.
   Agent-backed answers (Agents SDK + OpenRouter) come after launch; until then every word is
   fixed copy, so she can never say something unapproved. */
export type Stop = { id: string; label: string; line: string; face: Face };
export const TOUR: Stop[] = [
  { id: "top", label: "Start", face: "happy",
    line: "Hi, I'm Nova. I work here at Bespoke Applications Labs. I'll walk you through the studio in about two minutes." },
  { id: "manifesto", label: "The studio", face: "calm",
    line: "First, the studio. We map where the work actually breaks, build the systems that fix it, and leave your team owning them, able to run it all without us." },
  { id: "layers", label: "Services", face: "listening",
    line: "These are our six services: applications, agent systems, media, BespokeOS, networks and the academy. Each one stands on its own, and together they work as one system." },
  { id: "agents", label: "Agents", face: "thinking",
    line: "Our agent systems work inside the business, not beside it. They read the inbox, score the lead and draft the reply. But every step that matters waits for a person to approve it." },
  { id: "os", label: "BespokeOS", face: "wink",
    line: "BespokeOS is the window we run our own studio from. One lead operator, clearly separated sections, and a record of every action. Media is my section." },
  { id: "method", label: "Method", face: "calm",
    line: "Every project moves through four phases: map, frame, build and hand over. Each one ends at a gate, so you can stop at any point holding something useful." },
  { id: "work", label: "Work", face: "shy",
    line: "Here's some of what's already running. Products we build for clients, and some we run ourselves first. I'm on this list, which I'm told is not bragging." },
  { id: "founder", label: "Founder", face: "happy",
    line: "Bespoke was founded by Lucas Semenya, an engineer who believes every manual process is a systemic bug. His own site has the long version." },
  { id: "contact", label: "Start a project", face: "excited",
    line: "That's the tour. If something in your business keeps breaking, tell us here. A person reads every message and replies." },
];
