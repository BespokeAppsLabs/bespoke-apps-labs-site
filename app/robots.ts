import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* AI crawlers are named explicitly and allowed. If the studio ever wants to opt out of
   model training while staying in AI search results, disallow GPTBot / ClaudeBot /
   Google-Extended and keep OAI-SearchBot and PerplexityBot — they are different jobs. */
export default function robots(): MetadataRoute.Robots {
  const agents = [
    "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
    "PerplexityBot", "Perplexity-User",
    "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "cohere-ai", "Meta-ExternalAgent",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...agents.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
