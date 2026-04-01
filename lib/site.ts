const SITE_URL_ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

function normalizeSiteUrl(raw: string) {
  const withProtocol =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl() {
  for (const key of SITE_URL_ENV_KEYS) {
    const value = process.env[key];

    if (value) {
      return normalizeSiteUrl(value);
    }
  }

  return "http://localhost:3000";
}
