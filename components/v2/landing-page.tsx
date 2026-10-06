import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Command,
  GraduationCap,
  Network,
  ScanLine,
  LayoutGrid,
  Sparkles,
  Workflow,
} from "lucide-react";

const capabilities = [
  { number: "01", name: "Applications", detail: "Web platforms, mobile products, internal tools", icon: Command },
  { number: "02", name: "Agent Systems", detail: "AI operators that act across your business", icon: Bot },
  { number: "03", name: "Media Engine", detail: "Creative production systems with AI at the core", icon: Sparkles },
  { number: "04", name: "BespokeOS", detail: "One AI operator over the whole business, with a human on every approval", icon: LayoutGrid },
  { number: "05", name: "Networks", detail: "Secure, intelligent infrastructure for serious operations", icon: Network },
  { number: "06", name: "Academy", detail: "Practical AI and digital capability for teams", icon: GraduationCap },
];

const principles = [
  ["01", "Start where the work breaks", "We map the real hand-offs, repetitions and blind spots before choosing technology."],
  ["02", "Build the operating advantage", "Applications, agents and infrastructure are designed as one system—not a pile of tools."],
  ["03", "Leave a system that holds", "Clear interfaces, human approval points, production discipline and room to grow."],
];

function Mark() {
  return <span className="labs-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function Header() {
  return (
    <header className="labs-header">
      <Link href="/" className="labs-brand" aria-label="Bespoke Applications Labs home">
        <Mark />
        <span><b>Bespoke</b><em>Applications Labs</em></span>
      </Link>
      <nav aria-label="Main navigation">
        <a href="#work">Capabilities</a>
        <a href="#method">Method</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="labs-header-cta" href="mailto:info@bespokeapps.co.za">Start a conversation <ArrowUpRight size={15} /></a>
    </header>
  );
}

function Hero() {
  return (
    <section className="labs-hero">
      <div className="labs-orbit" aria-hidden="true"><span /><span /><span /></div>
      <div className="labs-hero-copy">
        <p className="labs-eyebrow"><span /> Independent digital systems studio</p>
        <h1>Make the<br /><i>work</i> work.</h1>
        <p className="labs-intro">Bespoke Applications Labs engineers the applications, AI operators and infrastructure that turn complex businesses into clear, capable systems.</p>
        <div className="labs-actions">
          <a className="labs-button" href="#contact">Build with us <ArrowDownRight size={18} /></a>
          <a className="labs-text-link" href="#work">Explore the lab <span>↘</span></a>
        </div>
      </div>
      <aside className="labs-hero-specimen" aria-label="Bespoke operating system illustration">
        <div className="labs-specimen-head"><span>System / 01</span><span>Built for motion</span></div>
        <div className="labs-specimen-core"><div className="labs-core-mark"><Mark /></div><p>Business<br />in motion</p></div>
        <div className="labs-specimen-data"><span>Inputs</span><b>People · Process · Data</b><span>Output</span><b>Operational leverage</b></div>
      </aside>
      <div className="labs-scroll-note"><span>Scroll to inspect</span><i /></div>
    </section>
  );
}

function CapabilityIndex() {
  return (
    <section className="labs-section labs-work" id="work">
      <div className="labs-section-heading">
        <p className="labs-eyebrow"><span /> Capability index</p>
        <h2>Not digital theatre.<br /><i>Working advantage.</i></h2>
        <p>We work across the layers that determine whether a business moves: product, intelligence, communications, operations and infrastructure.</p>
      </div>
      <div className="labs-capability-list">
        {capabilities.map(({ number, name, detail, icon: Icon }) => (
          <article className="labs-capability" key={number}>
            <span className="labs-number">{number}</span>
            <Icon className="labs-capability-icon" strokeWidth={1.25} />
            <h3>{name}</h3>
            <p>{detail}</p>
            <ArrowUpRight className="labs-capability-arrow" size={19} />
          </article>
        ))}
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="labs-method" id="method">
      <div className="labs-method-title">
        <p className="labs-eyebrow"><span /> How we operate</p>
        <h2>Technology should feel<br />like <i>momentum.</i></h2>
      </div>
      <div className="labs-principles">
        {principles.map(([number, title, copy]) => <article key={number}>
          <span>{number}</span><h3>{title}</h3><p>{copy}</p>
        </article>)}
      </div>
      <div className="labs-signal"><ScanLine size={17} /><span>Systems thinking, without the theatre.</span><b>01—06</b></div>
    </section>
  );
}

function Proof() {
  return (
    <section className="labs-proof">
      <div className="labs-proof-frame">
        <p className="labs-eyebrow"><span /> The Bespoke difference</p>
        <div><h2>Your operation is<br />the <i>brief.</i></h2><p>We do not start with a template, a trend, or an AI feature in search of a problem. We start by understanding the work—then build the system that makes it better.</p></div>
        <div className="labs-proof-tags"><span><Workflow size={16} /> Designed around reality</span><span><BrainCircuit size={16} /> AI where it earns its place</span></div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="labs-contact" id="contact">
      <p className="labs-eyebrow"><span /> A better system starts here</p>
      <h2>Bring us the<br /><i>hard part.</i></h2>
      <a href="mailto:info@bespokeapps.co.za" className="labs-contact-link">info@bespokeapps.co.za <ArrowUpRight /></a>
      <footer><span>© {new Date().getFullYear()} Bespoke Applications Labs</span><span>Built to be useful.</span></footer>
    </section>
  );
}

export default function V2LandingPage() {
  return <main className="labs"><Header /><Hero /><CapabilityIndex /><Method /><Proof /><Contact /></main>;
}
