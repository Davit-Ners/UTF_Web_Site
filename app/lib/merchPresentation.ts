/*
 * Presentation data the Product table does not hold. Dimensions are
 * measured from the files; nothing here changes product data.
 */

export type MerchImage = { src: string; width: number; height: number; label?: string };

/* Below this width a file is shown at a reduced scale */
const LOW_RES_BELOW = 1500;

const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/merch/t-shirt.jpg": { width: 2034, height: 2047 },
  "/merch/patch-1.jpg": { width: 1942, height: 2047 },
  "/merch/patch-2.jpg": { width: 2048, height: 2038 },
  "/merch/cd1.jpg": { width: 2048, height: 2048 },
  "/merch/cd2.jpg": { width: 2048, height: 1116 },
  "/merch/stickers.png": { width: 1024, height: 1024 },
  "/merch/cd-st.png": { width: 1024, height: 1024 },
  "/merch/skull-hoodie.png": { width: 1024, height: 1024 },
  "/merch/core-tee.jpg": { width: 872, height: 1188 },
};

/* Products that need a size; sizes are requested in the order notes for now */
const SIZED_PRODUCTS = new Set(["tee-core-logo", "tee-artwork"]);

/* Extra real views of a product, shown editorially in its plate */
const EXTRA_VIEWS: Record<string, MerchImage[]> = {
  "cd-std": [{ src: "/merch/cd2.jpg", width: 2048, height: 1116, label: "Open case" }],
};

export function merchImage(src?: string): MerchImage | null {
  if (!src) return null;
  const size = IMAGE_DIMENSIONS[src];
  return size ? { src, ...size } : null;
}

export function isLowRes(image: MerchImage) {
  return image.width < LOW_RES_BELOW;
}

export function needsSize(slug?: string) {
  return slug ? SIZED_PRODUCTS.has(slug) : false;
}

export function extraViews(slug?: string) {
  return slug ? EXTRA_VIEWS[slug] ?? [] : [];
}
