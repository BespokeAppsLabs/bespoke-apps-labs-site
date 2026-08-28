import { llmsText } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsText(true), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
