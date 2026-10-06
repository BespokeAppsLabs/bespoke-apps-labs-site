import { Suspense } from "react";
import { Console } from "@/components/hq/console";
import { capabilities, extras, engage } from "@/content/capabilities";
import { SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/site";
import { ALL_PROVINCES, OTHER_PROVINCES, PRIMARY_PROVINCES } from "@/content/locations";

/* Rendered by the SERVER component, deliberately outside the Suspense boundary.
   Console uses useSearchParams, so anything inside that boundary is prerendered as the
   fallback — putting this here is what guarantees crawlers get every dialog body in the
   static HTML. Verified with: curl localhost:3000 | grep "Product design and front-end" */
function CrawlerContent() {
  const records = [
    ...capabilities.map((c) => ({
      id: c.id, title: c.dialog.title, body: c.dialog.body,
      items: c.dialog.items, bText: c.dialog.bText, name: c.name, short: c.short,
    })),
    ...extras.map((e) => ({ id: e.id, title: e.title, body: e.body, items: e.items, bText: e.bText, name: e.title, short: "" })),
    { id: engage.id, title: engage.title, body: engage.body, items: engage.items, bText: engage.bText, name: engage.title, short: "" },
  ];
  return (
    <div className="hq-seo">
      <h1>Bespoke Applications Labs — applications, AI operators and infrastructure</h1>
      <section>
        <h2>Where we work</h2>
        <p>
          Primary service area, in order: {PRIMARY_PROVINCES.map((p) => p.name).join(", ")}. We work
          remotely across all of South Africa, and on site where the work needs it. These are coverage
          areas, not office locations.
        </p>
        {PRIMARY_PROVINCES.map((p) => (
          <div key={p.name}>
            <h3>{p.name} ({p.abbr}) — primary service area</h3>
            <p>Provincial capital: {p.capital}.</p>
            <ul>{p.cities.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        ))}
        <h3>Rest of South Africa</h3>
        {OTHER_PROVINCES.map((p) => (
          <div key={p.name}>
            <h4>{p.name} ({p.abbr})</h4>
            <ul>{p.cities.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        ))}
      </section>
      {records.map((r) => (
        <article key={r.id}>
          <h2>{r.name}</h2>
          <p>{r.title}</p>
          {r.short && <p>{r.short}</p>}
          <p>{r.body}</p>
          <ul>{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
          <p>{r.bText}</p>
        </article>
      ))}
    </div>
  );
}

/* Schema.org, read by both search engines and the AI crawlers. Generated from the same
   content module as the page and /llms.txt, so the three cannot disagree. */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Bespoke Labs",
        url: SITE_URL,
        description: SITE_SUMMARY,
        email: "info@bespokeapps.co.za",
        /* No street address is asserted — none was provided. Country only. */
        address: { "@type": "PostalAddress", addressCountry: "ZA" },
        areaServed: [
          { "@type": "Country", name: "South Africa" },
          ...ALL_PROVINCES.map((p) => ({
            "@type": "AdministrativeArea",
            name: p.name,
            containsPlace: p.cities.map((c) => ({ "@type": "City", name: c })),
          })),
        ],
        serviceArea: PRIMARY_PROVINCES.map((p) => ({ "@type": "AdministrativeArea", name: p.name })),
        knowsAbout: capabilities.map((c) => c.name),
        makesOffer: capabilities.map((c) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}/?panel=${c.id}`,
            name: c.name,
            serviceType: c.meta,
            description: c.dialog.body,
            url: `${SITE_URL}/?panel=${c.id}`,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: c.dialog.aLabel,
              itemListElement: c.dialog.items.map((i) => ({
                "@type": "Offer", itemOffered: { "@type": "Service", name: i },
              })),
            },
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_SUMMARY,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [...extras, engage].map((e) => ({
          "@type": "Question",
          name: e.title,
          acceptedAnswer: { "@type": "Answer", text: `${e.body} ${e.bText}` },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <CrawlerContent />
      <Suspense>
        <Console />
      </Suspense>
    </>
  );
}
