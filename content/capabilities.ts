export type Capability = {
  id: "apps" | "agents" | "media" | "square" | "networks" | "academy";
  n: "01" | "02" | "03" | "04" | "05" | "06";
  name: string;
  short: string;
  meta: string;
  bars: [number, number, number];
  angle: number;
  dialog: {
    title: string; body: string;
    aLabel: string; items: string[];
    bLabel: string; bText: string;
  };
};

export const capabilities: Capability[] = [
  {
    id: "apps", n: "01", name: "Applications", angle: 210, meta: "Product layer",
    bars: [5, 13, 8],
    short: "Web platforms, mobile products and internal tools, shaped around how the work really moves.",
    dialog: {
      title: "The product your operation actually runs on.",
      body: "Web platforms, mobile products and internal tools shaped around how the work really moves — not around a template. Built to be opened every morning by the people who do the job, and to still make sense in year three.",
      aLabel: "What it covers",
      items: ["Product design and front-end", "Application and API engineering", "Internal tools, admin and reporting", "Deployment, monitoring and handover"],
      bLabel: "Typical shape",
      bText: "Most start as one painful workflow and grow into the system that replaces it. We ship the first useful slice early, then widen it.",
    },
  },
  {
    id: "agents", n: "02", name: "Agent Systems", angle: 180, meta: "Intelligence layer",
    bars: [13, 6, 10],
    short: "AI operators that act inside the business rather than chatting beside it.",
    dialog: {
      title: "Operators that do the work, with a human on the brake.",
      body: "AI that acts inside your business rather than chatting beside it: reading the inbox, scoring the lead, drafting the reply, updating the record. Every consequential step keeps an explicit approval point.",
      aLabel: "What it covers",
      items: ["Triage, scoring and routing pipelines", "Drafting and review agent pairs", "Tool use against your real systems", "Approval queues and audit trails"],
      bLabel: "Where it earns its place",
      bText: "Where a person repeats the same judgement dozens of times a week. We automate the repetition and keep the judgement.",
    },
  },
  {
    id: "media", n: "03", name: "Media Engine", angle: 150, meta: "Creative layer",
    bars: [8, 11, 13],
    short: "Creative production as a pipeline, with brand rules living in the system.",
    dialog: {
      title: "Creative output as a production line, not a scramble.",
      body: "Generation, review and publishing wired into one pipeline so campaign work stops depending on who happens to be free. Brand rules live in the system, not in a shared folder nobody opens.",
      aLabel: "What it covers",
      items: ["Generative image and video pipelines", "Brand and template systems", "Review, approval and versioning", "Scheduling and distribution"],
      bLabel: "Typical shape",
      bText: "Teams already producing volume by hand, where the bottleneck is coordination rather than ideas.",
    },
  },
  {
    id: "square", n: "04", name: "Town Square", angle: 330, meta: "Commerce layer",
    bars: [11, 13, 5],
    short: "Marketplaces, storefronts and the unglamorous machinery beneath them.",
    dialog: {
      title: "The infrastructure under local commerce.",
      body: "Marketplaces, storefronts and the unglamorous machinery beneath them — listings, payments, fulfilment, disputes. Built for merchants who need it to work on a bad-signal phone on a busy Saturday.",
      aLabel: "What it covers",
      items: ["Multi-merchant marketplace platforms", "Payments, payouts and reconciliation", "Catalogue, inventory and fulfilment", "Merchant onboarding and support tools"],
      bLabel: "Typical shape",
      bText: "An operator with real supply and real demand who is currently holding both together with spreadsheets and WhatsApp.",
    },
  },
  {
    id: "networks", n: "05", name: "Networks", angle: 0, meta: "Infrastructure layer",
    bars: [6, 9, 13],
    short: "Connectivity for sites where downtime has a cost, monitored and documented.",
    dialog: {
      title: "Connectivity that does not need a hero to stay up.",
      body: "Network and infrastructure design for sites where downtime has a cost — offices, schools, venues, multi-branch operations. Monitored continuously, documented properly, recoverable by someone other than us.",
      aLabel: "What it covers",
      items: ["Site survey and network design", "Segmentation, access and policy", "Monitoring and automated response", "Documentation and on-site handover"],
      bLabel: "Typical shape",
      bText: "Multi-site operations where nobody can currently say, with confidence, what is connected to what.",
    },
  },
  {
    id: "academy", n: "06", name: "Academy", angle: 30, meta: "Capability layer",
    bars: [13, 8, 11],
    short: "Practical capability for the people who will run what we build.",
    dialog: {
      title: "Capability that stays after we leave.",
      body: "Practical training for the people who will run what we build. Not an AI-hype seminar — the specific tools, habits and judgement your team needs to keep the system improving without us.",
      aLabel: "What it covers",
      items: ["Role-specific AI working sessions", "Digital literacy foundations", "Internal enablement and documentation", "Ongoing office hours"],
      bLabel: "Typical shape",
      bText: "Paired with a build, so the team learns on the system they are about to own rather than on a generic example.",
    },
  },
];

export const phases = [
  { n: "01", name: "map", focus: "Where the work actually breaks", live: true },
  { n: "02", name: "frame", focus: "Scope, approval points, sequence", live: false },
  { n: "03", name: "build", focus: "Application, operators, infrastructure", live: false },
  { n: "04", name: "hand over", focus: "Documentation, training, ownership", live: false },
];

export type Extra = { id: string; title: string; kicker: string; body: string; aLabel: string; items: string[]; bLabel: string; bText: string };
export const extras: Extra[] = [
  {
    id: "studio", title: "The Studio", kicker: "THE STUDIO",
    body: "Bespoke Applications Labs engineers the applications, AI operators and infrastructure that turn complex businesses into clear, capable systems. We work across the layers that decide whether a business actually moves — product, intelligence, creative, commerce, infrastructure and capability — and we work on the parts that are hard.",
    aLabel: "How we engage",
    items: ["Small senior team, one system at a time", "Fixed scope per phase, reviewed at each gate", "Your systems, your data, your accounts", "Handover documentation as a deliverable"],
    bLabel: "What we do not do",
    bText: "We do not start with a template, a trend, or an AI feature in search of a problem — and we do not leave behind a system that needs us to stay alive.",
  },
  {
    id: "method", title: "Method", kicker: "METHOD",
    body: "Three principles, in order. We map the real hand-offs before choosing any technology. We design applications, agents and infrastructure as one system rather than a pile of tools. And we finish only when your team can run, explain and extend it without us on the call.",
    aLabel: "The principles",
    items: ["01 — Start where the work breaks", "02 — Build the operating advantage", "03 — Leave a system that holds"],
    bLabel: "Why it matters",
    bText: "Most failed systems were built to a brief that described the symptom. A pile of tools compounds cost; a system compounds leverage. And a system that only survives with its builder attached is not an asset, it is a dependency.",
  },
  {
    id: "disciplines", title: "Disciplines", kicker: "DISCIPLINES",
    body: "Deliberately narrow. We would rather be genuinely excellent across four disciplines that compose into one system than adequate across twenty that do not.",
    aLabel: "What we run on",
    items: ["/product — Next.js, React, TypeScript", "/agents — Claude, tool use, approval queues", "/infra — Vercel, Postgres, networks", "/media — generative pipelines, brand systems"],
    bLabel: "Why narrow",
    bText: "Because the disciplines cross over. The same team that builds the application wires the operator into it and puts it on infrastructure it understands. Nothing is thrown over a wall.",
  },
  {
    id: "rhythm", title: "Operating Rhythm", kicker: "OPERATING RHYTHM",
    body: "No discovery theatre and no open-ended retainer. Each phase has a fixed scope, a named output and a gate you can stop at.",
    aLabel: "The phases",
    items: ["01 map — where the work actually breaks", "02 frame — scope, approval points, sequence", "03 build — application, operators, infrastructure", "04 hand over — documentation, training, ownership"],
    bLabel: "What you get at each gate",
    bText: "A systems map, then a build plan, then a running system, then a system your team owns. You can walk away after any of them holding something useful.",
  },
];

export const engage: Extra = {
  id: "engage", title: "Bring us the hard part.", kicker: "ENGAGEMENT",
  body: "Tell us what keeps breaking. The first session is a working one: forty minutes on your actual process, ending with an honest read on whether this is worth building — including when the answer is no.",
  aLabel: "Bring along",
  items: ["The process that keeps failing", "Who touches it, and where it stalls", "What it costs you when it does", "Anything already built that has to survive"],
  bLabel: "Send it",
  bText: "hello@bespokelabs.dev — or use the form. We reply from a person, not a sequence.",
};
