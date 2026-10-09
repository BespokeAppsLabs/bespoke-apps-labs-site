"use client";
/* Small buttons that let server-rendered sections hand control to Nova. */
import { jumpTo, startTour } from "./guide";

export function TourButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return <button type="button" className={className} onClick={startTour}>{children}</button>;
}

export function JumpButton({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  return <button type="button" className={className} onClick={() => jumpTo(to)}>{children}</button>;
}
