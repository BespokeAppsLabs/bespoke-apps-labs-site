"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface VersionToggleProps {
  current: "v1" | "v2";
  className?: string;
}

export default function VersionToggle({ current, className }: VersionToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full p-0.5",
        "bg-background/60 backdrop-blur-md border border-border/40",
        className
      )}
    >
      <Link
        href="/v1"
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-semibold transition-all",
          current === "v1"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        v1
      </Link>
      <Link
        href="/v2"
        className={cn(
          "px-2.5 py-1 rounded-full text-xs font-semibold transition-all",
          current === "v2"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        v2
      </Link>
    </div>
  );
}
