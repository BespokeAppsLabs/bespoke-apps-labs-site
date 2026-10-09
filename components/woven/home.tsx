/* v4 "Woven Studio" homepage. Server-rendered in full — every word is in the HTML, and the
   client islands (Loom, NovaRig, NovaGuide, Choreography) only reveal and animate it. */
import { Fragment } from "react";
import ContactForm from "@/components/contact-form";
import { capabilities, phases, extras, engage } from "@/content/capabilities";
import { FOUNDER, PROJECTS } from "@/content/woven";
import { NovaRig } from "@/components/nova/nova-rig";
import { NovaGuide } from "@/components/nova/guide";
import { TourButton, JumpButton } from "@/components/nova/triggers";
import { Loom } from "./loom";
import { Choreography } from "./choreography";

/* Words wrapped for mask reveals; the text stays one readable string for crawlers and AT.
   `accent` is a contiguous phrase inside `text` that takes the accent colour. */
function Words({ text, accent }: { text: string; accent?: string }) {
  const words = text.split(" ");
  const a = accent ? accent.split(" ") : [];
  const start = a.length ? words.findIndex((_, i) => a.every((w, j) => words[i + j] === w)) : -1;
  return (
    <span className="w-words">
      <span className="w-sr">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w-word" aria-hidden="true">
            <span className={start >= 0 && i >= start && i < start + a.length ? "w-accent" : undefined}>{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </span>
  );
}

const Logo = () => <span className="w-logo"><b>&lt;</b>Bespoke<b>/&gt;</b></span>;
const Arrow = () => <svg viewBox="0 0 24 24" className="w-arrow" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const thread = "M0 60 C 160 0, 320 120, 480 60 S 800 0, 960 60 S 1280 120, 1440 60 S 1760 0, 1920 60 S 2240 120, 2400 60 S 2720 0, 2880 60";

export function WovenHome() {
  const method = extras.find((e) => e.id === "method")!;
  return (
    <main className="woven">
      <div className="w-progress" data-progress aria-hidden="true" />

      <header className="w-nav" data-nav>
        <a href="#top" className="w-nav-brand" aria-label="Bespoke Applications Labs, home"><Logo /><span className="w-mono">Applications Labs</span></a>
        <nav aria-label="Main">
          <a href="#layers">Services</a>
          <a href="#os">BespokeOS</a>
          <a href="#method">Method</a>
          <a href="#work">Work</a>
          <a href="#founder">Founder</a>
        </nav>
        <div className="w-nav-cta">
          <TourButton className="w-btn w-btn-line" ><i className="w-dot" aria-hidden="true" />Tour with Nova</TourButton>
          <a href="#contact" className="w-btn w-btn-mint" data-magnetic>Start a project</a>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section id="top" className="w-hero w-night" data-nova-face="happy">
        <Loom />
        <div className="w-hero-glow" data-parallax="-0.25" aria-hidden="true" />
        <div className="w-wrap w-hero-grid">
          <div className="w-hero-copy" data-hero-copy>
            <p className="w-kicker" data-rise>Applications · AI operators · Infrastructure — South Africa</p>
            <h1 className="w-display" data-split>
              <Words text="Let's build your system." accent="your system." />
            </h1>
            <p className="w-lead" data-rise>We engineer the applications, AI operators and infrastructure your operation runs on — and leave your team able to run them without us.</p>
            <div className="w-row" data-rise>
              <a href="#contact" className="w-btn w-btn-mint w-btn-lg" data-magnetic>Bring us the hard part <Arrow /></a>
              <TourButton className="w-btn w-btn-ghost w-btn-lg">Take the tour with Nova</TourButton>
            </div>
          </div>
          <div className="w-hero-nova">
            <div className="w-nova-anchor" data-nova-anchor>
              <div className="w-pearl-fallback" aria-hidden="true"><i /><i /></div>
            </div>
            <div className="w-hello" data-rise>
              <p><span className="w-mono">Nova · your guide</span>Hi, I&apos;m Nova. I work here. Two-minute tour, or straight to the part you came for?</p>
              <div className="w-chips">
                <JumpButton to="layers" className="w-chip">What you build</JumpButton>
                <JumpButton to="method" className="w-chip">How you work</JumpButton>
                <JumpButton to="contact" className="w-chip">I have a project</JumpButton>
              </div>
            </div>
          </div>
        </div>
        <div className="w-wrap w-hero-foot">
          {capabilities.map((c) => <a key={c.id} href="#layers" className="w-mono">{c.n} {c.name}</a>)}
          <span className="w-scrollcue w-mono" aria-hidden="true">Scroll — follow the thread<i /></span>
        </div>
      </section>

      {/* ───────── MANIFESTO ───────── */}
      <section id="manifesto" className="w-manifesto w-forest">
        <div className="w-wrap">
          <p className="w-mono w-gold">The studio</p>
          <p className="w-scrub" data-scrub-words>
            We map where the work actually breaks, build the applications, operators and infrastructure that fix it as one system, and leave your team owning it — documented, trained, and able to run it without us on the call.
          </p>
          <figure className="w-thesis" data-rise>
            <blockquote>“{FOUNDER.thesis}”</blockquote>
            <figcaption className="w-mono">{FOUNDER.name} · {FOUNDER.role}</figcaption>
          </figure>
        </div>
      </section>

      {/* ───────── SERVICES (horizontal) ───────── */}
      <section id="layers" className="w-layers w-paper" data-hscroll data-nova-face="listening">
        <div className="w-layers-pin">
          <div className="w-layers-head">
            <p className="w-mono w-green">01 · Services</p>
            <h2 className="w-h2" data-split><Words text="Six services. One system." accent="One system." /></h2>
            <p className="w-body">Each one stands on its own. Together they cover product, intelligence, creative, operations, infrastructure and capability — designed as one system, so nothing is thrown over a wall.</p>
            <JumpButton to="contact" className="w-link">Not sure which you need? Tell us what breaks <Arrow /></JumpButton>
          </div>
          <div className="w-layers-track" data-htrack>
            <svg className="w-layers-thread" viewBox="0 0 2880 120" preserveAspectRatio="none" aria-hidden="true">
              <path d={thread} className="ghost" />
              <path d={thread} data-hthread />
            </svg>
            {capabilities.map((c, i) => (
              <article key={c.id} className="w-slab" data-tilt>
                <div className={`w-tile ${i % 3 === 2 ? "gold" : ""}`} aria-hidden="true">
                  <svg viewBox="0 0 300 120" preserveAspectRatio="none">
                    {[0, 1, 2, 3, 4].map((k) => (
                      <path key={k} d={`M0 ${30 + k * 16} C ${60 + i * 9} ${10 + k * 18}, ${150 - i * 7} ${80 + k * 9}, 300 ${36 + k * 15}`} />
                    ))}
                  </svg>
                  <span className="w-tile-n">{c.n}</span>
                </div>
                <p className="w-mono w-green">{c.n} · {c.meta}</p>
                <h3 className="w-h3">{c.name}</h3>
                <p className="w-slab-lead">{c.dialog.title}</p>
                <p className="w-body">{c.dialog.body}</p>
                <p className="w-mono w-slab-label">{c.dialog.aLabel}</p>
                <ul>{c.dialog.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── AGENTS (pinned pipeline) ───────── */}
      <section id="agents" className="w-agents w-night" data-pipeline data-nova-face="thinking" data-nova-line="Watch step four. That one waits for you.">
        <div className="w-wrap w-split">
          <div>
            <p className="w-mono w-gold">02 · Agent Systems</p>
            <h2 className="w-h2" data-split><Words text="Operators that do the work, with a human on the brake." accent="human on the brake." /></h2>
            <p className="w-lead">{capabilities[1].dialog.body}</p>
            <ul className="w-diamonds">{capabilities[1].dialog.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
          <div className="w-pipe" aria-label="Example pipeline">
            <div className="w-pipe-head"><span className="w-mono">Pipeline · inbox</span><span className="w-mono w-live"><i />running</span></div>
            {[["Read", "A new enquiry lands in the inbox"], ["Score", "Warm lead — routed to sales"], ["Draft", "Reply written, checked by a second agent"]].map(([t, d], i) => (
              <div className="w-step" data-step key={t}>
                <span className="w-mono">0{i + 1}</span><div><b>{t}</b><small>{d}</small></div>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
              </div>
            ))}
            <div className="w-approve" data-approve>
              <span className="w-mono">04</span>
              <div><b>Waiting for you</b><small>Nothing sends without a signature.</small></div>
              <span className="w-approve-btns"><span className="w-btn w-btn-green">Approve</span><span className="w-btn w-btn-paper">Edit</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── BESPOKEOS ───────── */}
      <section id="os" className="w-os w-paper" data-nova-face="wink" data-nova-line="That's my section — Media.">
        <div className="w-wrap">
          <div className="w-head">
            <div>
              <p className="w-mono w-green">04 · BespokeOS</p>
              <h2 className="w-h2" data-split><Words text="The whole operation, run from one window." accent="one window." /></h2>
            </div>
            <p className="w-body">{capabilities[3].dialog.bText}</p>
          </div>
          <div className="w-os-stage">
            <div className="w-os-window" data-os-window>
              <aside>
                <span className="w-logo w-logo-sm"><b>&lt;</b>OS<b>/&gt;</b></span>
                {["Factory", "Inbox & Assistant", "Clients", "Media", "Sites", "Finance"].map((n, i) => (
                  <span key={n} data-os-item className={i === 0 ? "on" : undefined}>{n}{n === "Media" && <em className="w-mono">Nova</em>}</span>
                ))}
              </aside>
              <div className="w-os-main">
                <div className="w-os-top"><b>Factory — software built, reviewed and shipped</b><span className="w-mono w-tag-gold">In active development</span></div>
                <div className="w-os-cards">
                  {[["Plan", "Scoped, gate passed", 1], ["Build", "Implementer at work", 0.6], ["Review", "Queued for reviewer", 0.15], ["Merge", "A person signs it off", 0]].map(([n, d, v]) => (
                    <div key={n as string} className={n === "Merge" ? "gold" : undefined}>
                      <span className="w-mono">{n}</span><i><b data-bar={v} /></i><small>{d}</small>
                    </div>
                  ))}
                </div>
                <p className="w-body">{capabilities[3].dialog.body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── METHOD ───────── */}
      <section id="method" className="w-method w-forest" data-method data-nova-face="calm">
        <div className="w-wrap">
          <p className="w-mono w-gold">Method · operating rhythm</p>
          <h2 className="w-h2" data-split><Words text="No discovery theatre. A gate you can stop at." accent="stop at." /></h2>
          <div className="w-method-rail">
            <svg viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 40 C 150 0, 250 80, 400 40 S 650 0, 800 40 S 1050 80, 1200 40" className="ghost" />
              <path d="M0 40 C 150 0, 250 80, 400 40 S 650 0, 800 40 S 1050 80, 1200 40" data-method-path />
            </svg>
            <i className="w-method-dot" data-method-dot aria-hidden="true" />
            <ol>
              {phases.map((p, i) => (
                <li key={p.n} data-node>
                  <span className="w-node">{p.n}</span>
                  <h3 className="w-h3">{p.name}</h3>
                  <p>{p.focus}.</p>
                  <span className="w-mono w-gold">Gate → {["a systems map", "a build plan", "a running system", "a system your team owns"][i]}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="w-principles">
            {method.items.map((it) => <p key={it} data-rise>{it}</p>)}
          </div>
        </div>
      </section>

      {/* ───────── WORK ───────── */}
      <section id="work" className="w-work w-paper" data-nova-face="shy">
        <div className="w-wrap">
          <div className="w-head">
            <div>
              <p className="w-mono w-green">Work</p>
              <h2 className="w-h2" data-split><Words text="Systems already running." accent="running." /></h2>
            </div>
            <p className="w-body">Products we build and operate — some for clients, some for ourselves first. What proves itself in-house is what we build for you.</p>
          </div>
          <div className="w-work-grid">
            {PROJECTS.map((p, i) => (
              <article key={p.id} className={`w-card w-card-${p.tone}`} data-parallax={[0.04, -0.05, 0.07][i % 3]} data-tilt>
                <div className="w-card-art" aria-hidden="true">
                  <svg viewBox="0 0 400 220" preserveAspectRatio="none">
                    {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M-10 ${20 + k * 24} C 100 ${k * 24 - 20 + i * 6}, 260 ${60 + k * 22 - i * 5}, 410 ${18 + k * 25}`} />)}
                  </svg>
                  <span className="w-card-mono">{p.mark}</span>
                </div>
                <div className="w-card-meta"><span className="w-mono">{p.layer}</span><span className="w-mono">{p.status}</span></div>
                <h3 className="w-h3">{p.title}</h3>
                <p className="w-body">{p.line}</p>
                <p className="w-stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</p>
                {p.links && (
                  <p className="w-card-links">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}<span className="w-sr"> — {p.title} (opens in a new tab)</span> <Arrow /></a>
                    ))}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FOUNDER ───────── */}
      <section id="founder" className="w-founder w-night" data-nova-face="happy">
        <div className="w-wrap w-split">
          <div>
            <p className="w-mono w-gold">Founder</p>
            <h2 className="w-h2" data-split><Words text="Built by an engineer who retires manual work." accent="retires" /></h2>
            <p className="w-lead">{FOUNDER.bio}</p>
            <div className="w-row">
              <a className="w-btn w-btn-mint" href={FOUNDER.site} target="_blank" rel="noopener" data-magnetic>{FOUNDER.name} — the long version <Arrow /></a>
              <a className="w-btn w-btn-ghost" href={FOUNDER.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </div>
          <ol className="w-timeline">
            {FOUNDER.timeline.map((r) => (
              <li key={r.period} data-rise><span className="w-mono w-gold">{r.period}</span><b>{r.title}</b><span>{r.org}</span></li>
            ))}
            <li data-rise><span className="w-mono w-gold">Thesis</span><b>{FOUNDER.thesis}</b><span>Automate the repetition. Keep the judgement.</span></li>
          </ol>
        </div>
      </section>

      {/* ───────── CONTACT ───────── */}
      <section id="contact" className="w-contact w-paper" data-nova-face="excited" data-nova-line="I'll make sure a person reads this.">
        <div className="w-wrap w-split">
          <div>
            <p className="w-mono w-green">{engage.kicker}</p>
            <h2 className="w-display w-display-md" data-split><Words text={engage.title} accent="hard part." /></h2>
            <p className="w-lead">{engage.body}</p>
            <ul className="w-diamonds w-diamonds-ink">{engage.items.map((it) => <li key={it}>{it}</li>)}</ul>
            <a className="w-mail" href="mailto:info@bespokeapps.co.za">info@bespokeapps.co.za</a>
          </div>
          <div className="w-form-slab"><ContactForm /></div>
        </div>
      </section>

      <footer className="w-footer w-night">
        <div className="w-wrap">
          <Logo />
          <span>Bespoke Applications Labs · South Africa</span>
          <a href={FOUNDER.site} target="_blank" rel="noopener">Founder&apos;s site</a>
          <span className="w-mono">© {new Date().getFullYear()}</span>
        </div>
      </footer>

      <NovaRig />
      <NovaGuide />
      <Choreography />
    </main>
  );
}
