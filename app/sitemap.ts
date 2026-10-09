import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* One page. Sections are anchors on it, not separate URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
