/* Confirmed canonical production origin (www redirects here, see next.config.ts) */
export const PRODUCTION_SITE_URL = "https://untiltheyfall.com";

const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(raw: string) {
  const withProtocol =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

  return withProtocol.replace(/\/+$/, "");
}

/*
 * Origin for canonicals, metadataBase, sitemap, robots and JSON-LD.
 * Production builds (including Vercel previews) always use the apex domain,
 * so a deployment URL can never become canonical. Outside production,
 * NEXT_PUBLIC_SITE_URL may point at another origin; otherwise localhost.
 */
export function getSiteUrl(env: NodeJS.ProcessEnv = process.env) {
  if (env.NODE_ENV === "production") return PRODUCTION_SITE_URL;

  const override = env.NEXT_PUBLIC_SITE_URL?.trim();
  return override ? normalizeSiteUrl(override) : LOCAL_SITE_URL;
}
