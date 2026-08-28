"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { capabilities, extras, engage, phases } from "@/content/capabilities";
import { Panel } from "./panel";
import { Field } from "./field";
import { Wires } from "./wires";
import { ConsoleDialog, type DialogRecord } from "./dialog";

const records: DialogRecord[] = [
  ...capabilities.map((x) => ({
    id: x.id, kicker: `${x.n} / ${x.name.toUpperCase()}`,
    title: x.dialog.title, body: x.dialog.body,
    aLabel: x.dialog.aLabel, items: x.dialog.items,
    bLabel: x.dialog.bLabel, bText: x.dialog.bText,
  })),
  ...extras,
  { ...engage, contact: true },
];

function Clock() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => setClock(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Johannesburg", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }).format(new Date()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="hq-clock">{clock || "--:--:--"}</span>;
}

export function Console() {
  const params = useSearchParams(), router = useRouter(), path = usePathname();
  const q = params.get("panel");
  const active = records.some((x) => x.id === q) ? q! : undefined;
  const [hot, setHot] = useState<string>();

  const open = (id: string) => router.push(`${path}?panel=${id}`, { scroll: false });
  const close = () => router.push(path, { scroll: false });

  return (
    <main className={`hq ${active ? "has-dialog" : ""}`}>
      <header className="hq-topbar">
        <div className="hq-brand">
          <span className="hq-logo"><b>&lt;</b>Bespoke<i>/</i><b>&gt;</b></span>
          <span className="hq-logo-sub">applications labs</span>
        </div>
        <div className="hq-status">
          <a href="mailto:hello@bespokelabs.dev">hello@bespokelabs.dev ↗</a>
          <span><i />console live</span>
          <Clock />
          <span>SAST</span>
        </div>
      </header>

      <div className="hq-grid">
        <Wires items={capabilities} hot={hot} active={active} />

        <section className="hq-column">
          {capabilities.slice(0, 3).map((x) => (
            <Panel key={x.id} item={x} hot={hot === x.id} active={active === x.id} onOpen={open} onHot={setHot} />
          ))}
        </section>

        <section className="hq-centre">
          <div className="hq-lockup">
            <p>Operator console — v3</p>
            <h1><span className="hq-logo"><b>&lt;</b>Bespoke<i>/</i><b>&gt;</b></span></h1>
            <div className="hq-logo-sub hq-lockup-sub">applications labs</div>
            <div className="hq-chips">
              {extras.map((x) => (
                <button key={x.id} className="hq-chip" onClick={() => open(x.id)}>{x.title}</button>
              ))}
            </div>
          </div>

          <Field items={capabilities} hot={hot} active={active} onOpen={open} onHot={setHot} />

          <div className="hq-bottom">
            <div className="hq-rail-head">
              <span>Operating rhythm</span><i /><span>Every build runs this way</span>
            </div>
            <div className="hq-rail">
              {phases.map((f) => (
                <button key={f.n} className={f.live ? "is-live" : ""} onClick={() => open("rhythm")}>
                  <i /><b>{f.n} {f.name}</b><small>{f.focus}</small>
                </button>
              ))}
            </div>
            <div className="hq-cta">
              <button className="hq-btn" onClick={() => open("engage")}>Start a build <span>↘</span></button>
              <button className="hq-btn-ghost" onClick={() => open("studio")}>How we work</button>
            </div>
          </div>
        </section>

        <section className="hq-column">
          {capabilities.slice(3).map((x) => (
            <Panel key={x.id} item={x} hot={hot === x.id} active={active === x.id} onOpen={open} onHot={setHot} />
          ))}
        </section>
      </div>

      {active && (
        <ConsoleDialog item={records.find((x) => x.id === active)!} open onOpenChange={(n) => !n && close()} />
      )}
    </main>
  );
}
