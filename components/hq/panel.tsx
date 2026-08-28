"use client";
import type { Capability } from "@/content/capabilities";
import { CapIcon } from "./icons";
export function Panel({item, hot, active, onOpen, onHot}:{item:Capability;hot:boolean;active:boolean;onOpen:(id:string)=>void;onHot:(id:string|undefined)=>void}) {
 return <button className={`hq-panel ${hot || active ? "is-hot" : ""}`} onClick={()=>onOpen(item.id)} onMouseEnter={()=>onHot(item.id)} onMouseLeave={()=>onHot(undefined)} aria-haspopup="dialog">
  <span className="hq-panel-head" data-port={item.id}><span className="hq-panel-icon"><CapIcon id={item.id} size={17} /></span><span className="hq-num">{item.n}</span><strong>{item.name}</strong><b>↗</b></span>
  <span className="hq-short">{item.short}</span><span className="hq-list">{item.dialog.items.map(x=><span key={x}>◆ {x}</span>)}</span><span className="hq-meta">{item.meta}<em>Open</em></span>
 </button>;
}
