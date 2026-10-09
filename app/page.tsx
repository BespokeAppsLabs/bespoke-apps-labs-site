import { capabilities, extras, engage } from "@/content/capabilities";
import { WovenHome } from "@/components/woven/home";
import "./woven.css";
import { SITE_NAME, SITE_SUMMARY, SITE_URL } from "@/lib/site";
import { ALL_PROVINCES, OTHER_PROVINCES, PRIMARY_PROVINCES } from "@/content/locations";

/* Service-area detail for crawlers. Everything else is visible page copy in WovenHome. */
function CoverageContent() {
  return (
    <div className="hq-seo">
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
            "@id": `${SITE_URL}/#layers`,
            name: c.name,
            serviceType: c.meta,
            description: c.dialog.body,
            url: `${SITE_URL}/#layers`,
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
      <WovenHome />
      <CoverageContent />
    </>
  );
}
