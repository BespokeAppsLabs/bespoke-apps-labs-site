"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import ContactForm from "@/components/contact-form";
export type DialogRecord={id:string;title:string;body:string;kicker?:string;aLabel?:string;items?:string[];bLabel?:string;bText?:string;contact?:boolean};
export function ConsoleDialog({item,open,onOpenChange}:{item:DialogRecord;open:boolean;onOpenChange:(open:boolean)=>void}) { return <Dialog.Root open={open} onOpenChange={onOpenChange}>{open && <Dialog.Portal><Dialog.Overlay className="hq-overlay is-open"/><Dialog.Content className="hq-dialog is-open" aria-describedby={`${item.id}-body`}><Dialog.Close className="hq-close" aria-label="Close"><X size={18}/></Dialog.Close><p className="hq-dialog-kicker">{item.kicker ?? "Bespoke Applications Labs"}</p><Dialog.Title>{item.title}</Dialog.Title><p id={`${item.id}-body`}>{item.body}</p>{item.contact?<ContactForm/>:<div className="hq-dialog-grid"><section><b>{item.aLabel ?? "What it covers"}</b><ul>{item.items?.map(x=><li key={x}>{x}</li>)}</ul></section><section><b>{item.bLabel}</b><p>{item.bText}</p></section></div>}</Dialog.Content></Dialog.Portal>}</Dialog.Root> }
