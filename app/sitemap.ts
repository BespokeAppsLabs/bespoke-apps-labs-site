import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { capabilities, extras, engage } from "@/content/capabilities";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const panels = [...capabilities.map((c) => c.id), ...extras.map((e) => e.id), engage.id];
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...panels.map((id) => ({
      url: `${SITE_URL}/?panel=${id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
