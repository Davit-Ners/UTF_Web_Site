const OPTIMIZED_IMAGE_PATHS: Record<string, string> = {
  "/album-cover.jpg": "/optimized/album-cover.webp",
  "/bandphoto.jpg": "/optimized/bandphoto-hero.webp",
  "/gerard-logo.png": "/optimized/gerard-logo.webp",
  "/logo-typo.png": "/optimized/logo-typo.webp",
  "/gallery/band-test.jpg": "/optimized/gallery/band-test.webp",
  "/gallery/utf-band-good.jpg": "/optimized/gallery/utf-band-good.webp",
  "/gallery/band1.jpg": "/optimized/gallery/band1.webp",
  "/gallery/band2.jpg": "/optimized/gallery/band2.webp",
  "/gallery/dav1.jpg": "/optimized/gallery/dav1.webp",
  "/gallery/kev1.jpg": "/optimized/gallery/kev1.webp",
  "/gallery/bandall.jpg": "/optimized/gallery/bandall.webp",
  "/gallery/val1.jpg": "/optimized/gallery/val1.webp",
  "/band/sabari-about.jpg": "/optimized/band/sabari-about.webp",
  "/band/krys-about.jpg": "/optimized/band/krys-about.webp",
  "/concerts/utf-arlon/poster.jpg": "/optimized/concerts/utf-arlon/poster.webp",
  "/merch/core-tee.jpg": "/optimized/merch/core-tee.webp",
  "/merch/skull-hoodie.png": "/optimized/merch/skull-hoodie.webp",
  "/merch/cd-st.png": "/optimized/merch/cd-st.webp",
  "/merch/stickers.png": "/optimized/merch/stickers.webp",
  "/merch/t-shirt.jpg": "/optimized/merch/t-shirt.webp",
  "/merch/patch-2.jpg": "/optimized/merch/patch-2.webp",
  "/merch/cd2.jpg": "/optimized/merch/cd2.webp",
  "/merch/cd1.jpg": "/optimized/merch/cd1.webp",
  "/merch/patch-1.jpg": "/optimized/merch/patch-1.webp",
};

export const IMAGE_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTAnIHZpZXdCb3g9JzAgMCAxNiAxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9J2EnIGN4PSc1MCUnIGN5PSc0MCUnIHI9JzcwJSc+PHN0b3Agc3RvcC1jb2xvcj0nIzJkMTU0NScvPjxzdG9wIG9mZnNldD0nNTUlIHN0b3AtY29sb3I9JyMxNTE1MTgnLz48c3RvcCBvZmZzZXQ9JzEwMCUnIHN0b3AtY29sb3I9JyMwYTBhMGQnLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0nMTYnIGhlaWdodD0nMTAnIGZpbGw9J3VybCgjYSknLz48L3N2Zz4=";

export function getOptimizedImagePath(src?: string | null) {
  if (!src) return src;

  return OPTIMIZED_IMAGE_PATHS[src] ?? src;
}
