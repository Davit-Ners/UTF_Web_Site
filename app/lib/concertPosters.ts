/* Measured from the served files, not from the original/optimized filename. */
const POSTER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/concerts/utf-arlon/poster.jpg": { width: 1920, height: 1005 },
  "/optimized/concerts/utf-arlon/poster.webp": { width: 1400, height: 733 },
  "/optimized/concerts/utf-braine/utf-braine-optimized.webp": { width: 1440, height: 1440 },
  "/optimized/concerts/utf-mule/utf-mule-optimized.webp": { width: 1440, height: 1620 },
};

export function concertPosterDimensions(src?: string | null) {
  return src ? POSTER_DIMENSIONS[src] : undefined;
}
