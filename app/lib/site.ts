export function getSiteUrl(fallbackOrigin: string) {
  const configured = process.env.SITE_URL;
  return configured ? configured.replace(/\/$/, "") : fallbackOrigin;
}
