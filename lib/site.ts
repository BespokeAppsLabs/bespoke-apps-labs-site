import { capabilities, extras, engage } from "@/content/capabilities";
import { OTHER_PROVINCES, PRIMARY_PROVINCES } from "@/content/locations";

/* Set NEXT_PUBLIC_SITE_URL in Vercel. The fallback is a best guess from the contact
   address — confirm the real production domain before launch. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bespokeapps.co.za").replace(/\/$/, "");

export const SITE_NAME = "Bespoke Applications Labs";
export const SITE_TAGLINE = "Systems for serious work";
export const SITE_SUMMARY =
  "An independent digital systems studio. We engineer the applications, AI operators and infrastructure that turn complex businesses into clear, capable systems.";

/* One generator for /llms.txt and /llms-full.txt so the machine-readable copy can never
   drift from what the page itself shows. */
export function llmsText(full: boolean): string {
  const L: string[] = [];
  L.push(`# ${SITE_NAME}`);
  L.push("");
  L.push(`> ${SITE_SUMMARY}`);
  L.push("");
  L.push(
    "Bespoke Applications Labs is a South Africa based studio working across six layers: product, " +
    "intelligence, creative, commerce, infrastructure and capability. The site is a single operator " +
    "console — every section below opens as a dialog on the same page, addressable as " +
    "`/?panel=<id>`. There are deliberately no metrics, client logos or testimonials on the site; " +
    "none were verifiable, and none were invented."
  );
  L.push("");

  L.push("## Capabilities");
  L.push("");
  for (const c of capabilities) {
    L.push(`### ${c.n} — ${c.name} (${c.meta})`);
    L.push(`URL: ${SITE_URL}/?panel=${c.id}`);
    L.push("");
    L.push(c.dialog.title);
    L.push("");
    L.push(c.dialog.body);
    L.push("");
    L.push(`${c.dialog.aLabel}:`);
    for (const i of c.dialog.items) L.push(`- ${i}`);
    L.push("");
    if (full) {
      L.push(`${c.dialog.bLabel}: ${c.dialog.bText}`);
      L.push("");
    }
  }

  L.push("## The studio, method and disciplines");
  L.push("");
  for (const e of extras) {
    L.push(`### ${e.title}`);
    L.push(`URL: ${SITE_URL}/?panel=${e.id}`);
    L.push("");
    L.push(e.body);
    L.push("");
    L.push(`${e.aLabel}:`);
    for (const i of e.items) L.push(`- ${i}`);
    L.push("");
    if (full) {
      L.push(`${e.bLabel}: ${e.bText}`);
      L.push("");
    }
  }

  L.push("## Where we work");
  L.push("");
  L.push(
    "Primary service area, in order: " +
    PRIMARY_PROVINCES.map((p) => p.name).join(", ") +
    ". We work remotely across all of South Africa, and on site where the work needs it."
  );
  L.push("");
  for (const pr of PRIMARY_PROVINCES) {
    L.push(`### ${pr.name} (${pr.abbr}) — primary`);
    L.push(`Provincial capital: ${pr.capital}.`);
    L.push(`Cities and towns served: ${pr.cities.join(", ")}.`);
    L.push("");
  }
  L.push("### Rest of South Africa");
  L.push("");
  for (const pr of OTHER_PROVINCES) {
    L.push(`- ${pr.name} (${pr.abbr}): ${pr.cities.join(", ")}.`);
  }
  L.push("");
  L.push(
    "These are coverage areas, not office locations — the studio does not claim a branch in " +
    "every city listed."
  );
  L.push("");

  L.push("## Engagement");
  L.push("");
  L.push(`URL: ${SITE_URL}/?panel=engage`);
  L.push("");
  L.push(engage.body);
  L.push("");
  L.push(`${engage.aLabel}:`);
  for (const i of engage.items) L.push(`- ${i}`);
  L.push("");
  L.push("Contact: hello@bespokelabs.dev");
  L.push("");
  if (!full) {
    L.push("## Optional");
    L.push("");
    L.push(`- [Full text](${SITE_URL}/llms-full.txt): every section in full, including engagement shape.`);
    L.push("");
  }
  return L.join("\n");
}
